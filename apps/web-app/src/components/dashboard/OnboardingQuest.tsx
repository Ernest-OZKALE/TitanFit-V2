import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

const QUESTS = [
    { id: 1, label: "Complete Profile", done: true },
    { id: 2, label: "Log First Meal", done: false },
    { id: 3, label: "Sync Wearable", done: false },
    { id: 4, label: "Join a Squad", done: false },
];

export function OnboardingQuest() {
    const [quests, setQuests] = useState(QUESTS);

    const progress = Math.round(
        (quests.filter((q) => q.done).length / quests.length) * 100
    );

    return (
        <GlassCard className="h-full flex flex-col justify-between" gradient>
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Protocole Titan</h3>
                <p className="text-xs text-slate-400 mb-4">Complétez l'initiation pour débloquer l'accès complet.</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden border border-slate-200/50">
                    <div
                        className="bg-[#D4AF37] h-full rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm group cursor-pointer">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="text-slate-400 line-through">Compéter le Profil</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group cursor-pointer">
                        <Circle className="text-slate-300 w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
                        <span className="text-slate-700 font-medium group-hover:text-slate-900">Logger le premier repas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group cursor-pointer">
                        <Circle className="text-slate-300 w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
                        <span className="text-slate-700 font-medium group-hover:text-slate-900">Synchroniser un appareil</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group cursor-pointer">
                        <Circle className="text-slate-300 w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
                        <span className="text-slate-700 font-medium group-hover:text-slate-900">Rejoindre une Tribu</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <span className="text-[10px] text-[#D4AF37] font-bold font-mono border border-[#D4AF37]/30 px-3 py-1.5 rounded-full bg-[#D4AF37]/5 uppercase tracking-wider shadow-sm">
                    RÉCOMPENSE : SKIN BLACK CARD
                </span>
            </div>
        </GlassCard>
    );
}
