'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDailyMetrics, calculateEnergyBank } from '@/services/energy-bank';
import { cn } from '@/lib/utils';

export function EnergyBank() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const { data: metrics } = useQuery({
        queryKey: ['dailyMetrics', todayStr],
        queryFn: () => fetchDailyMetrics(today),
    });

    const energyLevel = metrics?.energy_bank ?? calculateEnergyBank({
        sleep_score: 85,
        recovery_score: 70,
        strain_score: 12,
        stress_score: 30
    });

    const isHigh = energyLevel > 80;
    const isLow = energyLevel < 30;

    return (
        <div className="relative w-full h-full min-h-[220px] rounded-[2.5rem] bg-white/80 border border-slate-200/60 backdrop-blur-2xl p-6 overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-titan-gold/40">
            {/* Liquid Background Pulse */}
            <div
                className={cn(
                    "absolute inset-0 opacity-10 transition-all duration-1000 blur-[100px]",
                    isLow ? "bg-red-500" : "bg-titan-gold"
                )}
            />

            {/* Header Area */}
            <div className="relative z-20 flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Battery size={16} className="text-slate-400" />
                        <h3 className="text-xs font-black uppercase tracking-[.2em] text-slate-400">Energy Bank</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">PROTOCOLE BIO-SYNC</span>
                </div>
                <motion.div
                    animate={isHigh ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-2xl bg-white border border-slate-100 shadow-sm"
                >
                    <Zap size={16} className={cn(isLow ? "text-red-500" : "text-titan-gold")} />
                </motion.div>
            </div>

            {/* Main Liquid Viz Container */}
            <div className="relative flex-1 flex flex-col items-center justify-center py-2">
                {/* Tactical Case (Light Edition) */}
                <div className="relative w-36 h-36 rounded-full border-[8px] border-slate-100 bg-slate-50/50 flex items-center justify-center overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-slate-200/50">

                    {/* Liquid Animation Shell */}
                    <div className="absolute inset-0 z-0">
                        {/* Main Liquid Body */}
                        <motion.div
                            initial={{ top: '100%' }}
                            animate={{ top: `${100 - energyLevel}%` }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                "absolute inset-0 w-full transition-colors duration-1000",
                                isLow ? "bg-gradient-to-t from-red-600 to-red-400/80" : "bg-gradient-to-t from-[#B8860B] via-[#D4AF37] to-[#FFC107]/80"
                            )}
                        >
                            {/* Waves / Bubbles */}
                            <div className="absolute top-0 left-0 right-0 h-8 -translate-y-1/2">
                                <motion.div
                                    animate={{
                                        x: ['-20%', '20%'],
                                        scaleY: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-[140%] h-full bg-inherit blur-md opacity-40 rounded-[100%]"
                                />
                            </div>

                            {/* Internal Particles */}
                            {isHigh && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0], y: [-10, -100] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Sparkles className="text-white/30" size={40} />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Glass Surface Polish */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none z-10" />

                    {/* Numerical HUD */}
                    <div className="relative z-20 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-4xl font-black text-slate-900 drop-shadow-sm"
                        >
                            {energyLevel}<span className="text-sm opacity-40 ml-0.5">%</span>
                        </motion.div>
                        <div className="mt-1 flex items-center gap-1">
                            <div className={cn("w-1.5 h-1.5 rounded-full", isLow ? "bg-red-500 animate-pulse" : "bg-green-500")} />
                            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Insight Overlay */}
            <div className="relative z-20 mt-4 px-2 py-2 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">État Actuel</span>
                    <span className="text-xs font-black text-slate-900">{isHigh ? 'MAX PERFORMANCE' : isLow ? 'LOW ENERGY' : 'STABLE'}</span>
                </div>
                <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Drain</span>
                    <span className="text-xs font-mono text-titan-gold">-2% / HR</span>
                </div>
            </div>
        </div>
    );
}
