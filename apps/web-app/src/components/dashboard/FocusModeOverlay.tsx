'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Play, Pause, Square, Music, Volume2, Shield, Flame, Activity } from "lucide-react";
import TitaniumBackground from "@/components/TitaniumBackground";
import { cn } from "@/lib/utils";

export default function FocusModeOverlay({ isActive, onClose }: { isActive: boolean; onClose: () => void }) {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [currentExercise, setCurrentExercise] = useState("Développé Couché - 100kg");

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && isRunning) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, isRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[200] bg-white text-slate-900 flex flex-col overflow-hidden"
            >
                {/* Background ambient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full" />
                </div>

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 md:p-10 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500">LIVE SESSION</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 group"
                    >
                        <Minimize2 className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                    </button>
                </div>

                {/* Main Focus Area */}
                <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 space-y-12">

                    {/* Timer Big Display */}
                    <div className="text-center space-y-4">
                        <motion.div
                            className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter tabular-nums bg-gradient-to-b from-slate-900 to-slate-400 bg-clip-text text-transparent drop-shadow-sm"
                            animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {formatTime(timer)}
                        </motion.div>
                        <p className="text-xl text-[#D4AF37] font-bold uppercase tracking-widest">{currentExercise}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl border-4",
                                isRunning
                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500 hover:scale-105"
                                    : "bg-[#D4AF37] border-[#D4AF37] text-white hover:scale-110 hover:shadow-[0_0_50px_-10px_#D4AF37]"
                            )}
                        >
                            {isRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                        </button>

                        <button
                            onClick={() => { setTimer(0); setIsRunning(false); setCurrentSet(prev => prev + 1); }}
                            className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
                        >
                            <Square className="w-6 h-6 fill-current" />
                        </button>
                    </div>

                    {/* Set Counter */}
                    <div className="flex items-center gap-12 bg-slate-50 px-10 py-4 rounded-full border border-slate-200 backdrop-blur-md shadow-lg">
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Série</span>
                            <span className="block text-3xl font-black text-slate-900">{currentSet}</span>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Reps</span>
                            <span className="block text-3xl font-black text-slate-900">10-12</span>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Poids</span>
                            <span className="block text-3xl font-black text-[#D4AF37]">100kg</span>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="relative z-10 p-8 flex items-center justify-between bg-gradient-to-t from-white via-white/80 to-transparent">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-500 transition-all">
                            <Music className="w-4 h-4 text-[#D4AF37]" />
                            <span>Titan Flow Playlist</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Titan Neural Guard Active</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
