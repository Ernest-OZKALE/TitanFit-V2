"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Timer, Dumbbell, Zap, Play, Settings2, Hammer } from "lucide-react";
import { GlassCard, GoldButton } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

// Mock Exercise Database for generation logic
const EXERCISES_DB: any = {
    bodyweight: ["Burpees", "Push-ups", "Air Squats", "Lunges", "Plank", "Mountain Climbers"],
    dumbbells: ["DB Thrusters", "Renegade Rows", "DB Snatch", "Goblet Squats", "DB Press"],
    gym: ["Barbell Deadlift", "Bench Press", "Cable rows", "Leg Press"]
};

export function MacGyverGenerator() {
    const [duration, setDuration] = useState(20);
    const [intensity, setIntensity] = useState(8);
    const [equipment, setEquipment] = useState<"bodyweight" | "dumbbells" | "gym">("bodyweight");
    const [generatedWorkout, setGeneratedWorkout] = useState<any[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generate = () => {
        setIsGenerating(true);

        // Simulation of Algorithm
        setTimeout(() => {
            const baseExos = EXERCISES_DB[equipment];
            const count = Math.floor(duration / 5); // 1 exo per 5 mins approx
            const newWorkout = Array(count).fill(null).map((_, i) => ({
                id: i,
                name: baseExos[i % baseExos.length] || "Sprint",
                reps: intensity > 7 ? "Failure" : "12-15 reps",
                sets: intensity > 8 ? 5 : 3
            }));

            setGeneratedWorkout(newWorkout);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Input Control Panel */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-8">

                    {/* Duration */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Timer className="w-4 h-4" /> Time Available
                            </label>
                            <span className="text-2xl font-black text-slate-900">{duration} min</span>
                        </div>
                        <input
                            type="range" min="10" max="90" step="5" value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                    </div>

                    {/* Equipment */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Dumbbell className="w-4 h-4" /> Material
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {["bodyweight", "dumbbells", "gym"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setEquipment(opt as any)}
                                    className={cn(
                                        "py-3 rounded-xl text-xs font-bold uppercase border-2 transition-all",
                                        equipment === opt ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]" : "border-slate-100 text-slate-400 hover:border-slate-200"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Intensity */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Brutality Level
                            </label>
                            <span className={cn("text-xl font-black", intensity > 8 ? "text-red-500" : "text-slate-900")}>
                                {intensity}/10
                            </span>
                        </div>
                        <input
                            type="range" min="1" max="10" step="1" value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            className={cn("w-full h-2 rounded-lg appearance-none cursor-pointer", intensity > 8 ? "accent-red-500 bg-red-100" : "accent-[#D4AF37] bg-[#D4AF37]/20")}
                        />
                    </div>

                    <GoldButton onClick={generate} className="w-full py-4 text-lg">
                        {isGenerating ? "Algo Generating..." : "Generate Blueprint"}
                    </GoldButton>

                </div>
            </div>

            {/* Output / Result */}
            <div className="relative min-h-[400px]">
                {generatedWorkout ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900">Protocol Generated.</h3>
                            <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded-lg">
                                {equipment} • {duration}m
                            </span>
                        </div>

                        <div className="space-y-3">
                            {generatedWorkout.map((exo, i) => (
                                <GlassCard key={i} className="flex items-center justify-between p-4 group hover:border-[#D4AF37]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{exo.name}</h4>
                                            <p className="text-xs text-slate-500">{exo.sets} sets x {exo.reps}</p>
                                        </div>
                                    </div>
                                    <Settings2 className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37]" />
                                </GlassCard>
                            ))}
                        </div>

                        <GoldButton className="w-full py-4 animate-pulse shadow-gold-glow">
                            <Play className="w-5 h-5 mr-2" /> Start Now
                        </GoldButton>

                    </motion.div>
                ) : (
                    <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                            <Hammer className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">MacGyver Mode Ready</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            Définissez vos contraintes à gauche. L'algorithme construira la séance optimale.
                        </p>
                    </GlassCard>
                )}

                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                    >
                        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
                        <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">Computing Loads...</span>
                    </motion.div>
                )}
            </div>

        </div>
    );
}
