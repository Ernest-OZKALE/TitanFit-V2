
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { OnboardingData } from '../types';
import { Sun, Moon, Battery, Briefcase, Zap, CalendarDays, Clock } from 'lucide-react';

interface LifestyleStepProps {
    data: OnboardingData['lifestyle'];
    updateData: (data: Partial<OnboardingData['lifestyle']>) => void;
}

export function LifestyleStep({ data, updateData }: LifestyleStepProps) {

    const toggleDay = (day: string) => {
        const currentDays = data.training_schedule || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        updateData({ training_schedule: newDays });
    };

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase relative inline-block">
                    Rythme <span className="text-blue-500">Biologique</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm">Synchronisation des cycles circadiens.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Daily Rhythm */}
                <div className="space-y-6">
                    <Label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Chronotype (Réveil)
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'early', label: 'Tôt', icon: Sun, time: '05h-07h' },
                            { value: 'standard', label: 'Standard', icon: Clock, time: '07h-09h' },
                            { value: 'late', label: 'Tard', icon: Moon, time: '09h+' }
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => updateData({ wake_time: opt.value as any })}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${data.wake_time === opt.value
                                        ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-black/40 border-white/10 text-gray-500 hover:bg-black/60'
                                    }`}
                            >
                                <opt.icon className="w-6 h-6" />
                                <div className="text-xs font-bold uppercase">{opt.label}</div>
                                <div className="text-[10px] text-gray-500">{opt.time}</div>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 space-y-4">
                        <Label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Moon className="w-4 h-4" /> Sommeil Moyen : <span className="text-white text-lg ml-2">{data.sleep_hours}h</span>
                        </Label>
                        <Slider
                            value={[data.sleep_hours]}
                            min={4}
                            max={12}
                            step={0.5}
                            onValueChange={(vals) => updateData({ sleep_hours: vals[0] })}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase">
                            <span>Insomnie</span>
                            <span>Optimal</span>
                            <span>Hibernation</span>
                        </div>
                    </div>
                </div>

                {/* 2. Energy & Activity */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Activité Quotidienne (Travail)
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val: 'sedentary', label: 'Sédentaire', desc: 'Bureau / Assis' },
                                { val: 'light', label: 'Légère', desc: 'Debout / Marche' },
                                { val: 'active', label: 'Active', desc: 'Physique' },
                                { val: 'physical', label: 'Intense', desc: 'Chantier / Sport' }
                            ].map((job) => (
                                <button
                                    key={job.val}
                                    onClick={() => updateData({ job_activity: job.val as any })}
                                    className={`p-3 text-left rounded-lg border transition-all ${data.job_activity === job.val
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'
                                        }`}
                                >
                                    <div className="text-xs font-bold uppercase">{job.label}</div>
                                    <div className="text-[10px] opacity-70">{job.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Niveaux de Stress & Énergie
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Stress */}
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-gray-500 mb-2">Stress</div>
                                <div className="flex gap-1">
                                    {['low', 'medium', 'high'].map(lvl => (
                                        <div
                                            key={lvl}
                                            onClick={() => updateData({ stress_level: lvl as any })}
                                            className={`h-2 flex-1 rounded-full cursor-pointer transition-colors ${data.stress_level === lvl // simplistic check logic for visuals
                                                    || (data.stress_level === 'medium' && lvl === 'low')
                                                    || (data.stress_level === 'high' && lvl !== 'high') // logic is flawed for accumulated bar, let's do simple select
                                                    ? (data.stress_level === lvl ? 'bg-red-500' : 'bg-gray-800') // Actually simple select is better
                                                    : 'bg-gray-800'
                                                }`}
                                        />
                                    ))}
                                </div>
                                {/* Better Stress UI Selector */}
                                <div className="flex gap-1 mt-2">
                                    {['low', 'medium', 'high'].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => updateData({ stress_level: lvl as any })}
                                            className={`flex-1 text-[10px] font-bold uppercase py-1 rounded ${data.stress_level === lvl
                                                    ? (lvl === 'low' ? 'bg-green-500/20 text-green-500' : lvl === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500')
                                                    : 'text-gray-600 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Energy */}
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-gray-500 mb-2">Énergie (Matin)</div>
                                <div className="flex gap-1 mt-2">
                                    {['low', 'medium', 'high'].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => updateData({ energy_level: lvl as any })}
                                            className={`flex-1 text-[10px] font-bold uppercase py-1 rounded ${data.energy_level === lvl
                                                    ? 'bg-[#D4AF37] text-black'
                                                    : 'text-gray-600 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <Battery className={`w-3 h-3 mx-auto ${lvl === 'low' ? 'rotate-90' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Availability Calendar */}
            <div className="pt-6 border-t border-white/5">
                <Label className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4" /> Disponibilité Entraînement
                </Label>
                <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`flex-1 min-w-[3rem] aspect-square rounded-full flex items-center justify-center font-bold text-xs transition-all ${data.training_schedule?.includes(day)
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105'
                                    : 'bg-black/40 border-2 border-dashed border-white/10 text-gray-600 hover:border-white/30'
                                }`}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
