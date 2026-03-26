'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Leaf, AlertCircle, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface NutritionScoreProps {
    score: number; // 0-100
    metrics: {
        label: string;
        value: string;
        status: 'optimal' | 'warning' | 'critical';
    }[];
    className?: string;
}

export function NutritionScore({ score, metrics, className }: NutritionScoreProps) {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s > 80) return '#10B981'; // Green
        if (s > 50) return '#D4AF37'; // Gold
        return '#EF4444'; // Red
    };

    const scoreColor = getColor(score);

    return (
        <GlassCard className={cn("flex flex-col gap-6", className)} gradient>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Apple size={18} className="text-titan-gold" />
                        <h3 className="text-xs font-black uppercase tracking-[.2em] text-slate-400">Nutrition Quality</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">ALGORITHME AHEI-MAX</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <Info size={14} className="text-slate-400" />
                </div>
            </div>

            {/* Central Score Gauge */}
            <div className="flex flex-col items-center justify-center py-4 relative">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* SVG Progress Ring */}
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-slate-100"
                        />
                        <motion.circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="12"
                            strokeDasharray="440"
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-5xl font-black text-slate-900 tracking-tighter"
                        >
                            {score}
                        </motion.span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-[-4px]">Qualité</span>
                    </div>
                </div>

                {/* Insight Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2"
                >
                    <Leaf size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-slate-700">Excellent choix de micronutriments aujourd'hui</span>
                </motion.div>
            </div>

            {/* Metrics List */}
            <div className="grid grid-cols-2 gap-3 pb-2">
                {metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/40 border border-white/60 shadow-sm flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{m.label}</span>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">{m.value}</span>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                m.status === 'optimal' ? "bg-green-500" : m.status === 'warning' ? "bg-titan-gold" : "bg-red-500"
                            )} />
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]">
                Analyse Détaillée
            </button>
        </GlassCard>
    );
}
