'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Activity, Dumbbell, Scale, Flame, Calculator, ChevronRight } from 'lucide-react';
import { CALCULATORS, Gender, ActivityLevel, Goal } from '@/lib/calculators';
import { cn } from '@/lib/utils'; // Assuming you have this utility

export default function TitanToolsPage() {
    const [activeTab, setActiveTab] = useState<'metabolic' | 'strength'>('metabolic');

    // --- METABOLIC STATE ---
    const [weight, setWeight] = useState(75);
    const [height, setHeight] = useState(180);
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState<Gender>('male');
    const [activity, setActivity] = useState<ActivityLevel>('moderate');
    const [goal, setGoal] = useState<Goal>('maintain');

    // --- STRENGTH STATE ---
    const [liftWeight, setLiftWeight] = useState(60);
    const [liftReps, setLiftReps] = useState(8);

    // --- COMPUTED RESULTS ---
    const bmr = CALCULATORS.calculateBMR(weight, height, age, gender);
    const tdee = CALCULATORS.calculateTDEE(bmr, activity);
    const macros = CALCULATORS.calculateMacros(tdee, goal);

    const oneRM = CALCULATORS.calculate1RM(liftWeight, liftReps);

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Titan Tools</h1>
                        <p className="text-gray-500">Suite d'analyse biométrique avancée</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('metabolic')}
                        className={cn("px-6 py-3 rounded-xl border flex items-center gap-2 transition-all", activeTab === 'metabolic' ? "bg-white/10 border-[#D4AF37] text-white" : "border-transparent text-gray-500 hover:text-white")}
                    >
                        <Flame className={cn("w-5 h-5", activeTab === 'metabolic' ? "text-[#D4AF37]" : "")} />
                        Moteur Métabolique
                    </button>
                    <button
                        onClick={() => setActiveTab('strength')}
                        className={cn("px-6 py-3 rounded-xl border flex items-center gap-2 transition-all", activeTab === 'strength' ? "bg-white/10 border-[#D4AF37] text-white" : "border-transparent text-gray-500 hover:text-white")}
                    >
                        <Dumbbell className={cn("w-5 h-5", activeTab === 'strength' ? "text-[#D4AF37]" : "")} />
                        Analyseur de Force (1RM)
                    </button>
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT PANEL: INPUTS */}
                    <div className="space-y-6">
                        {activeTab === 'metabolic' ? (
                            <Card className="bg-white/5 border-white/10 p-6 space-y-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-[#D4AF37]" /> Paramètres Corporels
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setGender('male')} className={cn("p-3 rounded border text-center font-bold uppercase text-sm", gender === 'male' ? "bg-[#D4AF37] text-black border-transparent" : "border-white/10 text-gray-500")}>Homme</button>
                                    <button onClick={() => setGender('female')} className={cn("p-3 rounded border text-center font-bold uppercase text-sm", gender === 'female' ? "bg-[#D4AF37] text-black border-transparent" : "border-white/10 text-gray-500")}>Femme</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm"><span>Poids</span> <span className="text-[#D4AF37]">{weight} kg</span></div>
                                    <Slider value={[weight]} onValueChange={(v) => setWeight(v[0])} min={40} max={150} step={1} />

                                    <div className="flex justify-between text-sm"><span>Taille</span> <span className="text-[#D4AF37]">{height} cm</span></div>
                                    <Slider value={[height]} onValueChange={(v) => setHeight(v[0])} min={140} max={220} step={1} />

                                    <div className="flex justify-between text-sm"><span>Âge</span> <span className="text-[#D4AF37]">{age} ans</span></div>
                                    <Slider value={[age]} onValueChange={(v) => setAge(v[0])} min={15} max={80} step={1} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500 font-bold">Activité</label>
                                    <select
                                        value={activity}
                                        onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                                        className="w-full bg-black border border-white/20 rounded p-2 text-sm"
                                    >
                                        <option value="sedentary">Sédentaire (Bureau)</option>
                                        <option value="light">Léger (1-3 jours/sem)</option>
                                        <option value="moderate">Modéré (3-5 jours/sem)</option>
                                        <option value="active">Actif (6-7 jours/sem)</option>
                                        <option value="athlete">Athlète (2x par jour)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500 font-bold">Objectif</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'cut', label: 'Sèche' },
                                            { id: 'maintain', label: 'Maintien' },
                                            { id: 'bulk', label: 'Prise de Masse' }
                                        ].map((g) => (
                                            <button
                                                key={g.id}
                                                onClick={() => setGoal(g.id as Goal)}
                                                className={cn("p-2 rounded text-xs font-bold uppercase", goal === g.id ? "bg-white text-black" : "bg-black hover:bg-white/10")}
                                            >
                                                {g.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="bg-white/5 border-white/10 p-6 space-y-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                                    <Dumbbell className="w-5 h-5 text-[#D4AF37]" /> Performance Actuelle
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2"><span>Charge Soulevée</span> <span className="text-[#D4AF37]">{liftWeight} kg</span></div>
                                        <Slider value={[liftWeight]} onValueChange={(v) => setLiftWeight(v[0])} min={10} max={300} step={2.5} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2"><span>Répétitions</span> <span className="text-[#D4AF37]">{liftReps} reps</span></div>
                                        <Slider value={[liftReps]} onValueChange={(v) => setLiftReps(v[0])} min={1} max={30} step={1} />
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT PANEL: RESULTS */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D4AF37] blur-[100px] opacity-10 pointer-events-none" />

                        {activeTab === 'metabolic' ? (
                            <Card className="bg-black/80 border border-[#D4AF37]/30 p-8 h-full flex flex-col justify-center relative backdrop-blur-xl">
                                <div className="text-center mb-8">
                                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Cible Journalière</p>
                                    <h2 className="text-6xl font-black text-white glow-text">{macros.calories}</h2>
                                    <span className="text-[#D4AF37] font-bold">KCAL / Jour</span>
                                </div>

                                <div className="space-y-4">
                                    {/* Protein Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1"><span className="text-blue-400 font-bold">Protéines</span> <span>{macros.protein}g</span></div>
                                        <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: '30%' }} /></div>
                                    </div>
                                    {/* Carbs Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1"><span className="text-green-400 font-bold">Glucides</span> <span>{macros.carbs}g</span></div>
                                        <div className="h-2 bg-green-900/30 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: '40%' }} /></div>
                                    </div>
                                    {/* Fats Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1"><span className="text-yellow-400 font-bold">Lipides</span> <span>{macros.fats}g</span></div>
                                        <div className="h-2 bg-yellow-900/30 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: '30%' }} /></div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="bg-black/80 border border-[#D4AF37]/30 p-8 h-full relative backdrop-blur-xl">
                                <div className="text-center mb-8">
                                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">1 Rep Max Théorique</p>
                                    <h2 className="text-6xl font-black text-white glow-text">{oneRM}</h2>
                                    <span className="text-[#D4AF37] font-bold">KG</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[95, 90, 85, 80, 75, 70].map((perc) => (
                                        <div key={perc} className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                                            <span className="text-gray-400 font-bold">{perc}%</span>
                                            <span className="text-white font-mono">{Math.round(oneRM * (perc / 100))} kg</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
