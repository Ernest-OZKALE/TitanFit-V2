'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, ChevronRight, Play, Pause, Square } from 'lucide-react';
import Link from 'next/link';
import RestOverlay from '@/components/workout/RestOverlay';

export default function ActiveWorkoutPage() {
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(0);

    // EXERCISE DATA
    const [weight, setWeight] = useState(100);
    const [reps, setReps] = useState(8);

    const adjustWeight = (delta: number) => setWeight(prev => Math.max(0, prev + delta));
    const adjustReps = (delta: number) => setReps(prev => Math.max(0, prev + delta));

    // TIMER LOGIC
    useEffect(() => {
        setIsActive(true);
        const interval = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // REST LOGIC
    const [isResting, setIsResting] = useState(false);

    const handleValidate = () => {
        // Haptic/Visual Feedback
        const btn = document.getElementById('validate-btn');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
        }
        // Start Rest Timer
        setIsResting(true);
    };

    const handleRestComplete = () => {
        setIsResting(false);
        // Move to next set here (Mock)
    };

    return (
        <div className="h-screen flex flex-col relative">
            <RestOverlay
                isVisible={isResting}
                duration={90}
                onComplete={handleRestComplete}
            />

            {/* HEADER: Dynamic Island Style Timer */}
            <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-start z-50">
                <Link href="/dashboard" className="p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </Link>

                <div className="flex flex-col items-center gap-1">
                    <div className="px-5 py-2 bg-black/50 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                        <span className="font-mono text-2xl font-bold text-white tracking-widest">{formatTime(timer)}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Flux Actif</span>
                </div>

                <div className="w-12" /> {/* Spacer for centering */}
            </header>

            {/* MAIN CONTENT: The Stage */}
            <main className="flex-1 flex flex-col justify-center items-center p-6 mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em]">Exercice 1/6</h2>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                            Développé Couché <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">Barre Olympique</span>
                        </h1>
                    </div>

                    {/* INPUT MATRIX (INTERACTIVE) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* WEIGHT CONTROL */}
                        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Charge (Kg)</span>
                            <div className="flex items-center justify-between w-full h-full">
                                <button onClick={() => adjustWeight(-2.5)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
                                    <span className="text-2xl font-bold mb-1">-</span>
                                </button>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-32 bg-transparent text-5xl font-black text-center text-white tracking-tighter outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button onClick={() => adjustWeight(2.5)} className="w-10 h-10 rounded-full bg-[#D4AF37] hover:bg-[#F5C518] flex items-center justify-center text-black active:scale-90 transition-all shadow-lg shadow-[#D4AF37]/20">
                                    <span className="text-2xl font-bold mb-1">+</span>
                                </button>
                            </div>
                        </div>

                        {/* REPS CONTROL */}
                        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Reps</span>
                            <div className="flex items-center justify-between w-full h-full">
                                <button onClick={() => adjustReps(-1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
                                    <span className="text-2xl font-bold mb-1">-</span>
                                </button>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={(e) => setReps(Number(e.target.value))}
                                    className="w-32 bg-transparent text-5xl font-black text-center text-white tracking-tighter outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button onClick={() => adjustReps(1)} className="w-10 h-10 rounded-full bg-[#D4AF37] hover:bg-[#F5C518] flex items-center justify-center text-black active:scale-90 transition-all shadow-lg shadow-[#D4AF37]/20">
                                    <span className="text-2xl font-bold mb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        id="validate-btn"
                        onClick={handleValidate}
                        className="w-full py-6 rounded-3xl bg-[#D4AF37] hover:bg-[#F5C518] text-black font-black uppercase text-xl tracking-widest flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all transform active:scale-95"
                    >
                        <Play className="w-6 h-6 fill-black" />
                        Valider Série
                    </button>

                </motion.div>
            </main>

            {/* FOOTER: Queue */}
            <footer className="p-6 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                    <span>Prochaine Séquence</span>
                    <span>2 min repos</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center opacity-50">
                    <span className="font-bold text-white">Écarté Couché Haltères</span>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
            </footer>
        </div>
    );
}
