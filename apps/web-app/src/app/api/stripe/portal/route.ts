
import { NextRequest, NextResponse } from "next/server";
import { stripe, getAbsoluteUrl } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get user profile to find Stripe Customer ID
        const { data: profile } = await supabase
            .from("profiles")
            .select("stripe_customer_id")
            .eq("id", user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return new NextResponse("No stripe customer found", { status: 404 });
        }

        const settingsUrl = getAbsoluteUrl("/settings");

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: settingsUrl,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.log("[STRIPE_PORTAL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
