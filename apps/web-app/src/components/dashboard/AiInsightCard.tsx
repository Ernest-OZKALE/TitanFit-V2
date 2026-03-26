'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Zap,
    Flame,
    Utensils,
    Moon,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Search,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiInsightCardProps {
    className?: string;
    metrics?: {
        recovery: number;
        strain: number;
        energy: number;
    };
}

export function AiInsightCard({ className, metrics = { recovery: 85, strain: 12, energy: 78 } }: AiInsightCardProps) {
    const [isProcessing, setIsProcessing] = useState(true);
    const [insight, setInsight] = useState<{
        title: string;
        body: string;
        actionLabel: string;
        icon: any;
        color: string;
    } | null>(null);

    useEffect(() => {
        // Simulated AI Scanning delay
        const timer = setTimeout(() => {
            setIsProcessing(false);
            generateInsight();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const generateInsight = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 10) {
            setInsight({
                title: "Optimisation Matinale",
                body: `Récupération à ${metrics.recovery}%. Votre système est prêt pour un protocole de force modéré. Commencez par le Morning Check-in.`,
                actionLabel: "Lancer le Check-in",
                icon: Zap,
                color: "titan-gold"
            });
        } else if (hour >= 10 && hour < 18) {
            setInsight({
                title: "Fenêtre de Performance",
                body: `Niveau d'énergie optimal (${metrics.energy}%). C'est le moment idéal pour votre session de Push Hypertrophy.`,
                actionLabel: "Entraînement Titan",
                icon: Flame,
                color: "orange-500"
            });
        } else if (hour >= 18 && hour < 22) {
            setInsight({
                title: "Logistique Nutritionnelle",
                body: "Il vous reste 45g de protéines pour atteindre votre cible. Prévoyez un repas riche en leucine pour maximiser la synthèse.",
                actionLabel: "Enregistrer Repas",
                icon: Utensils,
                color: "emerald-500"
            });
        } else {
            setInsight({
                title: "Régénération Active",
                body: "Préparation au sommeil profond. La mélatonine naturelle commence à monter. Éteignez les écrans bleus d'ici 30 min.",
                actionLabel: "Protocole Sommeil",
                icon: Moon,
                color: "indigo-400"
            });
        }
    };

    return (
        <div className={cn(
            "relative w-full h-full min-h-[320px] rounded-[2.5rem] bg-white/80 border border-slate-200/60 backdrop-blur-3xl p-8 overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5",
            className
        )}>
            {/* Soft Ambient Glow / Core */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-titan-gold/5 blur-[80px] rounded-full group-hover:bg-titan-gold/10 transition-all duration-1000" />

            <div className="relative z-10 h-full flex flex-col justify-between">
                {/* HUD Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Brain size={16} className="text-titan-gold" />
                            <h3 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500">Neural Insight Eng.</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-[2px] w-8 bg-titan-gold/30" />
                            <span className="text-[9px] font-mono text-titan-gold tracking-widest uppercase animate-pulse">
                                {isProcessing ? "Scanning Bio-Rhythms..." : "Active Suggestion"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 border border-slate-200">
                        <ShieldCheck size={12} className="text-titan-gold" />
                        <span className="text-[9px] font-black text-slate-600 tracking-tighter uppercase">Titan-Verified</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center py-6">
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="w-24 h-24 rounded-full border border-dashed border-titan-gold/20"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-2 rounded-full border-t border-titan-gold"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Search size={24} className="text-titan-gold opacity-40 animate-bounce" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Processing</span>
                                    <div className="flex gap-1 mt-1">
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-1 h-1 rounded-full bg-titan-gold"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="insight"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={cn(
                                        "p-3 rounded-2xl bg-white/80 border border-slate-100 shadow-sm",
                                        `text-${insight?.color}`
                                    )}>
                                        {insight && <insight.icon size={28} />}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                                        {insight?.title}
                                    </h2>
                                </div>
                                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-md">
                                    {insight?.body}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated For</span>
                        <span className="text-xs font-black text-slate-900 uppercase italic">Nexus User Elite</span>
                    </div>

                    {!isProcessing && (
                        <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-full font-black text-xs uppercase tracking-[.2em] transition-all overflow-hidden relative",
                                `bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 shadow-lg`
                            )}
                        >
                            <span className="relative z-10">{insight?.actionLabel}</span>
                            <ArrowRight size={16} className="relative z-10" />
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Ambient Circle */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-50px] left-[-30px] w-48 h-48 bg-titan-gold/5 blur-[40px] rounded-full pointer-events-none"
            />
        </div>
    );
}
