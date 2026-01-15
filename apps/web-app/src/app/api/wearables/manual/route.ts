/**
 * POST /api/wearables/manual
 * Free alternative - Manual health data entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

interface ManualHealthEntry {
    date: string;
    steps: number;
    calories: number;
    distance: number;
    heartRate: number;
    sleepHours: number;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const entry: ManualHealthEntry = await request.json();

        // Validate date
        if (!entry.date || isNaN(Date.parse(entry.date))) {
            return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
        }

        // Insert or update daily summary
        const { error: summaryError } = await supabase
            .from('daily_health_summary')
            .upsert({
                user_id: user.id,
                date: entry.date,
                total_steps: entry.steps || 0,
                total_calories_burned: entry.calories || 0,
                total_distance_km: entry.distance || 0,
                avg_heart_rate: entry.heartRate || null,
                sleep_hours: entry.sleepHours || null,
            }, {
                onConflict: 'user_id,date',
            });

        if (summaryError) {
            console.error('Error saving summary:', summaryError);

            // If table doesn't exist, save to localStorage via response
            return NextResponse.json({
                status: 'local_storage',
                message: 'Données sauvegardées localement (table non disponible)',
                data: entry,
            });
        }

        // Also insert individual metrics for granular tracking
        const recordedAt = `${entry.date}T12:00:00Z`;
        const metrics = [];

        if (entry.steps > 0) {
            metrics.push({
                user_id: user.id,
                metric_type: 'steps',
                value: entry.steps,
                unit: 'count',
                recorded_at: recordedAt,
                source: 'manual',
            });
        }

        if (entry.calories > 0) {
            metrics.push({
                user_id: user.id,
                metric_type: 'calories',
                value: entry.calories,
                unit: 'kcal',
                recorded_at: recordedAt,
                source: 'manual',
            });
        }

        if (entry.distance > 0) {
            metrics.push({
                user_id: user.id,
                metric_type: 'distance',
                value: entry.distance,
                unit: 'km',
                recorded_at: recordedAt,
                source: 'manual',
            });
        }

        if (entry.heartRate > 0) {
            metrics.push({
                user_id: user.id,
                metric_type: 'heart_rate',
                value: entry.heartRate,
                unit: 'bpm',
                recorded_at: recordedAt,
                source: 'manual',
            });
        }

        if (entry.sleepHours > 0) {
            metrics.push({
                user_id: user.id,
                metric_type: 'sleep',
                value: entry.sleepHours,
                unit: 'hours',
                recorded_at: recordedAt,
                source: 'manual',
            });
        }

        if (metrics.length > 0) {
            await supabase.from('health_metrics').insert(metrics);
        }

        return NextResponse.json({
            status: 'success',
            message: 'Données enregistrées avec succès',
            date: entry.date,
            metrics_saved: metrics.length,
        });

    } catch (error) {
        console.error('Manual entry error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        );
    }
}

// GET: Get user's manual entries
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days') || '30');

        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        const { data: entries, error } = await supabase
            .from('daily_health_summary')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
            return NextResponse.json({ entries: [] });
        }

        return NextResponse.json({
            status: 'success',
            entries: entries || [],
            period: { start: startDate, days },
        });

    } catch (error) {
        console.error('Get entries error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
