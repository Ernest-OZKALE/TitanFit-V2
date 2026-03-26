import { GlassCard } from "@/components/ui/GlassCard";
import { Moon, Info } from "lucide-react";
import { motion } from "framer-motion";
import { StrainMeter } from "./StrainMeter";
import { RecoveryShield } from "./RecoveryShield";
import { BioSparkline } from "./BioSparkline";

export function BioStatus() {
    // Mock Data (To be connected to Supabase/HealthKit later)
    const recovery = 78;
    const strain = 16.2;
    const sleepParams = "7h 45m";

    // Last 7 days mock trends
    const recoveryHistory = [65, 72, 85, 45, 68, 82, 78];
    const strainHistory = [12.4, 15.1, 14.8, 18.2, 13.5, 12.1, 16.2];

    return (
        <GlassCard className="h-full flex flex-col relative overflow-hidden group">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-[.3em] text-slate-400">
                        BIO-STATUS HUD
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[9px] font-mono text-green-600 uppercase">SYNCHRONISÉ</span>
                    </div>
                </div>
                <button className="p-2 rounded-xl bg-white/50 border border-slate-200 hover:bg-white transition-all shadow-sm">
                    <Info size={14} className="text-slate-400" />
                </button>
            </div>

            {/* Central Bio-Data Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* RECOVERY ZONE */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center gap-4"
                >
                    <RecoveryShield value={recovery} />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Trend • 7J</span>
                        <BioSparkline data={recoveryHistory} color="#10B981" />
                    </div>
                </motion.div>

                {/* STRAIN ZONE */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    <StrainMeter value={strain} />

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Intensité Hebdomadaire</span>
                            <span className="text-[10px] font-mono text-titan-gold italic">High Load</span>
                        </div>
                        <BioSparkline data={strainHistory} color="#D4AF37" height={50} />
                    </div>

                    {/* Sleep Micro-HUD */}
                    <div className="mt-2 p-3 rounded-2xl bg-white/80 border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500">
                                <Moon size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Qualité Sommeil</span>
                                <span className="text-sm font-black text-slate-900">RÉPARATEUR</span>
                            </div>
                        </div>
                        <span className="text-sm font-mono font-bold text-[#D4AF37]">{sleepParams}</span>
                    </div>
                </motion.div>
            </div>

            {/* Ambient HUD Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-titan-gold/5 blur-[60px] pointer-events-none" />
        </GlassCard>
    );
}
