"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ArrowRight, Check, X, RotateCcw, Dumbbell, Activity, Flame } from "lucide-react";
import { GlassCard, GoldButton } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

// Mock Active Workout Data
const MOCK_WORKOUT = [
    { id: 1, name: "Barbell Bench Press", target: "4 sets x 8-10 reps", last: "80kg x 8", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1740&auto=format&fit=crop" },
    { id: 2, name: "Incline Dumbbell Flyes", target: "3 sets x 12 reps", last: "22kg x 12", image: "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1740&auto=format&fit=crop" },
];

export function SessionPlayer() {
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [weight, setWeight] = useState(80);
    const [reps, setReps] = useState(10);
    const [rpe, setRpe] = useState(8);
    const [isResting, setIsResting] = useState(false);
    const [restTimer, setRestTimer] = useState(90);

    const currentExercise = MOCK_WORKOUT[currentExerciseIdx];

    // Timer Tick
    useEffect(() => {
        let interval: any;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => setRestTimer(prev => prev - 1), 1000);
        } else if (restTimer === 0) {
            setIsResting(false);
            setRestTimer(90); // Reset for next set
            // Play sound here ideally
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    const handleLogSet = () => {
        setIsResting(true);
        setCurrentSet(prev => prev + 1);
        // In a real app we would check if sets are done to move to next exercise
    };

    const handleNextExercise = () => {
        setIsResting(false);
        setCurrentSet(1);
        if (currentExerciseIdx < MOCK_WORKOUT.length - 1) {
            setCurrentExerciseIdx(prev => prev + 1);
        } else {
            // Finish workout logic
            alert("Séance terminée Titan !");
        }
    };

    // Adjusters
    const adjust = (setter: any, val: number, delta: number) => setter(val + delta);

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">

            {/* 1. Header / Exercise Info */}
            <div className="relative h-[30vh]">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${currentExercise.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#D4AF37] text-slate-950 text-xs font-black px-2 py-0.5 rounded">
                                Ex {currentExerciseIdx + 1}/{MOCK_WORKOUT.length}
                            </span>
                            <span className="text-slate-400 text-xs font-bold uppercase">{currentExercise.target}</span>
                        </div>
                        <h1 className="text-3xl font-black leading-tight">{currentExercise.name}</h1>
                        <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                            <RotateCcw className="w-3 h-3" /> Last: {currentExercise.last}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-[#D4AF37]">{currentSet}<span className="text-lg text-slate-500 font-bold">/4</span></div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Set</div>
                    </div>
                </div>
            </div>

            {/* 2. Controls Area (One Thumb Design) */}
            <div className="flex-1 px-6 py-8 flex flex-col gap-8 relative z-10">

                {/* Weight & Reps Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Weight */}
                    <GlassCard className="!bg-slate-900 border-slate-800 flex flex-col items-center justify-center py-6 gap-4">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Load (kg)</span>
                        <div className="flex items-center gap-4 w-full justify-between px-2">
                            <button onClick={() => adjust(setWeight, weight, -2.5)} className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 active:scale-95 text-2xl font-bold text-slate-400">-</button>
                            <span className="text-4xl font-black text-white">{weight}</span>
                            <button onClick={() => adjust(setWeight, weight, 2.5)} className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37]/20 active:scale-95 text-2xl font-bold text-[#D4AF37]">+</button>
                        </div>
                    </GlassCard>

                    {/* Reps */}
                    <GlassCard className="!bg-slate-900 border-slate-800 flex flex-col items-center justify-center py-6 gap-4">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Reps</span>
                        <div className="flex items-center gap-4 w-full justify-between px-2">
                            <button onClick={() => adjust(setReps, reps, -1)} className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 active:scale-95 text-2xl font-bold text-slate-400">-</button>
                            <span className="text-4xl font-black text-white">{reps}</span>
                            <button onClick={() => adjust(setReps, reps, 1)} className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37]/20 active:scale-95 text-2xl font-bold text-[#D4AF37]">+</button>
                        </div>
                    </GlassCard>
                </div>

                {/* RPE Slider */}
                <GlassCard className="!bg-slate-900 border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Intensity (RPE)</span>
                        <span className={cn("text-xl font-black", rpe > 8 ? "text-red-500" : "text-[#D4AF37]")}>{rpe}/10</span>
                    </div>
                    <input
                        type="range" min="1" max="10" step="0.5"
                        value={rpe} onChange={(e) => setRpe(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
                        <span>Warmup</span>
                        <span>Hard</span>
                        <span>Failure</span>
                    </div>
                </GlassCard>

                {/* Actions */}
                <div className="mt-auto">
                    {isResting ? (
                        <GoldButton onClick={() => setIsResting(false)} className="w-full py-6 text-xl animate-pulse bg-red-600 hover:bg-red-700 border-none shadow-none text-white">
                            <span className="flex items-center gap-3">
                                <Timer className="w-6 h-6" /> Skip Rest ({restTimer}s)
                            </span>
                        </GoldButton>
                    ) : (
                        <div className="flex gap-4">
                            <GoldButton onClick={handleLogSet} className="flex-1 py-6 text-xl shadow-gold-glow">
                                <Check className="w-6 h-6 mr-2" /> Log Set
                            </GoldButton>
                            {/* Temporary Next Exercise Button for Demo */}
                            <button onClick={handleNextExercise} className="px-6 rounded-2xl border border-slate-700 text-slate-400">
                                <ArrowRight />
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Rest Overlay (Backdrop) */}
            <AnimatePresence>
                {isResting && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-t from-red-900/10 to-transparent"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
