'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsRibbonProps {
    className?: string;
}

export function StatsRibbon({ className }: StatsRibbonProps) {
    // Simulated stats for now (to be replaced with real user data)
    const stats = {
        level: 42,
        xp: 12450,
        nextLevelXp: 15000,
        streak: 12,
        rank: 'Elite'
    };

    const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex items-center gap-6 px-8 py-3 rounded-full bg-white/80 border border-slate-200/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500",
                className
            )}
        >
            {/* Level & Rank Zone */}
            <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-titan-gold/20 blur-md rounded-lg group-hover:bg-titan-gold/40 transition-colors" />
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#D4AF37]/20 transition-transform group-hover:scale-105">
                        {stats.level}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-titan-gold">Titulaire</span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{stats.rank} Tier</span>
                </div>
            </div>

            {/* XP Progress Zone */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-[150px]">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Expérience (XP)</span>
                    <span className="text-[10px] font-mono text-slate-600">{stats.xp.toLocaleString()} / {stats.nextLevelXp.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full shadow-sm"
                    />
                    {/* Animated Glare */}
                    <motion.div
                        animate={{ x: ['-100%', '1000%'] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute inset-0 w-8 h-full bg-white/30 skew-x-12 blur-sm"
                    />
                </div>
            </div>

            {/* Streak Zone */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-orange-500">Série</span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">{stats.streak} Jours</span>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-xl bg-orange-50 text-orange-500 border border-orange-100"
                >
                    <Flame size={18} className="fill-orange-500" />
                </motion.div>
            </div>

            {/* Quick Actions (Mini) */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors group">
                    <Star size={16} className="text-slate-400 group-hover:text-titan-gold" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors group">
                    <Trophy size={16} className="text-slate-400 group-hover:text-titan-gold" />
                </button>
            </div>
        </motion.div>
    );
}
