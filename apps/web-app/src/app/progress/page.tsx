'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Flame, Dumbbell, Utensils, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';
import ProgressAnalytics from '@/components/analytics/ProgressAnalytics';

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

        if (weights && weights.length > 0) {
            setWeightData(
                weights.map((w) => ({
                    date: new Date(w.recorded_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                    weight: parseFloat(w.weight_kg),
                }))
            );
        } else {
            setWeightData([]);
        }

        // Fetch daily summaries for calorie chart
        const { data: summaries } = await supabase
            .from('daily_summaries')
            .select('*')
            .eq('user_id', user?.id)
            .order('date', { ascending: true })
            .limit(14);

        if (summaries && summaries.length > 0) {
            setCalorieData(
                summaries.map((s) => ({
                    date: new Date(s.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                    calories: s.total_calories,
                }))
            );
        } else {
            setCalorieData([]);
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
            });
        }

        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#D4AF37]"></div>
            </div>
        );
    }

    const latestWeight = weightData[weightData.length - 1]?.weight || 0;
    const previousWeight = weightData[weightData.length - 2]?.weight || latestWeight;
    const weightChange = latestWeight - previousWeight;

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                Pro<span className="text-[#D4AF37]">grès</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Suivi de votre parcours</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                    <StatCard icon={Flame} label="Série Actuelle" value={`${stats.currentStreak}j`} color="#D4AF37" />
                    <StatCard icon={Utensils} label="Repas Loggés" value={stats.totalMeals.toString()} color="#10b981" />
                    <StatCard icon={Dumbbell} label="Entraînements" value={stats.totalWorkouts.toString()} color="#8b5cf6" />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Weight Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-white uppercase tracking-widest">Évolution Poids</h3>
                                <p className="text-xs text-gray-500">30 derniers jours</p>
                            </div>
                            {weightChange !== 0 && (
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${weightChange < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {weightChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                                    {Math.abs(weightChange).toFixed(1)} kg
                                </div>
                            )}
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                                <YAxis stroke="#6b7280" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="weight" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Calorie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="mb-6">
                            <h3 className="font-black text-white uppercase tracking-widest">Apport Calorique</h3>
                            <p className="text-xs text-gray-500">Cette semaine</p>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={calorieData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                                <YAxis stroke="#6b7280" fontSize={11} />
                                <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="calories" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>



                {/* Titan Atlas (Performance) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                        Titan <span className="text-[#D4AF37]">Atlas</span>
                    </h2>
                    <ProgressAnalytics />
                </motion.div>

                {/* Weekly Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-black text-white uppercase tracking-widest">Résumé Semaine</h3>
                    </div>
                    <p className="text-gray-400">
                        Continuez votre parcours ! Chaque jour compte vers votre objectif.
                    </p>
                </motion.div>

            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-white/20 transition-all"
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </motion.div>
    );
}
