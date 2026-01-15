/**
 * POST /api/wearables/webhook
 * Receives push data from Terra API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook processing (no user context)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TerraWebhookPayload {
    type: string;
    user: {
        user_id: string;
        provider: string;
        reference_id: string; // Our user_id
    };
    data?: any[];
}

export async function POST(request: NextRequest) {
    try {
        // Verify webhook signature (Terra sends in header)
        const terraSignature = request.headers.get('terra-signature');
        const expectedSecret = process.env.TERRA_WEBHOOK_SECRET;

        // In production, verify the signature
        // For now, we'll log it
        console.log('Terra webhook received, signature:', terraSignature?.substring(0, 20) + '...');

        const payload: TerraWebhookPayload = await request.json();
        console.log('Webhook type:', payload.type);

        const userId = payload.user?.reference_id;
        const terraUserId = payload.user?.user_id;
        const provider = payload.user?.provider;

        if (!userId) {
            console.error('No reference_id in webhook');
            return NextResponse.json({ status: 'error', message: 'Missing reference_id' }, { status: 400 });
        }

        // Handle different webhook types
        switch (payload.type) {
            case 'auth':
                // User successfully authenticated
                await handleAuthWebhook(userId, terraUserId, provider);
                break;

            case 'deauth':
                // User disconnected
                await handleDeauthWebhook(userId, provider);
                break;

            case 'activity':
            case 'daily':
            case 'sleep':
            case 'body':
                // Health data received
                await handleDataWebhook(userId, payload.type, payload.data || []);
                break;

            default:
                console.log('Unhandled webhook type:', payload.type);
        }

        return NextResponse.json({ status: 'success', received: payload.type });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

async function handleAuthWebhook(userId: string, terraUserId: string, provider: string) {
    // Create or update wearable connection
    const { error } = await supabaseAdmin
        .from('user_wearable_connections')
        .upsert({
            user_id: userId,
            provider: provider.toLowerCase(),
            terra_user_id: terraUserId,
            is_active: true,
            last_sync_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,provider',
        });

    if (error) {
        console.error('Error saving connection:', error);
        throw error;
    }

    console.log(`Connected ${provider} for user ${userId}`);
}

async function handleDeauthWebhook(userId: string, provider: string) {
    // Mark connection as inactive
    const { error } = await supabaseAdmin
        .from('user_wearable_connections')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('provider', provider.toLowerCase());

    if (error) {
        console.error('Error updating connection:', error);
        throw error;
    }

    console.log(`Disconnected ${provider} for user ${userId}`);
}

async function handleDataWebhook(userId: string, dataType: string, data: any[]) {
    if (!data || data.length === 0) {
        console.log('No data in webhook');
        return;
    }

    const metrics: any[] = [];

    for (const item of data) {
        // Extract metrics based on data type
        if (dataType === 'activity' || dataType === 'daily') {
            if (item.steps) {
                metrics.push({
                    user_id: userId,
                    metric_type: 'steps',
                    value: item.steps,
                    unit: 'count',
                    recorded_at: item.metadata?.start_time || new Date().toISOString(),
                    source: item.metadata?.device_name || 'wearable',
                });
            }
            if (item.calories) {
                metrics.push({
                    user_id: userId,
                    metric_type: 'calories',
                    value: item.calories,
                    unit: 'kcal',
                    recorded_at: item.metadata?.start_time || new Date().toISOString(),
                    source: item.metadata?.device_name || 'wearable',
                });
            }
            if (item.distance_meters) {
                metrics.push({
                    user_id: userId,
                    metric_type: 'distance',
                    value: item.distance_meters / 1000, // Convert to km
                    unit: 'km',
                    recorded_at: item.metadata?.start_time || new Date().toISOString(),
                    source: item.metadata?.device_name || 'wearable',
                });
            }
            if (item.heart_rate_data?.summary?.avg_hr_bpm) {
                metrics.push({
                    user_id: userId,
                    metric_type: 'heart_rate',
                    value: item.heart_rate_data.summary.avg_hr_bpm,
                    unit: 'bpm',
                    recorded_at: item.metadata?.start_time || new Date().toISOString(),
                    source: item.metadata?.device_name || 'wearable',
                });
            }
        }

        if (dataType === 'sleep') {
            if (item.sleep_durations_data?.asleep?.duration_asleep_state_seconds) {
                const sleepHours = item.sleep_durations_data.asleep.duration_asleep_state_seconds / 3600;
                metrics.push({
                    user_id: userId,
                    metric_type: 'sleep',
                    value: sleepHours,
                    unit: 'hours',
                    recorded_at: item.metadata?.start_time || new Date().toISOString(),
                    source: item.metadata?.device_name || 'wearable',
                });
            }
        }
    }

    if (metrics.length > 0) {
        const { error } = await supabaseAdmin
            .from('health_metrics')
            .insert(metrics);

        if (error) {
            console.error('Error inserting metrics:', error);
            throw error;
        }

        console.log(`Inserted ${metrics.length} metrics for user ${userId}`);

        // Update daily summary
        await updateDailySummary(userId);
    }
}

async function updateDailySummary(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Get today's metrics
    const { data: metrics } = await supabaseAdmin
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', `${today}T00:00:00Z`)
        .lte('recorded_at', `${today}T23:59:59Z`);

    if (!metrics || metrics.length === 0) return;

    // Aggregate
    const summary = {
        user_id: userId,
        date: today,
        total_steps: 0,
        total_calories_burned: 0,
        total_distance_km: 0,
        avg_heart_rate: 0,
        sleep_hours: 0,
    };

    let hrSum = 0, hrCount = 0;

    for (const m of metrics) {
        switch (m.metric_type) {
            case 'steps':
                summary.total_steps += Number(m.value);
                break;
            case 'calories':
                summary.total_calories_burned += Number(m.value);
                break;
            case 'distance':
                summary.total_distance_km += Number(m.value);
                break;
            case 'heart_rate':
                hrSum += Number(m.value);
                hrCount++;
                break;
            case 'sleep':
                summary.sleep_hours = Math.max(summary.sleep_hours, Number(m.value));
                break;
        }
    }

    if (hrCount > 0) {
        summary.avg_heart_rate = Math.round(hrSum / hrCount);
    }

    // Upsert daily summary
    await supabaseAdmin
        .from('daily_health_summary')
        .upsert(summary, { onConflict: 'user_id,date' });
}

// GET: Check webhook status
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Terra webhook endpoint ready',
        timestamp: new Date().toISOString(),
    });
}
