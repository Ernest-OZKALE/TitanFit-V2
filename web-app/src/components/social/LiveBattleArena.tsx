"use client";

import { motion } from "framer-motion";
import { Swords, HeartPulse, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";

export function LiveBattleArena() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Swords className="w-8 h-8 text-red-500" /> Live Arena
                </h3>
                <div className="flex items-center gap-2 text-red-500 animate-pulse text-xs font-bold uppercase">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Live Now
                </div>
            </div>

            <GlassCard className="relative overflow-hidden border-none !bg-slate-900">
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900" />

                <div className="relative z-10 grid grid-cols-3 gap-4 items-center h-48">

                    {/* YOU */}
                    <div className="text-center space-y-4">
                        <div className="relative inline-block">
                            <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37] bg-slate-800 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                YOU
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                Titan
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-3xl font-black text-white">12</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Reps (Squat)</div>
                        </div>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-4xl font-black text-slate-800 italic opacity-50">VS</div>

                        {/* Live Metrics */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <HeartPulse className="w-5 h-5 text-red-500 mx-auto mb-1 animate-pulse" />
                                <span className="text-white font-mono font-bold">145</span>
                            </div>
                            <div className="text-center">
                                <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <span className="text-white font-mono font-bold">142</span>
                            </div>
                        </div>
                    </div>

                    {/* OPPONENT */}
                    <div className="text-center space-y-4 opacity-80">
                        <div className="relative inline-block">
                            <div className="w-16 h-16 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 grayscale">
                                M
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-700 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                Elite
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-3xl font-black text-slate-400">10</div>
                            <div className="text-xs font-bold text-slate-600 uppercase">Reps (Squat)</div>
                        </div>
                    </div>

                </div>

                {/* Progress Bars */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 flex">
                    <motion.div
                        className="h-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"
                        initial={{ width: "50%" }}
                        animate={{ width: "55%" }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: "50%" }}
                        animate={{ width: "45%" }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    />
                </div>
            </GlassCard>
        </div>
    );
}
