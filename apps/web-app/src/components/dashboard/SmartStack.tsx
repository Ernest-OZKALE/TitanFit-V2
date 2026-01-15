"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronRight, Apple, Zap } from "lucide-react";
import { GlassCard, PremiumProgressBar } from "@/components/ui/premium-components";

export function SmartStack({ onStartFocus }: { onStartFocus: () => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-white text-lg flex items-center gap-2 uppercase tracking-tighter">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]" />
                    Titan Array
                </h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/10">System Online</span>
            </div>

            {/* Focus Mode Trigger Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <GlassCard className="p-6 relative overflow-hidden group border-l-4 border-l-[#D4AF37] bg-black/40 backdrop-blur-2xl shadow-2xl">
                    <div className="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                        <Zap className="w-32 h-32 text-[#D4AF37]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 text-[#D4AF37] bg-[#D4AF37]/10 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20">
                            <Zap className="w-3 h-3" /> Prêt pour l'Impact
                        </div>

                        <h4 className="text-3xl font-black text-white mb-1 tracking-tight">Séance: Push Day</h4>
                        <p className="text-gray-400 text-sm mb-8 font-medium">Programme "Titan Hypertrophy" - Semaine 3/12</p>

                        <div className="space-y-6">
                            <PremiumProgressBar value={0} label="Progression Séance" />

                            <button
                                onClick={onStartFocus}
                                className="w-full py-4 rounded-2xl bg-[#D4AF37] text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F5C518] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_-5px_#D4AF37] group/btn"
                            >
                                <Zap className="w-5 h-5 fill-black" />
                                Lancer Focus Mode
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
