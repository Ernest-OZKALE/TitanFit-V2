"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw, Zap, Flame, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/premium-components";
import { useRouter } from "next/navigation";

// Types
type MuscleGroup = "chest" | "abs" | "quads" | "delts" | "biceps" | "forearms" | "back" | "lats" | "traps" | "glutes" | "hamstrings" | "calves" | "triceps";

// Simplified Polygon Paths for Muscles (Stylized Titan Design)
const PATHS = {
    front: {
        chest: "M35,35 Q50,45 65,35 L60,55 Q50,60 40,55 Z",
        abs: "M42,56 L58,56 L56,80 L44,80 Z",
        quads: "M38,82 L62,82 L60,110 L40,110 Z",
        delts: "M25,32 L35,35 L38,50 L22,45 Z M75,32 L65,35 L62,50 L78,45 Z",
        biceps: "M22,46 L36,50 L34,65 L20,60 Z M78,46 L64,50 L66,65 L80,60 Z",
        forearms: "M18,62 L32,66 L30,85 L16,80 Z M82,62 L68,66 L70,85 L84,80 Z",
    },
    back: {
        traps: "M35,30 L65,30 L60,40 L40,40 Z",
        lats: "M38,42 L62,42 L58,70 L42,70 Z",
        triceps: "M25,45 L35,45 L32,60 L22,60 Z M75,45 L65,45 L68,60 L78,60 Z",
        glutes: "M38,72 L62,72 L60,85 L40,85 Z",
        hamstrings: "M38,87 L62,87 L60,105 L40,105 Z",
        calves: "M38,107 L62,107 L60,125 L40,125 Z",
    }
};

// Mock Recovery Data
const RECOVERY_STATUS: Record<string, number> = {
    chest: 90, // Recovered
    abs: 100,
    quads: 20, // Sore (Red)
    delts: 80,
    biceps: 100,
    back: 100,
    lats: 60,
    traps: 100,
    hamstrings: 30, // Sore
};

export function AnatomicalMap() {
    const [view, setView] = useState<"front" | "back">("front");
    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter(); // Hook

    const toggleMuscle = (muscle: string) => {
        setSelected(prev =>
            prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
        );
    };

    const getHeatColor = (muscle: string) => {
        const recovery = RECOVERY_STATUS[muscle] ?? 100;
        if (recovery < 40) return "#EF4444"; // Red (Sore)
        if (recovery < 70) return "#F59E0B"; // Orange (Recovering)
        return "#10B981"; // Green (Fresh)
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[500px]">

            {/* LEFT: The Map */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl p-8">

                {/* View Toggle */}
                <div className="absolute top-6 right-6 flex bg-white rounded-full p-1 shadow-sm border border-slate-100">
                    <button
                        onClick={() => setView("front")}
                        className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all", view === "front" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}
                    >Front</button>
                    <button
                        onClick={() => setView("back")}
                        className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all", view === "back" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}
                    >Back</button>
                </div>

                {/* Legend */}
                <div className="absolute top-6 left-6 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fresh
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> Sore
                    </div>
                </div>

                {/* SVG Container */}
                <div className="h-[400px] w-full max-w-[300px] relative">
                    <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-xl">
                        {/* Silhouette Base (Stylized) */}
                        <path
                            d="M30,20 Q50,10 70,20 L75,30 L85,45 L90,70 L80,130 L50,140 L20,130 L10,70 L15,45 L25,30 Z"
                            fill="#F8FAFC"
                            stroke="#E2E8F0"
                            strokeWidth="0.5"
                        />

                        {/* Render Muscles */}
                        {Object.entries(PATHS[view]).map(([muscle, path]) => {
                            const isSelected = selected.includes(muscle);
                            const recoveryColor = getHeatColor(muscle); // For outline or faint tint

                            return (
                                <motion.path
                                    key={muscle}
                                    d={path}
                                    fill={isSelected ? "#D4AF37" : "white"}
                                    stroke={isSelected ? "#B8860B" : "rgba(0,0,0,0.1)"}
                                    strokeWidth={isSelected ? "1" : "0.5"}
                                    className="cursor-pointer transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleMuscle(muscle)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Overlay Labels (Centered) */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Example Overlay */}
                    </div>
                </div>
            </div>

            {/* RIGHT: The Engine Controls */}
            <GlassCard className="w-full md:w-96 flex flex-col p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <RefreshCw className="w-32 h-32 text-slate-900" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-[#D4AF37] fill-current" /> Bio-Engine
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Sélectionnez les zones cibles.</p>
                    </div>

                    {/* Selection List */}
                    <div className="flex-1">
                        {selected.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center border-2 border-dashed border-slate-100 rounded-2xl p-6">
                                <Info className="w-8 h-8 mb-2 opacity-50" />
                                Cliquez sur le modèle <br /> pour construire votre séance.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Muscles Ciblés</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selected.map(m => (
                                        <span key={m} className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full capitalize flex items-center gap-2 animate-in fade-in zoom-in">
                                            {m} <button onClick={() => toggleMuscle(m)} className="hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>

                                {/* Warnings if sore */}
                                {selected.some(m => getHeatColor(m) === "#EF4444") && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
                                        <Flame className="w-4 h-4" /> Attention: Zones en récupération active.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Group */}
                    <div className="mt-8 space-y-3">
                        <button
                            disabled={selected.length === 0}
                            className="w-full py-4 bg-[#D4AF37] text-white font-black rounded-xl shadow-gold-glow hover:bg-[#B8860B] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={cn("w-5 h-5", selected.length > 0 && "animate-spin-slow")} />
                            Générer la Séance
                        </button>

                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>MacGyver Mode: OFF</span>
                            <span>Gym Equipment</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
