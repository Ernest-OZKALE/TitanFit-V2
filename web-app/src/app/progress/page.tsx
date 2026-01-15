'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Award, Flame } from 'lucide-react';

export default function ProgressPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [weightData, setWeightData] = useState<any[]>([]);
    const [calorieData, setCalorieData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        currentStreak: 0,
        totalMeals: 0,
        totalWorkouts: 0,
        level: 1,
        xp: 0,
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [user]);

    async function fetchData() {
        // Fetch weight history
        const { data: weights } = await supabase
            .from('weight_history')
            .select('*')
            .eq('user_id', user?.id)
            .order('recorded_at', { ascending: true })
            .limit(30);

        if (weights) {
            setWeightData(
                weights.map((w) => ({
                    date: new Date(w.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    weight: parseFloat(w.weight_kg),
                }))
            );
        }

        // Fetch daily summaries for calorie chart
        const { data: summaries } = await supabase
            .from('daily_summaries')
            .select('*')
            .eq('user_id', user?.id)
            .order('date', { ascending: true })
            .limit(14);

        if (summaries) {
            setCalorieData(
                summaries.map((s) => ({
                    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    calories: s.total_calories,
                    protein: parseFloat(s.total_protein_g),
                }))
            );
        }

        // Fetch user stats
        const { data: userStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user?.id)
            .single();

        if (userStats) {
            setStats({
                currentStreak: userStats.current_streak_days || 0,
                totalMeals: userStats.total_meals_logged || 0,
                totalWorkouts: userStats.total_workouts || 0,
                level: userStats.level || 1,
                xp: userStats.total_xp || 0,
            });
        }

        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const latestWeight = weightData[weightData.length - 1]?.weight || 0;
    const previousWeight = weightData[weightData.length - 2]?.weight || latestWeight;
    const weightChange = latestWeight - previousWeight;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
                    <p className="text-sm text-gray-600">Track your fitness journey</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                <Flame className="h-4 w-4 mr-1 text-orange-500" />
                                Current Streak
                            </CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.currentStreak} days</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Keep it going!</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                <Award className="h-4 w-4 mr-1 text-purple-500" />
                                Level
                            </CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.level}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{stats.xp} XP</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Total Meals
                            </CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.totalMeals}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Logged</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Total Workouts
                            </CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.totalWorkouts}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Completed</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    {/* Weight Chart */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Weight Progress</CardTitle>
                                    <CardDescription>Last 30 days</CardDescription>
                                </div>
                                {weightChange !== 0 && (
                                    <div className={`flex items-center space-x-1 ${weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {weightChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                                        <span className="text-sm font-semibold">{Math.abs(weightChange).toFixed(1)} kg</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {weightData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={weightData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    <p>No weight data yet. Start tracking your weight!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Calorie Chart */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Calorie Intake</CardTitle>
                            <CardDescription>Last 14 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {calorieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={calorieData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="calories" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    <p>No calorie data yet. Start logging meals!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Achievements</CardTitle>
                        <CardDescription>Your fitness milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-400">
                            <Award className="h-12 w-12 mx-auto mb-3" />
                            <p>Complete challenges to earn achievements!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
