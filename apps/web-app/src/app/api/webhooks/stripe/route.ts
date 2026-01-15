import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/email-templates";

// Init Supabase Admin client to bypass RLS for webhook updates
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    // Headers in Server Components/Route Handlers must be awaited in some Next.js versions, 
    // but usually headers() is the way or req.headers.
    // In Route Handlers standard Request object:
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Event handlers
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    // Handle Checkout Session Completed
    if (event.type === "checkout.session.completed") {
        if (!session?.metadata?.userId) {
            return new NextResponse("Webhook Error: No user ID in metadata", { status: 400 });
        }

        const subscriptionId = session.subscription as string;

        // Update user profile with customer ID
        await supabaseAdmin
            .from("profiles")
            .update({
                stripe_customer_id: session.customer as string,
                is_premium: true
            })
            .eq("id", session.metadata.userId);

        // Get user profile for email
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("username, email")
            .eq("id", session.metadata.userId)
            .single();

        // Get user email from Supabase Auth
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(session.metadata.userId);
        const email = user?.email || profile?.email;
        const username = profile?.username || email?.split('@')[0] || 'Athlete';

        // Send subscription confirmation email
        if (email) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            let html = emailTemplates.subscriptionConfirmation(username, 'Titan Pro');
            html = html
                .replace(/{app_url}/g, appUrl)
                .replace(/{unsubscribe_url}/g, `${appUrl}/settings/notifications`)
                .replace(/{preferences_url}/g, `${appUrl}/settings/notifications`);

            await sendEmail({
                to: email,
                subject: `🔥 Tu es maintenant Titan Pro, ${username}`,
                html
            });
            console.log(`[STRIPE] Subscription confirmation email sent to ${email}`);
        }

        console.log(`[STRIPE] Checkout completed for User ${session.metadata.userId}`);
    }

    // Handle Subscription Created / Updated
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
        const userId = await getUserIdFromCustomer(subscription.customer as string);
        if (!userId) return new NextResponse("User not found for customer", { status: 200 });

        const status = subscription.status;
        const isPremium = status === 'active' || status === 'trialing';

        // Upsert subscription data
        const { error } = await supabaseAdmin
            .from("subscriptions")
            .upsert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                stripe_price_id: subscription.items.data[0].price.id,
                status: subscription.status,
                current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
                current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
            }, { onConflict: 'stripe_subscription_id' });

        if (error) console.error('[STRIPE] Error syncing subscription:', error);

        // Update profile status
        await supabaseAdmin
            .from("profiles")
            .update({ is_premium: isPremium })
            .eq("id", userId);

        console.log(`[STRIPE] Subscription ${subscription.id} synced`);
    }

    // Handle Subscription Deleted
    if (event.type === "customer.subscription.deleted") {
        const userId = await getUserIdFromCustomer(subscription.customer as string);
        if (userId) {
            await supabaseAdmin
                .from("subscriptions")
                .update({ status: 'canceled', updated_at: new Date().toISOString() })
                .eq("stripe_subscription_id", subscription.id);

            await supabaseAdmin
                .from("profiles")
                .update({ is_premium: false })
                .eq("id", userId);

            console.log(`[STRIPE] Subscription ${subscription.id} deleted`);
        }
    }

    return new NextResponse(null, { status: 200 });
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
    const { data } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();
    return data?.id || null;
}

