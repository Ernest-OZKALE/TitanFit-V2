import { NextRequest, NextResponse } from "next/server";
import { stripe, getAbsoluteUrl } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const TITAN_PRO_PRICE_ID = "price_1QjXXXXXX"; // Placeholder - User must replace this in env later or here

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const settingsUrl = getAbsoluteUrl("/dashboard/settings");

        // 1. Check if user already has a stripe customer ID in logic (Optional for MVP, better for later)
        // For MVP, we will rely on email matching or metadata.

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.email,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID || TITAN_PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error: any) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
