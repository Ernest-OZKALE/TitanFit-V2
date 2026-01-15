'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Icons
import { User, Users, Target, Dumbbell, Zap, Play, ChevronRight, ChevronLeft, Check, Activity, Flame } from 'lucide-react';
// Components
import BodyMap from '@/components/dashboard/BodyMap';
import { EXERCISE_DB, Exercise, Equipment, Difficulty } from '@/lib/exercise-db';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

type GeneratorStep = 'gender' | 'age' | 'goal' | 'level' | 'equipment' | 'muscle' | 'loading' | 'results';

export default function WorkoutGeneratorPage() {
    const [step, setStep] = useState<GeneratorStep>('gender');

    // --- STATE ---
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState<number>(25);
    const [goal, setGoal] = useState<'lose_weight' | 'gain_muscle' | 'strength'>('gain_muscle');
    const [level, setLevel] = useState<Difficulty>('intermediate');
    const [equipment, setEquipment] = useState<Equipment[]>(['bodyweight']); // Multi-select
    const [muscle, setMuscle] = useState<string | null>(null);

    const [generatedWorkout, setGeneratedWorkout] = useState<Exercise[]>([]);

    // --- NAVIGATION ---
    const nextStep = (next: GeneratorStep) => setStep(next);
    const prevStep = (prev: GeneratorStep) => setStep(prev);

    // --- GENERATION LOGIC ---
    const generateWorkout = () => {
        setStep('loading');

        // Simulation of API/Algo delay
        setTimeout(() => {
            // Filter DB
            const relevant = EXERCISE_DB.filter(ex => {
                // 1. Muscle Match (Direct or Parent Zone)
                // Note: Our DB uses specific IDs. In Generator we might select broad zones.
                // For MVP, we assume exact match or simple inclusion.
                const muscleMatch = ex.targetMuscles.includes(muscle || '') ||
                    ex.secondaryMuscles?.includes(muscle || '');

                // 2. Equipment Match (User must have ONE of the required equips)
                // e.g. Exercise needs 'barbell'. User has 'barbell, dumbbell'. Match = YES.
                // e.g. Exercise needs 'machine'. User has 'dumbbell'. Match = NO.
                const hasEquipment = ex.equipment.some(req => equipment.includes(req));

                // 3. Difficulty (loosen this constraint to ensure results?)
                // Let's bias: If user is beginner, avoid advanced.
                const levelMatch = level === 'beginner' ? ex.difficulty !== 'advanced' : true;

                return muscleMatch && hasEquipment && levelMatch;
            });

            // Fallback content if empty
            if (relevant.length === 0) {
                // Push some bodyweight basics if nothing found
                const basics = EXERCISE_DB.filter(ex => ex.equipment.includes('bodyweight') && ex.category === 'strength').slice(0, 3);
                setGeneratedWorkout(basics);
            } else {
                setGeneratedWorkout(relevant);
            }

            setStep('results');
        }, 2000);
    };

    // --- RENDER STEPS ---

    const renderGender = () => (
        <div className="space-y-8 text-center animate-in fade-in slide-in-from-right-10">
            <h2 className="text-3xl font-bold uppercase">Identification</h2>
            <div className="flex gap-6 justify-center">
                <button
                    onClick={() => { setGender('male'); nextStep('age'); }}
                    className="w-40 h-40 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <User className="w-12 h-12" />
                    <span className="font-bold uppercase tracking-widest">Homme</span>
                </button>
                <button
                    onClick={() => { setGender('female'); nextStep('age'); }}
                    className="w-40 h-40 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <Users className="w-12 h-12" />
                    <span className="font-bold uppercase tracking-widest">Femme</span>
                </button>
            </div>
        </div>
    );

    const renderAge = () => (
        <div className="space-y-8 text-center max-w-md mx-auto animate-in fade-in slide-in-from-right-10">
            <h2 className="text-3xl font-bold uppercase">Âge Biologique</h2>
            <div className="py-12">
                <div className="text-6xl font-bold text-[#D4AF37] mb-8">{age}</div>
                <Slider
                    value={[age]}
                    onValueChange={(v) => setAge(v[0])}
                    min={16}
                    max={90}
                    step={1}
                    className="cursor-pointer"
                />
            </div>
            <Button onClick={() => nextStep('goal')} className="w-full bg-white text-black hover:bg-[#D4AF37]">Continuer</Button>
        </div>
    );

    const renderGoal = () => (
        <div className="space-y-6 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-right-10">
            <h2 className="text-3xl font-bold uppercase">Objectif Principal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'lose_weight', label: 'Perte de Gras', icon: Flame },
                    { id: 'gain_muscle', label: 'Hypertrophie', icon: Dumbbell },
                    { id: 'strength', label: 'Force Pure', icon: Activity }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setGoal(item.id as any); nextStep('level'); }}
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all flex flex-col items-center gap-4 group text-left"
                    >
                        <item.icon className="w-8 h-8 text-gray-400 group-hover:text-[#D4AF37]" />
                        <span className="font-bold uppercase text-sm">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderLevel = () => (
        <div className="space-y-6 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-right-10">
            <h2 className="text-3xl font-bold uppercase">Niveau d'Expérience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'beginner', label: 'Débutant', sub: '0-1 an' },
                    { id: 'intermediate', label: 'Intermédiaire', sub: '1-3 ans' },
                    { id: 'advanced', label: 'Titan', sub: '3+ ans' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setLevel(item.id as any); nextStep('equipment'); }}
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all flex flex-col items-center gap-2 group"
                    >
                        <span className="font-bold uppercase text-lg">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.sub}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderEquipment = () => {
        const toggleEquip = (eq: Equipment) => {
            if (equipment.includes(eq)) {
                setEquipment(equipment.filter(e => e !== eq));
            } else {
                setEquipment([...equipment, eq]);
            }
        };

        return (
            <div className="space-y-8 text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-right-10">
                <h2 className="text-3xl font-bold uppercase">Arsenal Disponible</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { id: 'bodyweight', label: 'Poids du Corps' },
                        { id: 'dumbbell', label: 'Haltères' },
                        { id: 'barbell', label: 'Barre Olympique' },
                        { id: 'cable', label: 'Poulies' },
                        { id: 'machine', label: 'Machines' },
                        { id: 'kettlebell', label: 'Kettlebells' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleEquip(item.id as Equipment)}
                            className={cn(
                                "p-4 rounded-xl border transition-all flex items-center justify-between",
                                equipment.includes(item.id as Equipment)
                                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            )}
                        >
                            <span className="font-medium">{item.label}</span>
                            {equipment.includes(item.id as Equipment) && <Check className="w-5 h-5" />}
                        </button>
                    ))}
                </div>
                <Button onClick={() => nextStep('muscle')} className="w-full max-w-xs bg-white text-black hover:bg-[#D4AF37]">
                    Confirmer l'Arsenal
                </Button>
            </div>
        );
    };

    const renderMuscle = () => (
        <div className="h-full flex flex-col animate-in fade-in zoom-in-95">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold uppercase">Zone Cible</h2>
                <p className="text-gray-400 text-sm">Cliquez sur le muscle à détruire</p>
            </div>

            <div className="flex-1 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden relative">
                <BodyMap
                    selectedMuscle={muscle}
                    onMuscleSelect={(m) => { setMuscle(m); generateWorkout(); }}
                />
                {/* Overlay hint */}
                <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 rounded text-xs text-[#D4AF37]">
                    Mode: Sélection Unique
                </div>
            </div>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in">
            <div className="w-24 h-24 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-bold uppercase animate-pulse">Configuration du Protocole...</h2>
            <p className="text-gray-500 mt-2">Analyse de la compatibilité biomécanique</p>
        </div>
    );

    const renderResults = () => {
        return (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-20 fade-in duration-700">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase text-white">Protocole <span className="text-[#D4AF37]">Généré</span></h1>
                        <p className="text-gray-400">Basé sur votre profil Titan</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.reload()}>Nouveau Scan</Button>
                </div>

                {/* FATIGUE GRADIENT (Titan Feature) */}
                <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#D4AF37]" /> Gradient de Fatigue estimé
                    </h3>
                    <div className="flex items-center gap-1 h-12 w-full">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="h-full flex-1 rounded-sm"
                                style={{
                                    background: i < 15 ? `rgba(212, 175, 55, ${i / 15})` : '#333',
                                    opacity: i < 15 ? 1 : 0.2
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* EXERCISE LIST */}
                <div className="space-y-4">
                    {generatedWorkout.map((ex, i) => (
                        <div key={i} className="group relative bg-black border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Zap className="w-12 h-12 text-[#D4AF37]" />
                            </div>

                            <div className="flex gap-6 items-start relative z-10">
                                {/* Number */}
                                <div className="text-4xl font-black text-gray-800 group-hover:text-white transition-colors">
                                    {String(i + 1).padStart(2, '0')}
                                </div>

                                <div className="flex-1">
                                    <div className="flex gap-3 mb-2">
                                        {ex.targetMuscles.map(m => (
                                            <Badge key={m} variant="outline" className="text-[10px] border-[#D4AF37]/50 text-[#D4AF37]">
                                                {m}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{ex.name}</h3>

                                    {/* Instructions */}
                                    <div className="space-y-1 mt-4 pl-4 border-l-2 border-white/10">
                                        {ex.instructions.map((inst, idx) => (
                                            <p key={idx} className="text-sm text-gray-400">{inst}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {generatedWorkout.length === 0 && (
                        <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                            <p className="text-gray-500">Aucun exercice trouvé pour cette configuration exotique.</p>
                            <Button variant="link" onClick={() => setStep('equipment')} className="text-[#D4AF37]">Modifier l'équipement</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col">
            {/* Nav Bar placeholder */}
            <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between">
                <span className="font-bold tracking-widest text-[#D4AF37]">TITAN GENERATOR</span>
                <div className="flex gap-2">
                    {step !== 'gender' && step !== 'results' && step !== 'loading' && (
                        <Button variant="ghost" size="sm" onClick={() => prevStep('gender')}><ChevronLeft className="w-4 h-4" /> Retour</Button>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col justify-center min-h-[600px]">
                {step === 'gender' && renderGender()}
                {step === 'age' && renderAge()}
                {step === 'goal' && renderGoal()}
                {step === 'level' && renderLevel()}
                {step === 'equipment' && renderEquipment()}
                {step === 'muscle' && renderMuscle()}
                {step === 'loading' && renderLoading()}
                {step === 'results' && renderResults()}
            </div>

            {/* Progress Bar */}
            {step !== 'results' && step !== 'loading' && (
                <div className="fixed bottom-0 left-0 w-full h-1 bg-white/10">
                    <div
                        className="h-full bg-[#D4AF37] transition-all duration-500"
                        style={{ width: `${(['gender', 'age', 'goal', 'level', 'equipment', 'muscle'].indexOf(step) + 1) * 16.6}%` }}
                    />
                </div>
            )}
        </div>
    );
}

function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}
