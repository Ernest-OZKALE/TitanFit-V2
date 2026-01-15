'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, TrendingUp } from 'lucide-react';

export default function FoodLogPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [meals, setMeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [todayStats, setTodayStats] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchMeals();
    }, [user]);

    async function fetchMeals() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('food_log')
            .select('*')
            .eq('user_id', user?.id)
            .gte('logged_at', today.toISOString())
            .order('logged_at', { ascending: false });

        if (!error && data) {
            setMeals(data);

            // Calculate totals
            const stats = data.reduce(
                (acc, meal) => ({
                    calories: acc.calories + (meal.calories || 0),
                    protein: acc.protein + (meal.protein_g || 0),
                    carbs: acc.carbs + (meal.carbs_g || 0),
                    fat: acc.fat + (meal.fat_g || 0),
                }),
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );
            setTodayStats(stats);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
                        <p className="text-sm text-gray-600">Track your nutrition</p>
                    </div>
                    <Link href="/log-meal">
                        <Button className="gradient-bg text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Log Meal
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Today's Stats */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Calories
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {todayStats.calories} / 2000
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                    style={{ width: `${Math.min((todayStats.calories / 2000) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Protein
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {todayStats.protein.toFixed(1)}g
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Target: 150g</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Carbs
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {todayStats.carbs.toFixed(1)}g
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Target: 200g</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Fat
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {todayStats.fat.toFixed(1)}g
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Target: 65g</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Meals List */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Today's Meals</CardTitle>
                        <CardDescription>
                            {meals.length} meal{meals.length !== 1 ? 's' : ''} logged
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {meals.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No meals logged yet</h3>
                                <p className="text-gray-600 mb-4">Start tracking your nutrition today</p>
                                <Link href="/log-meal">
                                    <Button className="gradient-bg text-white">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Log Your First Meal
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {meals.map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Badge variant="outline" className="capitalize">
                                                        {meal.meal_type}
                                                    </Badge>
                                                    {meal.emotion_tag && (
                                                        <Badge variant="secondary" className="capitalize">
                                                            {meal.emotion_tag}
                                                        </Badge>
                                                    )}
                                                    {meal.is_craving_event && (
                                                        <Badge variant="destructive">Craving</Badge>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{meal.food_name}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span>{meal.calories} cal</span>
                                                    <span>P: {meal.protein_g}g</span>
                                                    <span>C: {meal.carbs_g}g</span>
                                                    <span>F: {meal.fat_g}g</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(meal.logged_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
