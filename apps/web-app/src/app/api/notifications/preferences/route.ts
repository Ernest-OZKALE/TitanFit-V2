import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET /api/notifications/preferences - Get user's notification preferences
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: preferences, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // If no preferences exist, return defaults
        if (!preferences) {
            return NextResponse.json({
                preferences: {
                    email_workout_reminder: true,
                    email_streak_reminder: true,
                    email_achievement: true,
                    email_weekly_digest: true,
                    email_social_activity: false,
                    email_marketing: false,
                    push_workout_reminder: true,
                    push_meal_reminder: true,
                    push_achievement: true,
                    push_social_activity: true,
                    in_app_all: true
                }
            });
        }

        return NextResponse.json({ preferences });
    } catch (error: any) {
        console.error('Get Preferences Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/notifications/preferences - Update notification preferences
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Filter only allowed fields
        const allowedFields = [
            'email_workout_reminder', 'email_streak_reminder', 'email_achievement',
            'email_weekly_digest', 'email_social_activity', 'email_marketing',
            'push_workout_reminder', 'push_meal_reminder', 'push_achievement',
            'push_social_activity', 'in_app_all'
        ];

        const updates: Record<string, boolean> = {};
        for (const field of allowedFields) {
            if (typeof body[field] === 'boolean') {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        updates.updated_at = new Date().toISOString() as any;

        // Upsert preferences
        const { data: preferences, error } = await supabase
            .from('notification_preferences')
            .upsert({
                user_id: user.id,
                ...updates
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ preferences });
    } catch (error: any) {
        console.error('Update Preferences Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
