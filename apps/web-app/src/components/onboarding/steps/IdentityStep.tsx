'use client';

import { OnboardingData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StepProps {
    data: OnboardingData;
    update: (section: keyof OnboardingData, payload: any) => void;
}

export function IdentityStep({ data, update }: StepProps) {
    const { name, gender, age } = data.identity;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
                <Label className="text-xl font-bold text-white">Comment doit-on vous appeler ?</Label>
                <Input
                    value={name}
                    onChange={(e) => update('identity', { name: e.target.value })}
                    className="h-16 text-2xl bg-white/5 border-white/10 rounded-2xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    placeholder="Votre Prénom"
                    autoFocus
                />
            </div>

            <div className="space-y-4">
                <Label className="text-xl font-bold text-white">Genre & Âge</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                        {['male', 'female'].map((g) => (
                            <button
                                key={g}
                                onClick={() => update('identity', { gender: g })}
                                className={cn(
                                    "flex-1 h-16 rounded-2xl border-2 font-bold text-lg transition-all",
                                    gender === g
                                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                                        : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"
                                )}
                            >
                                {g === 'male' ? 'Homme' : 'Femme'}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={age}
                            onChange={(e) => update('identity', { age: Number(e.target.value) })}
                            className="h-16 text-center text-2xl font-mono bg-white/5 border-white/10 rounded-2xl focus:border-[#D4AF37]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold uppercase">ANS</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
