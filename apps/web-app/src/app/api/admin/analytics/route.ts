/**
 * Admin API - Analytics Dashboard
 * Real-time stats and metrics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

// Helper to check admin permission
async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);

    if (!data) return false;
    return data.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name));
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const isAdmin = await checkAdminPermission(supabase, user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const period = url.searchParams.get('period') || '7d'; // '24h', '7d', '30d', '90d', '1y'

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case '24h':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const startDateStr = startDate.toISOString();

        // Fetch all stats in parallel
        const [
            usersResult,
            newUsersResult,
            subscriptionsResult,
            promoCodesResult,
            rolesResult,
            activityLogsResult,
        ] = await Promise.all([
            // Total users
            supabase.from('profiles').select('*', { count: 'exact', head: true }),

            // New users in period
            supabase.from('profiles')
                .select('id, created_at')
                .gte('created_at', startDateStr)
                .order('created_at', { ascending: false }),

            // Subscriptions by status
            supabase.from('user_subscriptions').select('plan_type, status'),

            // Promo codes usage
            supabase.from('promo_codes')
                .select('id, code, current_uses, max_uses, is_active'),

            // Roles distribution
            supabase.from('user_role_assignments')
                .select('role:user_roles(name, display_name)'),

            // Recent activity
            supabase.from('admin_activity_logs')
                .select('action_type, created_at')
                .gte('created_at', startDateStr)
                .order('created_at', { ascending: false }),
        ]);

        // Calculate metrics
        const totalUsers = usersResult.count || 0;
        const newUsers = newUsersResult.data?.length || 0;

        // User growth chart data
        const userGrowthByDay: Record<string, number> = {};
        (newUsersResult.data || []).forEach((user: any) => {
            const day = user.created_at.split('T')[0];
            userGrowthByDay[day] = (userGrowthByDay[day] || 0) + 1;
        });

        // Subscriptions breakdown
        const subscriptionsByPlan: Record<string, number> = {};
        const subscriptionsByStatus: Record<string, number> = {};
        (subscriptionsResult.data || []).forEach((sub: any) => {
            subscriptionsByPlan[sub.plan_type] = (subscriptionsByPlan[sub.plan_type] || 0) + 1;
            subscriptionsByStatus[sub.status] = (subscriptionsByStatus[sub.status] || 0) + 1;
        });

        // Promo codes stats
        const totalPromoCodes = promoCodesResult.data?.length || 0;
        const activePromoCodes = promoCodesResult.data?.filter((c: any) => c.is_active).length || 0;
        const totalPromoUsage = promoCodesResult.data?.reduce((sum: number, c: any) => sum + (c.current_uses || 0), 0) || 0;

        // Roles breakdown
        const rolesCounts: Record<string, number> = {};
        (rolesResult.data || []).forEach((r: any) => {
            const name = r.role?.display_name || 'Unknown';
            rolesCounts[name] = (rolesCounts[name] || 0) + 1;
        });

        // Activity by type
        const activityByType: Record<string, number> = {};
        const activityByDay: Record<string, number> = {};
        (activityLogsResult.data || []).forEach((log: any) => {
            activityByType[log.action_type] = (activityByType[log.action_type] || 0) + 1;
            const day = log.created_at.split('T')[0];
            activityByDay[day] = (activityByDay[day] || 0) + 1;
        });

        // Growth percentage
        const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
        const { count: previousPeriodUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', previousPeriodStart.toISOString())
            .lt('created_at', startDateStr);

        const growthPercentage = previousPeriodUsers
            ? Math.round(((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
            : 100;

        return NextResponse.json({
            period,
            generated_at: new Date().toISOString(),

            // Key metrics
            kpis: {
                total_users: totalUsers,
                new_users: newUsers,
                growth_percentage: growthPercentage,
                active_subscriptions: subscriptionsByStatus['active'] || 0,
                total_promo_codes: totalPromoCodes,
                active_promo_codes: activePromoCodes,
                promo_usage: totalPromoUsage,
                admin_actions: activityLogsResult.data?.length || 0,
            },

            // Charts data
            charts: {
                user_growth: Object.entries(userGrowthByDay)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => ({ date, count })),

                subscriptions_by_plan: Object.entries(subscriptionsByPlan)
                    .map(([plan, count]) => ({ plan, count })),

                subscriptions_by_status: Object.entries(subscriptionsByStatus)
                    .map(([status, count]) => ({ status, count })),

                roles_distribution: Object.entries(rolesCounts)
                    .map(([role, count]) => ({ role, count })),

                activity_by_type: Object.entries(activityByType)
                    .map(([type, count]) => ({ type, count })),

                activity_timeline: Object.entries(activityByDay)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => ({ date, count })),
            },

            // Top promo codes
            top_promo_codes: (promoCodesResult.data || [])
                .sort((a: any, b: any) => (b.current_uses || 0) - (a.current_uses || 0))
                .slice(0, 5)
                .map((c: any) => ({
                    code: c.code,
                    uses: c.current_uses || 0,
                    max: c.max_uses,
                    active: c.is_active,
                })),
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
