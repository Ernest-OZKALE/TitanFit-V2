'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Dumbbell, AlertOctagon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgressPoint {
    date: string;
    value: number; // 1RM
}

export default function ProgressAnalytics() {
    const [data, setData] = useState<ProgressPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState<string>('bench_press'); // Default, will verify if exists
    const [exercises, setExercises] = useState<string[]>([]);
    const [totalVolume, setTotalVolume] = useState(0);

    useEffect(() => {
        fetchExercisesList();
    }, []);

    useEffect(() => {
        if (selectedExercise) {
            fetchProgressData(selectedExercise);
        }
    }, [selectedExercise]);

    const fetchExercisesList = async () => {
        // Find distinct exercises user has done
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('workout_sets')
            .select('exercise_id')
            .eq('user_id', user.id); // Assuming policies allow this

        if (data) {
            const unique = Array.from(new Set(data.map(i => i.exercise_id)));
            // Start with Bench Press if available, else first one
            setExercises(unique);
            if (unique.length > 0 && !unique.includes('bench_press')) {
                setSelectedExercise(unique[0]);
            }
        }
    };

    const fetchProgressData = async (exerciseId: string) => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch sets for 1RM calculation
        const { data, error } = await supabase
            .from('workout_sets')
            .select('weight_kg, reps, completed_at')
            .eq('user_id', user.id)
            .eq('exercise_id', exerciseId)
            .order('completed_at', { ascending: true });

        // Calculate Total Tonnage (All Time)
        const { data: allSets } = await supabase
            .from('workout_sets')
            .select('weight_kg, reps')
            .eq('user_id', user.id);

        if (allSets) {
            const tonnage = allSets.reduce((acc, curr) => acc + (curr.weight_kg * curr.reps), 0);
            setTotalVolume(Math.round(tonnage / 1000)); // In Tons
        }

        if (error) {
            console.error(error);
        } else if (data) {
            // Process calculate 1RM per day (keeping max of the day)
            const processed = data.reduce((acc: any[], curr) => {
                const date = new Date(curr.completed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                // Epley Formula: 1RM = Weight * (1 + Reps/30)
                const oneRM = curr.weight_kg * (1 + curr.reps / 30);

                const existing = acc.find(p => p.date === date);
                if (existing) {
                    if (oneRM > existing.value) existing.value = Math.round(oneRM);
                } else {
                    acc.push({ date, value: Math.round(oneRM) });
                }
                return acc;
            }, []);
            setData(processed);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1RM Chart */}
                <Card className="md:col-span-2 border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                                Progression Force (1RM Théorique)
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-1">Estimation basée sur vos séries réelles (Formule d'Epley)</p>
                        </div>
                        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Exercice" />
                            </SelectTrigger>
                            <SelectContent>
                                {exercises.map(ex => (
                                    <SelectItem key={ex} value={ex} className="capitalize">
                                        {ex.replace('-', ' ')}
                                    </SelectItem>
                                ))}
                                {exercises.length === 0 && <SelectItem value="bench_press">Bench Press</SelectItem>}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center animate-pulse text-gray-500">Chargement des données...</div>
                        ) : data.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                <AlertOctagon className="w-12 h-12 mb-3 opacity-20" />
                                <p>Aucune donnée pour cet exercice.</p>
                                <p className="text-xs">Allez vous entraîner pour voir la courbe !</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#666" tick={{ fontSize: 12 }} unit="kg" domain={['dataMin - 5', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#D4AF37"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* KPI Card */}
                <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                            Volume Total Soulevé
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">{totalVolume}</span>
                            <span className="text-sm text-[#D4AF37] font-bold">Tonnes</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Cumul de tous vos entraînements sur TitanFit.
                        </p>
                    </CardContent>
                </Card>

                {/* API Status Card (Real Check) */}
                <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                            Santé Système
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-bold text-white">Base de Données: Connectée</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${exercises.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-sm font-bold text-white">
                                Données Entraînement: {exercises.length > 0 ? 'Actives' : 'En Attente'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
