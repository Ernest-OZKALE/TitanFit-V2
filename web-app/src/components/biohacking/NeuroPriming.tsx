"use client";

import { useState } from "react";
import { Play, Pause, FastForward, Headphones, Brain, Activity } from "lucide-react";
import { GlassCard, PremiumProgressBar } from "@/components/ui/premium-components";

const TRACKS = [
    { id: 1, title: "Deep Work Focus", type: "Binaural 40Hz", duration: "45:00", description: "Ondes Gamma pour concentration extrême." },
    { id: 2, title: "Pre-Workout Rage", type: "Isochronic Beats", duration: "15:00", description: "Activation du système nerveux sympathique." },
    { id: 3, title: "Rapid Recovery", type: "Delta Waves", duration: "20:00", description: "Induction relaxation profonde post-séance." },
];

export function NeuroPriming() {
    const [activeTrack, setActiveTrack] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = (id: number) => {
        if (activeTrack === id) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveTrack(id);
            setIsPlaying(true);
            setProgress(0);
        }
    };

    return (
        <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Brain className="w-64 h-64 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 space-y-6">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Headphones className="w-8 h-8 text-[#D4AF37]" /> Neuro Priming
                    </h3>
                    <p className="text-slate-500">Audio-stimulation pour états de conscience modifiés.</p>
                </div>

                <div className="grid gap-4">
                    {TRACKS.map((track) => (
                        <div
                            key={track.id}
                            className={`p-4 rounded-xl border transition-all ${activeTrack === track.id ? 'bg-slate-900 border-[#D4AF37]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => togglePlay(track.id)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTrack === track.id ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_15px_#D4AF37]' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >
                                    {activeTrack === track.id && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                </button>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold ${activeTrack === track.id ? 'text-white' : 'text-slate-900'}`}>{track.title}</h4>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${activeTrack === track.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-slate-100 text-slate-500'}`}>{track.type}</span>
                                    </div>
                                    <p className={`text-sm ${activeTrack === track.id ? 'text-slate-400' : 'text-slate-500'}`}>{track.description}</p>
                                </div>
                            </div>

                            {activeTrack === track.id && (
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="text-xs font-mono text-[#D4AF37]">04:20</span>
                                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#D4AF37] w-1/3 relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">{track.duration}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
