
"use client";

import { motion } from "framer-motion";
import { Scan, Activity, ArrowRight, User } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";
import Link from 'next/link';

export function BioScanWidget() {
    return (
        <GlassCard className="group relative overflow-hidden h-full min-h-[300px] flex flex-col justify-between p-6 bg-white border border-slate-200 hover:border-[#D4AF37]/50 transition-all shadow-sm">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-tighter text-lg">
                        <Scan className="w-5 h-5 text-[#D4AF37]" />
                        Bio-Scan
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Analyse Morphologique
                    </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
            </div>

            {/* Visual Centerpiece */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                <div className="relative w-32 h-48 border-x border-[#D4AF37]/20 rounded-3xl flex items-center justify-center group-hover:border-[#D4AF37]/60 transition-colors">
                    {/* Scanning Line */}
                    <motion.div
                        className="absolute w-full h-1 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <User className="w-16 h-16 text-slate-300 group-hover:text-slate-900 transition-colors duration-500" />

                    {/* Data points */}
                    <div className="absolute -left-2 top-10 w-1 h-1 bg-[#D4AF37] rounded-full" />
                    <div className="absolute -right-2 bottom-12 w-1 h-1 bg-[#D4AF37] rounded-full" />
                </div>
            </div>

            {/* Footer Action */}
            <div className="relative z-10">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-4 font-mono">
                    <span>STATUS:</span>
                    <span className="text-[#D4AF37]">READY</span>
                </div>

                <Link href="/dashboard/body" className="w-full">
                    <button className="w-full py-3 bg-slate-50 hover:bg-[#D4AF37] border border-slate-200 hover:border-[#D4AF37] text-slate-900 hover:text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all group/btn shadow-sm">
                        Lancer Scan
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </GlassCard>
    );
}
