/**
 * POST /api/wearables/sync
 * Force manual sync of wearable data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';
import { getTerraClient } from '@/lib/terra-client';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // Get user's active connections
        const { data: connections, error } = await supabase
            .from('user_wearable_connections')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (error || !connections || connections.length === 0) {
            return NextResponse.json({
                status: 'no_connections',
                message: 'Aucun wearable connecté',
            });
        }

        // Check if Terra is configured
        if (!process.env.TERRA_API_KEY || !process.env.TERRA_DEV_ID) {
            return NextResponse.json({
                status: 'development_mode',
                message: 'Terra API non configuré. Données simulées.',
                mock_data: generateMockHealthData(),
            });
        }

        const terraClient = getTerraClient();
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const results = [];

        for (const connection of connections) {
            if (!connection.terra_user_id) continue;

            try {
                // Fetch activity data
                const activityData = await terraClient.getActivity(
                    connection.terra_user_id,
                    weekAgo,
                    today
                );

                // Fetch sleep data
                const sleepData = await terraClient.getSleep(
                    connection.terra_user_id,
                    weekAgo,
                    today
                );

                results.push({
                    provider: connection.provider,
                    activity: activityData.data?.length || 0,
                    sleep: sleepData.data?.length || 0,
                });

                // Update last sync time
                await supabase
                    .from('user_wearable_connections')
                    .update({ last_sync_at: new Date().toISOString() })
                    .eq('id', connection.id);

            } catch (err) {
                console.error(`Sync error for ${connection.provider}:`, err);
                results.push({
                    provider: connection.provider,
                    error: err instanceof Error ? err.message : 'Sync failed',
                });
            }
        }

        return NextResponse.json({
            status: 'success',
            synced: results,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'Erreur de synchronisation' },
            { status: 500 }
        );
    }
}

// GET: Get latest health data
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days') || '7');

        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Get daily summaries
        const { data: summaries, error: summaryError } = await supabase
            .from('daily_health_summary')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate)
            .order('date', { ascending: false });

        // Get recent metrics
        const { data: metrics, error: metricsError } = await supabase
            .from('health_metrics')
            .select('*')
            .eq('user_id', user.id)
            .gte('recorded_at', `${startDate}T00:00:00Z`)
            .order('recorded_at', { ascending: false })
            .limit(100);

        // If no data, return mock data for demo
        if ((!summaries || summaries.length === 0) && (!metrics || metrics.length === 0)) {
            return NextResponse.json({
                status: 'demo_mode',
                message: 'Données de démonstration',
                data: generateMockHealthData(),
            });
        }

        return NextResponse.json({
            status: 'success',
            summaries: summaries || [],
            metrics: metrics || [],
        });

    } catch (error) {
        console.error('Get health data error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

function generateMockHealthData() {
    const today = new Date();
    const data = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toISOString().split('T')[0],
            total_steps: Math.floor(5000 + Math.random() * 10000),
            total_calories_burned: Math.floor(1800 + Math.random() * 800),
            total_distance_km: Math.round((3 + Math.random() * 7) * 10) / 10,
            avg_heart_rate: Math.floor(60 + Math.random() * 30),
            sleep_hours: Math.round((6 + Math.random() * 3) * 10) / 10,
            recovery_score: Math.floor(50 + Math.random() * 50),
        });
    }

    return data;
}
