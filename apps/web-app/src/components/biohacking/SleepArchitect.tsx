"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, AlarmClock, BedDouble, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

export function SleepArchitect() {
    const [wakeTime, setWakeTime] = useState("07:00");
    const [cycles, setCycles] = useState<string[]>([]);

    const calculateSleep = (time: string) => {
        setWakeTime(time);

        const [hours, mins] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, mins, 0);

        // Calculate backwards 4, 5, and 6 cycles (90 mins each)
        // +15 mins average to fall asleep
        const sleepTimes = [6, 5, 4].map(numCycles => {
            const d = new Date(date);
            d.setMinutes(d.getMinutes() - (numCycles * 90) - 15);
            return {
                cycles: numCycles,
                time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                label: numCycles === 5 ? "Optimal (7.5h)" : numCycles === 6 ? "Athlete (9h)" : "Minimal (6h)"
            };
        });

        setCycles(sleepTimes as any);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">

            {/* Configure */}
            <div className="flex-1 space-y-6">
                <GlassCard className="bg-indigo-950 border-indigo-900/50 text-white">
                    <h3 className="text-2xl font-black flex items-center gap-2 mb-2">
                        <Moon className="w-6 h-6 text-[#D4AF37]" /> Sleep Architect
                    </h3>
                    <p className="text-indigo-200">
                        La récupération est anabolique. Synchronisez vos cycles REM.
                    </p>
                </GlassCard>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Je dois me lever à :
                    </label>
                    <div className="relative">
                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) => calculateSleep(e.target.value)}
                            className="w-full text-5xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 focus:border-[#D4AF37] focus:outline-none transition-colors text-slate-900"
                        />
                        <AlarmClock className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300" />
                    </div>

                    <div className="mt-4 flex gap-2 text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-xl">
                        <Info className="w-4 h-4" />
                        <span>Calcul incluant 15min pour s'endormir.</span>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2">Bedtime Windows</h4>

                <div className="space-y-3">
                    {cycles.length > 0 ? cycles.map((c: any, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={cn(
                                "p-6 rounded-2xl flex items-center justify-between transition-all cursor-pointer group hover:scale-[1.02]",
                                c.cycles === 5 ? "bg-[#D4AF37] text-white shadow-gold-glow" : "bg-white border border-slate-100"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3 rounded-xl", c.cycles === 5 ? "bg-white/20" : "bg-slate-50")}>
                                        <BedDouble className={cn("w-6 h-6", c.cycles === 5 ? "text-white" : "text-slate-400")} />
                                    </div>
                                    <div>
                                        <p className={cn("text-2xl font-black", c.cycles === 5 ? "text-white" : "text-slate-900")}>
                                            {c.time}
                                        </p>
                                        <p className={cn("text-xs font-bold uppercase", c.cycles === 5 ? "text-white/80" : "text-slate-400")}>
                                            {c.label}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className={cn("text-xs font-bold px-2 py-1 rounded", c.cycles === 5 ? "bg-white text-[#D4AF37]" : "bg-slate-100 text-slate-500")}>
                                        Set Alarm
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <button onClick={() => calculateSleep("07:00")} className="w-full py-4 text-slate-400 underline">
                            Calculer les cycles
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
