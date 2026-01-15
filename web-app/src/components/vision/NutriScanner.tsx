"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, Maximize2, Zap, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";

export function NutriScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [detected, setDetected] = useState<any>(null);

    const startScan = () => {
        setIsScanning(true);
        setDetected(null);
        // Simulation
        setTimeout(() => {
            setIsScanning(false);
            setDetected({
                name: "Pomme Granny Smith",
                cals: 52,
                macros: { p: 0.3, c: 14, f: 0.2 },
                confidence: 98
            });
        }, 3000);
    };

    return (
        <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden bg-black border-4 border-slate-900 shadow-2xl">

            {/* 1. Viewfinder (Camera Feed Simulation) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop')] bg-cover bg-center opacity-60">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            </div>

            {/* 2. HUD Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md text-white/50 text-xs font-mono p-2 rounded-lg border border-white/10">
                        TITAN VISION v3.0 <br />
                        AI: ACTIVE <br />
                        FPS: 60
                    </div>
                    <div className="text-[#D4AF37] animate-pulse">
                        <Zap className="fill-current w-6 h-6" />
                    </div>
                </div>

                {/* Target Rect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/20 rounded-[2rem] flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37] rounded-br-2xl" />

                    {isScanning && (
                        // @ts-ignore
                        <motion.div
                            className="w-full h-1 bg-[#D4AF37]/50 blur-sm absolute"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                        />
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="flex flex-col items-center gap-6 pointer-events-auto">
                    <AnimatePresence>
                        {detected && (
                            // @ts-ignore
                            <motion.div
                                key="result-popup"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="w-full max-w-sm"
                            >
                                <GlassCard className="!bg-black/60 !backdrop-blur-xl border border-white/10 text-white p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{detected.name}</h4>
                                        <div className="flex gap-3 text-sm text-slate-300">
                                            <span>{detected.cals} kcal</span>
                                            <span className="text-[#D4AF37]">{detected.macros.c}g Carbs</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
                                        LOG +
                                    </button>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={startScan}
                        disabled={isScanning}
                        className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center group hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                    >
                        <div className="w-14 h-14 bg-white rounded-full group-hover:bg-[#D4AF37] transition-colors" />
                    </button>
                    <p className="text-white/60 font-bold text-sm">Hold to Scan</p>
                </div>
            </div>

        </div>
    );
}
