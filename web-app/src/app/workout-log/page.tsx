'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Calendar } from 'lucide-react';

export default function WorkoutLogPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchSessions();
    }, [user]);

    async function fetchSessions() {
        const { data, error } = await supabase
            .from('workout_sessions')
            .select(`
        *,
        workout_exercises (*)
      `)
            .eq('user_id', user?.id)
            .order('completed_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            setSessions(data);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Workout Log</h1>
                        <p className="text-sm text-gray-600">Track your training sessions</p>
                    </div>
                    <Link href="/log-workout">
                        <Button className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:opacity-90">
                            <Plus className="h-4 w-4 mr-2" />
                            Log Workout
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Total Workouts
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">{sessions.length}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                This Week
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {
                                    sessions.filter((s) => {
                                        const weekAgo = new Date();
                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                        return new Date(s.completed_at) > weekAgo;
                                    }).length
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Last 7 days</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                                Total Exercises
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {sessions.reduce((sum, s) => sum + (s.workout_exercises?.length || 0), 0)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">All time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Workout History */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Workout History</CardTitle>
                        <CardDescription>{sessions.length} session{sessions.length !== 1 ? 's' : ''} logged</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sessions.length === 0 ? (
                            <div className="text-center py-12">
                                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts logged yet</h3>
                                <p className="text-gray-600 mb-4">Start tracking your training progress</p>
                                <Link href="/log-workout">
                                    <Button className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:opacity-90">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Log Your First Workout
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{session.workout_name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(session.completed_at).toLocaleDateString()} at{' '}
                                                    {new Date(session.completed_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {session.workout_exercises?.length || 0} exercises
                                                </p>
                                            </div>
                                        </div>

                                        {session.notes && (
                                            <p className="text-sm text-gray-600 mb-3 italic">{session.notes}</p>
                                        )}

                                        {session.workout_exercises && session.workout_exercises.length > 0 && (
                                            <div className="space-y-2">
                                                {session.workout_exercises.map((exercise: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium text-gray-900">{exercise.exercise_name}</span>
                                                        <span className="text-gray-600">
                                                            {exercise.sets} × {exercise.reps} @ {exercise.weight_kg}kg
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
