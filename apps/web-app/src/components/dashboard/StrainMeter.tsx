'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrainMeterProps {
    value: number; // 0 to 21 (typical WHOOP/Titan scale)
    label?: string;
    className?: string;
}

export function StrainMeter({ value, label = "Cumulative Strain", className }: StrainMeterProps) {
    const percentage = Math.min((value / 21) * 100, 100);

    // Intensity mapping
    const isHigh = value > 14;
    const isModerate = value > 7 && value <= 14;

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2">
                    <Zap size={14} className={cn(isHigh ? "text-orange-500" : "text-titan-gold")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">{value.toFixed(1)}</span>
            </div>

            {/* Tactical Load Bar */}
            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                {/* Segments background */}
                <div className="absolute inset-0 flex gap-[2px]">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-full flex-1 bg-white" />
                    ))}
                </div>

                {/* Animated Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "absolute inset-y-0 left-0 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]",
                        isHigh
                            ? "bg-gradient-to-r from-orange-600 to-red-500 shadow-orange-500/40"
                            : "bg-gradient-to-r from-[#B8860B] to-[#D4AF37]"
                    )}
                >
                    {/* Inner Glass Glow */}
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-white/20 blur-[1px]" />

                    {/* Animated Glare */}
                    <motion.div
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 w-12 bg-white/30 skew-x-12 blur-sm"
                    />
                </motion.div>
            </div>

            {/* Micro HUD Labels */}
            <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase tracking-tighter px-1">
                <span>Base</span>
                <span>Hyper</span>
                <span>Titan</span>
            </div>
        </div>
    );
}
