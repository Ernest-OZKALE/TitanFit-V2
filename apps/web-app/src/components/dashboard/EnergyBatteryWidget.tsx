'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Battery, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDailyMetrics, calculateEnergyBank } from '@/services/energy-bank';

export default function EnergyBatteryWidget() {
    const today = new Date();

    const { data: metrics, isLoading } = useQuery({
        queryKey: ['dailyMetrics', today.toISOString().split('T')[0]],
        queryFn: () => fetchDailyMetrics(today),
    });

    // Default simulated values if no data (for demo/onboarding)
    const energyLevel = metrics?.energy_bank ?? calculateEnergyBank({
        sleep_score: 85,
        recovery_score: 70,
        strain_score: 12,
        stress_score: 30
    });

    // Color logic based on level
    const getColor = (level: number) => {
        if (level > 70) return '#10B981'; // Emerald
        if (level > 30) return '#F59E0B'; // Amber
        return '#EF4444'; // Red
    };

    const color = getColor(energyLevel);

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-6 min-h-[200px] flex flex-col justify-between">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 opacity-10 transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at top right, ${color}, transparent 70%)` }}
            />

            {/* Header */}
            <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Battery className="w-4 h-4" /> Energy Bank
                    </h3>
                    <span className="text-xs text-slate-500">Capacité disponible</span>
                </div>
                <div className="p-2 rounded-full bg-slate-50 border border-slate-100">
                    <Zap className="w-4 h-4" style={{ color }} />
                </div>
            </div>

            {/* Liquid Battery Viz */}
            <div className="relative flex items-center justify-center py-4 z-10">
                {/* Circular Container */}
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 overflow-hidden shadow-inner">
                    {/* Liquid Wave Animation */}
                    <motion.div
                        animate={{
                            top: `${100 - energyLevel}%`,
                            rotate: [0, 360]
                        }}
                        transition={{
                            top: { duration: 1.5, ease: "easeInOut" },
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                        }}
                        className="absolute w-[200%] h-[200%] rounded-[40%] opacity-80"
                        style={{
                            background: `linear-gradient(to top, ${color} 20%, transparent)`,
                            left: '-50%'
                        }}
                    />

                    {/* Text Value */}
                    <div className="relative z-20 flex flex-col items-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-4xl font-black text-slate-900"
                        >
                            {energyLevel}%
                        </motion.span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Chargé</span>
                    </div>
                </div>
            </div>

            {/* Footer / Context */}
            <div className="z-10 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Drain Est.</span>
                    <span className="text-slate-900 font-mono">-4%/hr</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '30%' }}
                        className="h-full bg-red-500/50"
                    />
                </div>
            </div>

        </div>
    );
}
