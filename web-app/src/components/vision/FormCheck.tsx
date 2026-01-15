"use client";

import { useState } from "react";
import { Upload, Video, CheckCircle2, AlertTriangle, PlayCircle, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";

export function FormCheck() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<"success" | "warning" | null>(null);

    const handleUpload = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult("warning");
        }, 2000);
    };

    return (
        <GlassCard className="relative overflow-hidden border border-white/10 bg-black/40">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Upload Area */}
                <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                        <Video className="w-8 h-8 text-[#D4AF37]" /> AI Form Check
                    </h3>
                    <p className="text-slate-400 mb-6">
                        Téléversez une vidéo de votre exercice. L'IA analysera votre biomécanique instantanément.
                    </p>

                    <div
                        onClick={handleUpload}
                        className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group bg-white/5 hover:bg-white/10 h-[250px]"
                    >
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                                <span className="text-[#D4AF37] font-bold animate-pulse">Analyse Biomecanique en cours...</span>
                            </div>
                        ) : result ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
                                    <PlayCircle className="w-10 h-10" />
                                </div>
                                <span className="text-white font-bold">Squat_Set_1.mp4</span>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Click to new analysis</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors">
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#D4AF37]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold mb-1 group-hover:text-[#D4AF37] transition-colors">Drop video here</p>
                                    <p className="text-xs text-slate-500 uppercase">MP4, MOV (Max 50MB)</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Results Placeholder */}
                <div className="flex-1 bg-black/50 rounded-2xl p-6 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Analyse Report</h4>

                    {result === "warning" ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                <div>
                                    <p className="text-yellow-500 font-bold uppercase text-xs">Correction Requise</p>
                                    <p className="text-white font-bold">Profondeur Insuffisante</p>
                                </div>
                                <span className="ml-auto text-2xl font-black text-white">88°</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Dos</span>
                                    <span className="text-green-500">Optimal</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[95%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Genoux</span>
                                    <span className="text-yellow-500">Instable</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[60%]" />
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-slate-300 italic">
                                    "Titan Coach: Essaie d'écarter légèrement plus les pieds pour atteindre la parallèle. Tes genoux rentrent vers l'intérieur lors de la remontée."
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                            <Activity className="w-16 h-16 text-white" />
                            <p className="text-sm text-slate-400">En attente de vidéo...</p>
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
