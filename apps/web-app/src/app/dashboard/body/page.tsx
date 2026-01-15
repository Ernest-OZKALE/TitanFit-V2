'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Camera, Plus, Zap, Activity, Flame, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { WeightChart } from '@/components/body/WeightChart';

export default function BodyPage() {
    const [weightLogs, setWeightLogs] = useState<{ date: string, weight: number }[]>([]);
    const [currentWeight, setCurrentWeight] = useState(0);

    // Initial Load & Fake Data seeding if empty
    useEffect(() => {
        const stored = localStorage.getItem('titan_body_weight');
        if (stored) {
            const parsed = JSON.parse(stored);
            setWeightLogs(parsed);
            setCurrentWeight(parsed[parsed.length - 1]?.weight || 75);
        } else {
            // Seed Mock Data for visualization if empty
            const seed = [
                { date: '2023-12-01', weight: 84.5 },
                { date: '2023-12-15', weight: 83.2 },
                { date: '2024-01-01', weight: 82.8 },
                { date: '2024-01-15', weight: 82.5 },
                { date: '2024-02-01', weight: 81.9 },
            ];
            setWeightLogs(seed);
            setCurrentWeight(81.9);
            localStorage.setItem('titan_body_weight', JSON.stringify(seed));
        }
    }, []);

    const handleAddWeight = () => {
        const newWeight = prompt("Poids actuel (kg) :");
        if (newWeight && !isNaN(parseFloat(newWeight))) {
            const today = new Date().toISOString().split('T')[0];
            const entry = { date: today, weight: parseFloat(newWeight) };

            // Check if entry exists for today, update it
            const existingIndex = weightLogs.findIndex(l => l.date === today);
            let updated;
            if (existingIndex >= 0) {
                updated = [...weightLogs];
                updated[existingIndex] = entry;
            } else {
                updated = [...weightLogs, entry];
            }

            setWeightLogs(updated);
            setCurrentWeight(entry.weight);
            localStorage.setItem('titan_body_weight', JSON.stringify(updated));
        }
    };

    // METABOLIC MATH (Simplified Harris-Benedict)
    // BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
    // Assuming Male, 180cm, 25yo for prototype
    const bmr = Math.round(88.362 + (13.397 * currentWeight) + (4.799 * 180) - (5.677 * 25));
    const maintenance = Math.round(bmr * 1.55); // Moderate activity

    return (
        <div className="pb-32 max-w-5xl mx-auto">
            <header className="mb-12 text-center pt-8">
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Scan Corporel</h1>
                <p className="text-slate-500 font-medium">Analyse Biométrique & Structurelle</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* METRIC 1: WEIGHT */}
                <GlassCard className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Scale className="w-24 h-24 text-[#D4AF37]" />
                    </div>
                    <div className="z-10 relative">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Poids De Corps</p>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{currentWeight} <span className="text-lg text-slate-400">kg</span></h2>
                        <button onClick={handleAddWeight} className="mt-3 text-[#D4AF37] hover:text-[#B8860B] font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Mettre à jour
                        </button>
                    </div>
                </GlassCard>

                {/* METRIC 2: BF% */}
                <GlassCard className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masse Grasse</p>
                        <Activity className="w-4 h-4 text-green-500" />
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">14.2 <span className="text-lg text-slate-400">%</span></h2>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 w-[40%] h-full rounded-full" />
                    </div>
                </GlassCard>

                {/* METRIC 3: BMR */}
                <GlassCard className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Métabolisme (BMR)</p>
                        <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{bmr} <span className="text-lg text-slate-400">kcal</span></h2>
                    <p className="mt-2 text-xs text-slate-500 font-medium">Au repos absolu</p>
                </GlassCard>

                {/* METRIC 4: TDEE */}
                <GlassCard className="p-6 bg-slate-900 border-slate-900">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Maintenance</p>
                        <Zap className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter">{maintenance} <span className="text-lg text-slate-600">kcal</span></h2>
                    <p className="mt-2 text-xs text-slate-400 font-medium">Pour maintenir ce poids</p>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* GRAPH CHART */}
                <div className="lg:col-span-2">
                    <WeightChart data={weightLogs} />
                </div>

                {/* GALLERY SIDEBAR */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Galerie</h3>
                        <Button size="sm" className="rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                            <Camera className="w-3 h-3 mr-2" /> Snap
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-[3/4] rounded-2xl bg-slate-50 border border-slate-100 relative group overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-200 font-black text-3xl">AVANT</div>
                        </div>
                        <div className="aspect-[3/4] rounded-2xl bg-slate-50 border border-slate-100 relative group overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-200 font-black text-3xl">APRÈS</div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                        <p className="text-xs text-slate-500 text-center font-medium">
                            <TrendingUp className="w-4 h-4 inline mr-1 text-green-500" />
                            -2.6kg ce mois-ci. Continuez !
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
