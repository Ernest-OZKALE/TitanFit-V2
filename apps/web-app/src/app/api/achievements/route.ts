import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { ACHIEVEMENTS } from '@/lib/badges';

export const dynamic = 'force-dynamic';

// GET /api/achievements - Get user's achievements
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's unlocked achievements
        const { data: userAchievements, error } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        // Get user stats for progress calculation
        const { data: workoutCount } = await supabase
            .from('workouts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const { data: profile } = await supabase
            .from('profiles')
            .select('current_streak, total_workouts, xp_points')
            .eq('id', user.id)
            .single();

        // Map achievements with unlock status and progress
        const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);

        const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
            const unlocked = unlockedIds.has(achievement.id);
            let progress = 0;

            // Calculate progress based on achievement type
            if (achievement.id.includes('workout')) {
                progress = Math.min(100, ((profile?.total_workouts || 0) / achievement.threshold) * 100);
            } else if (achievement.id.includes('streak')) {
                progress = Math.min(100, ((profile?.current_streak || 0) / achievement.threshold) * 100);
            }

            return {
                ...achievement,
                unlocked,
                unlocked_at: userAchievements?.find(a => a.achievement_id === achievement.id)?.unlocked_at,
                progress: unlocked ? 100 : Math.floor(progress)
            };
        });

        return NextResponse.json({
            achievements: achievementsWithProgress,
            stats: {
                total_unlocked: userAchievements?.length || 0,
                total_available: ACHIEVEMENTS.length,
                xp_points: profile?.xp_points || 0
            }
        });
    } catch (error: any) {
        console.error('Achievements Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/achievements - Check and unlock new achievements
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user stats
        const { data: profile } = await supabase
            .from('profiles')
            .select('current_streak, total_workouts')
            .eq('id', user.id)
            .single();

        // Get already unlocked achievements
        const { data: existing } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', user.id);

        const unlockedIds = new Set(existing?.map(a => a.achievement_id) || []);
        const newlyUnlocked: string[] = [];

        // Check each achievement
        for (const achievement of ACHIEVEMENTS) {
            if (unlockedIds.has(achievement.id)) continue;

            let shouldUnlock = false;

            if (achievement.id.includes('workout') && profile?.total_workouts >= achievement.threshold) {
                shouldUnlock = true;
            } else if (achievement.id.includes('streak') && profile?.current_streak >= achievement.threshold) {
                shouldUnlock = true;
            }

            if (shouldUnlock) {
                const { error } = await supabase
                    .from('user_achievements')
                    .insert({
                        user_id: user.id,
                        achievement_id: achievement.id
                    });

                if (!error) {
                    newlyUnlocked.push(achievement.id);
                }
            }
        }

        return NextResponse.json({
            newly_unlocked: newlyUnlocked,
            count: newlyUnlocked.length
        });
    } catch (error: any) {
        console.error('Check Achievements Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
