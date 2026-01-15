"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Calendar, RefreshCcw, Info, ArrowRight } from "lucide-react";
import { GlassCard, GoldButton } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

const PHASES = [
    { id: "menstrual", label: "Menstruelle", days: [1, 5], color: "text-rose-500", bg: "bg-rose-500", advice: "Repos & Récupération" },
    { id: "follicular", label: "Folliculaire", days: [6, 12], color: "text-pink-400", bg: "bg-pink-400", advice: "Force & HIIT (High Energy)" },
    { id: "ovulation", label: "Ovulation", days: [13, 16], color: "text-[#D4AF37]", bg: "bg-[#D4AF37]", advice: "Records Personnels (Max Strength)" },
    { id: "luteal", label: "Lutéale", days: [17, 28], color: "text-purple-400", bg: "bg-purple-400", advice: "Endurance & Mobilité (Low Stress)" },
];

export function CycleSyncWidget() {
    const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [phase, setPhase] = useState(PHASES[0]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedDate = localStorage.getItem("titan_cycle_start");
        if (storedDate) {
            setLastPeriodDate(storedDate);
            calculatePhase(new Date(storedDate));
        } else {
            setIsEditing(true);
        }
    }, []);

    const calculatePhase = (startDate: Date) => {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Simple 28-day cycle loop
        const cycleDay = ((diffDays - 1) % 28) + 1;
        setCurrentDay(cycleDay);

        const currentPhase = PHASES.find(p => cycleDay >= p.days[0] && cycleDay <= p.days[1]) || PHASES[3]; // Default to Luteal if gap
        setPhase(currentPhase);
    };

    const handleSave = (date: string) => {
        localStorage.setItem("titan_cycle_start", date);
        setLastPeriodDate(date);
        calculatePhase(new Date(date));
        setIsEditing(false);
    };

    return (
        <GlassCard className="relative overflow-hidden min-h-[220px] flex flex-col justify-between group">
            <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg bg-pink-500/10", phase.color)}>
                        <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-200">Cycle Sync</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Bio-Rythme</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-slate-600 hover:text-white transition-colors p-1"
                >
                    <RefreshCcw className="w-4 h-4" />
                </button>
            </div>

            {isEditing ? (
                <div className="mt-4 space-y-4 z-10">
                    <label className="text-xs text-slate-400 font-bold uppercase">Date début dernières règles :</label>
                    <input
                        type="date"
                        onChange={(e) => handleSave(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none text-sm"
                    />
                </div>
            ) : (
                <div className="mt-4 relative z-10">
                    <div className="flex items-baseline gap-2 mb-2">
                        <h2 className={cn("text-3xl font-black uppercase italic", phase.color)}>
                            {phase.label}
                        </h2>
                        <span className="text-sm font-bold text-slate-500">Jour {currentDay}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                        <Info className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-medium text-slate-300">
                            Focus: <span className="text-white font-bold">{phase.advice}</span>
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        {PHASES.map((p) => {
                            const isCurrent = p.id === phase.id;
                            return (
                                <div
                                    key={p.id}
                                    className={cn("h-full transition-all", p.bg, isCurrent ? "opacity-100 shadow-[0_0_10px_currentColor]" : "opacity-20")}
                                    style={{ width: `${(p.days[1] - p.days[0] + 1) / 28 * 100}%` }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Background Bloom */}
            <div className={cn("absolute -bottom-10 -right-10 w-40 h-40 blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000", phase.bg.replace('bg-', 'bg-'))} />
        </GlassCard>
    );
}
