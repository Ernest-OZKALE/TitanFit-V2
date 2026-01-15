/**
 * Admin API - Data Export
 * Export users, analytics, and other data as CSV/Excel
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

// Helper to convert to CSV
function toCSV(data: any[], columns: string[]): string {
    if (!data || data.length === 0) return '';

    const header = columns.join(',');
    const rows = data.map(row =>
        columns.map(col => {
            const value = row[col];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return String(value);
        }).join(',')
    );

    return [header, ...rows].join('\n');
}

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
        const type = url.searchParams.get('type'); // 'users', 'analytics', 'promo_codes', 'orders', 'activity_logs'
        const format = url.searchParams.get('format') || 'csv'; // 'csv' or 'json'
        const startDate = url.searchParams.get('start_date');
        const endDate = url.searchParams.get('end_date');

        let data: any[] = [];
        let columns: string[] = [];
        let filename = '';

        switch (type) {
            case 'users':
                const { data: users } = await supabase
                    .from('profiles')
                    .select('id, email, display_name, created_at, updated_at')
                    .order('created_at', { ascending: false });
                data = users || [];
                columns = ['id', 'email', 'display_name', 'created_at', 'updated_at'];
                filename = `users_export_${new Date().toISOString().split('T')[0]}`;
                break;

            case 'promo_codes':
                const { data: codes } = await supabase
                    .from('promo_codes')
                    .select('*')
                    .order('created_at', { ascending: false });
                data = codes || [];
                columns = ['code', 'description', 'discount_type', 'discount_value', 'current_uses', 'max_uses', 'valid_until', 'is_active', 'created_at'];
                filename = `promo_codes_export_${new Date().toISOString().split('T')[0]}`;
                break;

            case 'activity_logs':
                let logsQuery = supabase
                    .from('admin_activity_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1000);

                if (startDate) {
                    logsQuery = logsQuery.gte('created_at', startDate);
                }
                if (endDate) {
                    logsQuery = logsQuery.lte('created_at', endDate);
                }

                const { data: logs } = await logsQuery;
                data = logs || [];
                columns = ['admin_id', 'action_type', 'target_type', 'target_id', 'target_email', 'created_at'];
                filename = `activity_logs_${new Date().toISOString().split('T')[0]}`;
                break;

            case 'subscriptions':
                const { data: subs } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .order('created_at', { ascending: false });
                data = subs || [];
                columns = ['user_id', 'plan_type', 'status', 'current_period_start', 'current_period_end', 'created_at'];
                filename = `subscriptions_export_${new Date().toISOString().split('T')[0]}`;
                break;

            case 'health_metrics':
                let metricsQuery = supabase
                    .from('daily_health_summary')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(1000);

                if (startDate) {
                    metricsQuery = metricsQuery.gte('date', startDate);
                }
                if (endDate) {
                    metricsQuery = metricsQuery.lte('date', endDate);
                }

                const { data: metrics } = await metricsQuery;
                data = metrics || [];
                columns = ['user_id', 'date', 'total_steps', 'total_calories_burned', 'total_distance_km', 'avg_heart_rate', 'sleep_hours'];
                filename = `health_metrics_${new Date().toISOString().split('T')[0]}`;
                break;

            case 'roles':
                const { data: roleAssignments } = await supabase
                    .from('user_role_assignments')
                    .select(`
                        user_id,
                        granted_at,
                        expires_at,
                        reason,
                        role:user_roles(name, display_name)
                    `)
                    .order('granted_at', { ascending: false });

                data = (roleAssignments || []).map(r => {
                    const role = Array.isArray(r.role) ? r.role[0] : r.role;
                    return {
                        user_id: r.user_id,
                        role_name: role?.name,
                        role_display: role?.display_name,
                        granted_at: r.granted_at,
                        expires_at: r.expires_at,
                        reason: r.reason,
                    };
                });
                columns = ['user_id', 'role_name', 'role_display', 'granted_at', 'expires_at', 'reason'];
                filename = `role_assignments_${new Date().toISOString().split('T')[0]}`;
                break;

            default:
                return NextResponse.json(
                    {
                        error: 'Type d\'export invalide',
                        available_types: ['users', 'promo_codes', 'activity_logs', 'subscriptions', 'health_metrics', 'roles']
                    },
                    { status: 400 }
                );
        }

        // Return JSON if requested
        if (format === 'json') {
            return NextResponse.json({
                type,
                count: data.length,
                data,
                exported_at: new Date().toISOString(),
            });
        }

        // Return CSV
        const csv = toCSV(data, columns);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'export' },
            { status: 500 }
        );
    }
}

// POST: Bulk export multiple types at once
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { types } = body as { types: string[] };

        if (!types || types.length === 0) {
            return NextResponse.json(
                { error: 'Spécifiez les types à exporter' },
                { status: 400 }
            );
        }

        const exports: Record<string, any> = {};

        for (const type of types) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/export?type=${type}&format=json`, {
                headers: {
                    cookie: request.headers.get('cookie') || '',
                },
            });
            const data = await response.json();
            exports[type] = data;
        }

        return NextResponse.json({
            exports,
            exported_at: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Bulk export error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
