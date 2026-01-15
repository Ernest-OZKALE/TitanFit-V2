"use client";

import { motion } from "framer-motion";
import { Sun, Moon, CloudSun, Battery, Coffee, Dumbbell, BedDouble } from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/premium-components";

type TimeState = "morning" | "day" | "evening";

export function TimeAwareHero() {
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
            className="w-full relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 min-h-[300px] flex flex-col justify-center border border-white/10 shadow-2xl"
        >
            {/* Dynamic Background - Dark and Gold Focused */}
            <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${timeState === "morning" ? "bg-gradient-to-br from-black via-[#D4AF37]/5 to-black" :
                timeState === "day" ? "bg-gradient-to-br from-black via-blue-900/10 to-black" :
                    "bg-gradient-to-br from-black via-purple-900/10 to-black"
                }`} />

            {/* Content Layer */}
            <div className="relative z-10 max-w-4xl">
                {timeState === "morning" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[#D4AF37] font-bold tracking-widest uppercase text-sm">
                            <Sun className="w-5 h-5 animate-spin-slow" /> Morning Protocol
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Bonjour, <span className="text-[#D4AF37]">Titan.</span> <br />
                            Prêt à conquérir ?
                        </h1>
                        <div className="flex gap-6 mt-8">
                            <GlassCard className="flex items-center gap-4 p-4 !rounded-2xl w-fit bg-white/5 border-white/10">
                                <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl border border-[#D4AF37]/20"><Battery className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Score Sommeil</p>
                                    <p className="text-xl font-black text-white">88%</p>
                                </div>
                            </GlassCard>
                            <GlassCard className="flex items-center gap-4 p-4 !rounded-2xl w-fit bg-white/5 border-white/10">
                                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20"><Coffee className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Limite Caféine</p>
                                    <p className="text-xl font-black text-white">200mg</p>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {timeState === "day" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-sm">
                            <CloudSun className="w-5 h-5" /> Active Grind
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Focus sur <br /> l'<span className="text-[#D4AF37]">Objectif.</span>
                        </h1>
                        <GlassCard className="p-6 !rounded-3xl border-[#D4AF37]/30 bg-black/40 w-full max-w-md backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-400 uppercase">Prochaine Séance</span>
                                <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-black border border-[#D4AF37]/30">17:30</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_-3px_#D4AF37]">
                                    <Dumbbell className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white uppercase tracking-tight">Push Hypertrophy</p>
                                    <p className="text-sm text-gray-400">Pecs • Epaules • Triceps</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {timeState === "evening" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-purple-400 font-bold tracking-widest uppercase text-sm">
                            <Moon className="w-5 h-5" /> Recovery Mode
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Repos du <br /> <span className="text-[#D4AF37]">Guerrier.</span>
                        </h1>
                        <div className="flex gap-6 mt-8">
                            <GlassCard className="flex items-center gap-4 p-4 !rounded-2xl w-fit bg-white/5 border-white/10">
                                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20"><BedDouble className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Objectif Sommeil</p>
                                    <p className="text-xl font-black text-white">22:30</p>
                                </div>
                            </GlassCard>
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
