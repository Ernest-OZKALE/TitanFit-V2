"use client";

import { motion } from "framer-motion";
import { Sun, Moon, CloudSun, Battery, Coffee, Dumbbell, BedDouble, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/premium-components";
import Link from 'next/link';

type TimeState = "morning" | "day" | "evening";

export function TimeAwareHero({ onStartFocus }: { onStartFocus?: () => void }) {
    const [timeState, setTimeState] = useState<TimeState>("morning");

    // Simulation logic (In production, replace with real hours)
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setTimeState("morning");
        else if (hour >= 11 && hour < 18) setTimeState("day");
        else setTimeState("evening");
    }, []);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className="w-full relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 min-h-[300px] flex flex-col justify-center border border-slate-200 shadow-xl bg-white"
        >
            {/* Dynamic Background - Light and Gold Focused */}
            <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${timeState === "morning" ? "bg-gradient-to-br from-white via-[#D4AF37]/10 to-slate-50" :
                timeState === "day" ? "bg-gradient-to-br from-white via-blue-100/30 to-slate-50" :
                    "bg-gradient-to-br from-white via-purple-100/30 to-slate-50"
                }`} />

            {/* Content Layer */}
            <div className="relative z-10 max-w-4xl">
                {/* Sync Status Badge */}
                <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 backdrop-blur-md shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bio-Sync: Apple Health</span>
                </div>

                {timeState === "morning" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[#D4AF37] font-bold tracking-widest uppercase text-sm">
                            <Sun className="w-5 h-5 animate-spin-slow" /> Morning Protocol
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Bonjour, <span className="text-[#D4AF37]">Titan.</span> <br />
                            Prêt à conquérir ?
                        </h1>
                        <div className="flex flex-wrap gap-6 mt-8">
                            <GlassCard className="flex items-center gap-4 p-4 !rounded-2xl w-fit bg-white border-slate-200 shadow-sm">
                                <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl border border-[#D4AF37]/20"><Battery className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Score Sommeil</p>
                                    <p className="text-xl font-black text-slate-900">88%</p>
                                </div>
                            </GlassCard>
                            <Link href="/workout/active" className="group flex items-center gap-4 px-6 py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white rounded-2xl transition-all shadow-lg hover:shadow-[#D4AF37]/20">
                                <Dumbbell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase opacity-80">Quick Start</p>
                                    <p className="text-lg font-black uppercase">Mode Focus</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                {timeState === "day" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-blue-500 font-bold tracking-widest uppercase text-sm">
                            <CloudSun className="w-5 h-5" /> Active Grind
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Focus sur <br /> l'<span className="text-[#D4AF37]">Objectif.</span>
                        </h1>
                        <div className="flex flex-col md:flex-row gap-6">
                            <GlassCard className="p-6 !rounded-3xl border-slate-200 bg-white/60 w-full max-w-md backdrop-blur-xl shadow-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-slate-400 uppercase">Prochaine Séance</span>
                                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-black border border-[#D4AF37]/30">17:30</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_-3px_#D4AF37]">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Push Hypertrophy</p>
                                        <p className="text-sm text-slate-500">Pecs • Epaules • Triceps</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <button
                                onClick={onStartFocus}
                                className="flex-1 md:max-w-xs group flex flex-col items-center justify-center gap-2 p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#D4AF37]/50 rounded-3xl transition-all shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 fill-current" />
                                </div>
                                <span className="font-black text-slate-900 uppercase tracking-wider">Lancer Focus Mode</span>
                            </button>
                        </div>
                    </div>
                )}

                {timeState === "evening" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-purple-600 font-bold tracking-widest uppercase text-sm">
                            <Moon className="w-5 h-5" /> Recovery Mode
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Repos du <br /> <span className="text-[#D4AF37]">Guerrier.</span>
                        </h1>
                        <div className="flex flex-wrap gap-6 mt-8">
                            <GlassCard className="flex items-center gap-4 p-4 !rounded-2xl w-fit bg-white/80 border-slate-200 shadow-sm">
                                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/20"><BedDouble className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Objectif Sommeil</p>
                                    <p className="text-xl font-black text-slate-900">22:30</p>
                                </div>
                            </GlassCard>
                            <button
                                onClick={onStartFocus}
                                className="px-8 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all font-bold uppercase tracking-wider text-sm shadow-sm"
                            >
                                Accéder au Focus
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#D4AF37]">
                    <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.7C91.4,-34.3,98.1,-19.6,95.8,-5.5C93.5,8.6,82.2,22.1,71.5,33.5C60.8,44.9,50.7,54.2,39.3,62.1C27.9,70,15.2,76.5,1.4,74.1C-12.4,71.7,-27.3,60.4,-39.8,50.3C-52.3,40.2,-62.4,31.3,-69.5,20.2C-76.6,9.1,-80.7,-4.2,-77.6,-16.2C-74.5,-28.2,-64.2,-38.9,-53.1,-47.4C-42,-55.9,-30.1,-62.2,-17.6,-65.4C-5.1,-68.6,8,-68.7,20.6,-66.8L30.5,-83.6Z" transform="translate(100 100)" />
                </svg>
            </div>

        </motion.div>
    );
}
