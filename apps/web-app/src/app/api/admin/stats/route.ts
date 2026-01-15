import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { AdminStats, AdminSignal } from '@/types/admin';

// Initialize Admin Clients (Bypass RLS for aggregation)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // 1. Security Check
        const supabase = await import('@/lib/supabase-server').then(m => m.createSupabaseServerClient());
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check if user has admin role
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch User Stats
        const { count: totalUsers, error: usersError } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // 3. Fetch Stripe MRR (Approximation from subscriptions)
        // In production, use Stripe Billing Metrics API.
        // Here, we list active subscriptions.
        const subscriptions = await stripe.subscriptions.list({
            status: 'active',
            limit: 100, // Clamp for performance
        });

        const mrr = subscriptions.data.reduce((acc, sub) => {
            const price = sub.items.data[0].price.unit_amount || 0;
            return acc + (price / 100);
        }, 0);

        // 4. Fetch Recent Activity (from activity_feed or profiles)
        // Let's get last 5 signups as signals
        const { data: recentSignups } = await supabaseAdmin
            .from('profiles')
            .select('email, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        const signals: AdminSignal[] = (recentSignups || []).map(p => ({
            id: p.email, // using email as id for now
            type: 'signup',
            message: `New User: ${p.email}`,
            timestamp: p.created_at,
            level: 'info'
        }));

        // 5. Mock Revenue History (Replace with real Stripe data later)
        const revenueHistory = [
            { name: 'Jan', value: 4000 },
            { name: 'Feb', value: 3000 },
            { name: 'Mar', value: mrr * 0.8 }, // dynamic-ish
            { name: 'Apr', value: mrr },
        ];

        const stats: AdminStats = {
            totalUsers: totalUsers || 0,
            activeUsers: Math.floor((totalUsers || 0) * 0.6), // Mock active ratio
            mrr,
            systemHealth: 'stable',
            recentSignals: signals,
            revenueHistory
        };

        return NextResponse.json(stats);

    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
