'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Flame, Target, Droplet, ArrowLeft } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                Food <span className="text-[#D4AF37]">Log</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Suivi Nutritionnel</p>
                        </div>
                    </div>
                    <Link href="/log-meal">
                        <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl px-6 shadow-[0_0_20px_-5px_#D4AF37]">
                            <Plus className="w-4 h-4 mr-2" /> Log Meal
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Flame} label="Calories" value={todayStats.calories} target={2000} unit="kcal" color="#D4AF37" />
                    <StatCard icon={Target} label="Protéines" value={todayStats.protein} target={150} unit="g" color="#10b981" />
                    <StatCard icon={Droplet} label="Glucides" value={todayStats.carbs} target={200} unit="g" color="#3b82f6" />
                    <StatCard icon={Droplet} label="Lipides" value={todayStats.fat} target={65} unit="g" color="#8b5cf6" />
                </div>

                {/* Meals List */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-black text-white uppercase tracking-widest">Repas Aujourd'hui</h2>
                            <p className="text-xs text-gray-500">{meals.length} repas loggé{meals.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {meals.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Utensils className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Aucun repas loggé</h3>
                            <p className="text-gray-500 mb-6">Commencez à tracker votre nutrition</p>
                            <Link href="/log-meal">
                                <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" /> Logger un repas
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {meals.map((meal) => (
                                <div
                                    key={meal.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                                    {meal.meal_type}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-white">{meal.food_name}</h3>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                <span>P: {meal.protein_g}g</span>
                                                <span>C: {meal.carbs_g}g</span>
                                                <span>F: {meal.fat_g}g</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white">{meal.calories}</p>
                                            <p className="text-[10px] text-gray-500 uppercase">kcal</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, target, unit, color }: any) {
    const percent = Math.min((value / target) * 100, 100);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-[1.5rem] bg-[#0F0F0F] border border-white/5"
        >
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-2xl font-black text-white mb-2">
                {value.toFixed(0)} <span className="text-xs text-gray-500">/ {target}{unit}</span>
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: color }} />
            </div>
        </motion.div>
    );
}
