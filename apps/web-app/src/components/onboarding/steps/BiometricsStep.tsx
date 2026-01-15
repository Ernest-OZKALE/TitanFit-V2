'use client';

import { OnboardingData } from "../types";
import { Label } from "@/components/ui/label";

interface StepProps {
    data: OnboardingData;
    update: (section: keyof OnboardingData, payload: any) => void;
}

export function BiometricsStep({ data, update }: StepProps) {
    const { weight, height, target_weight } = data.biometrics;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="grid grid-cols-2 gap-8">
                {/* Weight */}
                <div className="space-y-4">
                    <Label className="text-gray-400 font-bold uppercase tracking-widest text-sm">Poids Actuel (kg)</Label>
                    <input
                        type="number"
                        value={weight || ''}
                        onChange={(e) => update('biometrics', { weight: Number(e.target.value) })}
                        className="w-full bg-transparent border-b-2 border-white/20 py-4 text-5xl font-black text-white focus:border-[#D4AF37] outline-none text-center transition-all placeholder:text-white/10"
                        placeholder="00"
                    />
                </div>

                {/* Target */}
                <div className="space-y-4">
                    <Label className="text-gray-400 font-bold uppercase tracking-widest text-sm">Objectif (kg)</Label>
                    <input
                        type="number"
                        value={target_weight || ''}
                        onChange={(e) => update('biometrics', { target_weight: Number(e.target.value) })}
                        className="w-full bg-transparent border-b-2 border-white/20 py-4 text-5xl font-black text-[#D4AF37] focus:border-[#D4AF37] outline-none text-center transition-all placeholder:text-[#D4AF37]/10"
                        placeholder="00"
                    />
                </div>
            </div>

            {/* Height */}
            <div className="max-w-[200px] mx-auto space-y-4">
                <Label className="block text-center text-gray-400 font-bold uppercase tracking-widest text-sm">Taille (cm)</Label>
                <div className="relative">
                    <input
                        type="number"
                        value={height || ''}
                        onChange={(e) => update('biometrics', { height: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-4xl font-bold text-white text-center focus:border-[#D4AF37] outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
