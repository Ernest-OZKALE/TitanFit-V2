import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/leaderboard - Get fitness leaderboard
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'weekly'; // weekly, monthly, alltime
        const category = searchParams.get('category') || 'workouts'; // workouts, streak, points
        const limit = parseInt(searchParams.get('limit') || '50');

        // Calculate date range based on type
        let dateFilter = new Date();
        if (type === 'weekly') {
            dateFilter.setDate(dateFilter.getDate() - 7);
        } else if (type === 'monthly') {
            dateFilter.setMonth(dateFilter.getMonth() - 1);
        } else {
            dateFilter = new Date('2020-01-01'); // All time
        }

        let leaderboard: any[] = [];

        if (category === 'workouts') {
            // Count workouts per user
            const { data, error } = await supabase
                .from('workouts')
                .select('user_id, profiles!inner(username, avatar_url)')
                .gte('completed_at', dateFilter.toISOString());

            if (error) throw error;

            // Aggregate workout counts
            const workoutCounts: Record<string, { count: number; profile: any }> = {};
            data?.forEach((workout: any) => {
                const uid = workout.user_id;
                if (!workoutCounts[uid]) {
                    workoutCounts[uid] = { count: 0, profile: workout.profiles };
                }
                workoutCounts[uid].count++;
            });

            leaderboard = Object.entries(workoutCounts)
                .map(([user_id, data]) => ({
                    user_id,
                    username: data.profile.username,
                    avatar_url: data.profile.avatar_url,
                    value: data.count,
                    metric: 'workouts'
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, limit);
        } else if (category === 'streak') {
            // Get users with streak data from profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, current_streak')
                .order('current_streak', { ascending: false })
                .limit(limit);

            if (error) throw error;

            leaderboard = data?.map((profile: any) => ({
                user_id: profile.id,
                username: profile.username,
                avatar_url: profile.avatar_url,
                value: profile.current_streak || 0,
                metric: 'days'
            })) || [];
        }

        // Add rank and check if current user is in list
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1,
            is_current_user: entry.user_id === user.id
        }));

        // Find current user's rank if not in top list
        const userInList = rankedLeaderboard.find(e => e.is_current_user);
        let currentUserRank = null;

        if (!userInList) {
            const userRankIndex = leaderboard.findIndex(e => e.user_id === user.id);
            if (userRankIndex === -1) {
                // User not in leaderboard, get their stats
                currentUserRank = { rank: '>50', value: 0, metric: category === 'workouts' ? 'workouts' : 'days' };
            }
        }

        return NextResponse.json({
            leaderboard: rankedLeaderboard,
            current_user_rank: currentUserRank,
            period: type,
            category
        });
    } catch (error: any) {
        console.error('Leaderboard Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
