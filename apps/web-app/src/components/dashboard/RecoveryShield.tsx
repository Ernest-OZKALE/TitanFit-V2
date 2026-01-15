'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecoveryShieldProps {
    value: number; // 0 to 100
    className?: string;
}

export function RecoveryShield({ value, className }: RecoveryShieldProps) {
    // Determine status color
    const isOptimal = value >= 67;
    const isWarning = value < 67 && value >= 34;

    const strokeDasharray = 251.2; // 2 * PI * 40
    const offset = strokeDasharray - (value / 100) * strokeDasharray;

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            <div className="relative w-32 h-32">
                {/* SVG Shield/Ring */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-white/5"
                    />
                    {/* Progress Fill */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="url(#shieldGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: strokeDasharray }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        style={{ strokeDasharray }}
                    />
                    {/* Definition for Gradient */}
                    <defs>
                        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={isOptimal ? "#10B981" : isWarning ? "#F59E0B" : "#EF4444"} />
                            <stop offset="100%" stopColor={isOptimal ? "#34D399" : isWarning ? "#D97706" : "#B91C1C"} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Central HUD Data */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-3xl font-black text-white font-mono leading-none">{value}%</span>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest mt-1",
                            isOptimal ? "text-green-400" : isWarning ? "text-amber-400" : "text-red-400"
                        )}>
                            {isOptimal ? "Optimal" : isWarning ? "Modéré" : "Faible"}
                        </span>
                    </motion.div>
                </div>

                {/* Tactical Inner Glow */}
                <div className="absolute inset-4 rounded-full bg-black/40 ring-1 ring-white/10 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                    <Activity size={24} className={cn("opacity-20", isOptimal ? "text-green-400" : "text-amber-400")} />
                </div>
            </div>

            {/* Background Atmosphere */}
            <div className={cn(
                "absolute -z-10 w-full h-full blur-[40px] opacity-20 rounded-full",
                isOptimal ? "bg-green-500" : isWarning ? "bg-amber-500" : "bg-red-500"
            )} />
        </div>
    );
}
