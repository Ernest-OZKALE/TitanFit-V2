'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Zap, Calendar, Dumbbell, ShieldCheck, Plus, Search, BookOpen, LayoutGrid, PenTool, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ActiveSessionOverlay } from '@/components/training/ActiveSessionOverlay';
import { getRecommendedWorkout, Workout, TITAN_PROGRAM } from '@/lib/workouts';
import { ExerciseLibrary } from '@/components/training/ExerciseLibrary';
import { ProgramBuilder } from '@/components/training/ProgramBuilder';
import { PROGRAM_DETAILS } from '@/lib/program-details';
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { EXERCISE_DB } from '@/lib/exercise-db';
import { EspritTitanIntegrated } from '@/components/ai-coach';

export default function TrainingPage() {
    const router = useRouter();
    const [view, setView] = useState<'protocol' | 'library' | 'builder' | 'esprit'>('protocol');
    const [trainingMode, setTrainingMode] = useState<'gym' | 'home'>('gym');
    const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
    const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
    const [customPrograms, setCustomPrograms] = useState<Workout[]>([]);

    useEffect(() => {
        // Load Recommended
        setTodayWorkout(getRecommendedWorkout());
        // Load Customs
        const stored = localStorage.getItem('titan_custom_programs');
        if (stored) setCustomPrograms(JSON.parse(stored));
    }, []);

    // Fonction pour adapter le workout au mode (Salle vs Maison)
    const getAdaptedWorkout = (workout: Workout) => {
        if (trainingMode === 'gym') return workout;

        // Clone et remplace les exos
        const adaptedExercises = workout.exercises.map(ex => {
            const dbEx = EXERCISE_DB.find(e => e.id === ex.id);
            const alt = dbEx?.alternatives?.find(a => a.type === 'home');

            if (alt) {
                const altDef = EXERCISE_DB.find(e => e.id === alt.id);
                if (altDef) {
                    return { ...ex, id: alt.id, name: altDef.name }; // Garde sets/reps originaux mais change l'exo
                }
            }
            return ex;
        });

        return { ...workout, exercises: adaptedExercises };
    };

    const handleStartWorkout = (workout: Workout) => {
        setActiveWorkout(getAdaptedWorkout(workout));
    };

    const handleSaveCustom = (newWorkout: Workout) => {
        const updated = [...customPrograms, newWorkout];
        setCustomPrograms(updated);
        localStorage.setItem('titan_custom_programs', JSON.stringify(updated));
        setView('protocol'); // Return to main view
    };

    if (!todayWorkout) return null;

    return (
        <div className="pb-32 relative max-w-5xl mx-auto">
            {/* MAIN HEADER & MODE TOGGLE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-8 px-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                        TITAN <span className="text-[#D4AF37]">TRAINING</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                        Biblio & Programmes • Mode {trainingMode === 'gym' ? 'Salle' : 'Maison'}
                    </p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
                    <button
                        onClick={() => setTrainingMode('gym')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${trainingMode === 'gym' ? 'bg-slate-900 text-[#D4AF37] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Salle
                    </button>
                    <button
                        onClick={() => setTrainingMode('home')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${trainingMode === 'home' ? 'bg-slate-900 text-[#D4AF37] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Maison
                    </button>
                </div>
            </div>

            {/* TABS HEADER */}

            <div className="flex items-center justify-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-100 w-fit mx-auto shadow-sm">
                <TabButton active={view === 'protocol'} onClick={() => setView('protocol')} icon={LayoutGrid} label="Protocole" />
                <TabButton active={view === 'library'} onClick={() => setView('library')} icon={BookOpen} label="Bibliothèque" />
                <TabButton active={view === 'builder'} onClick={() => setView('builder')} icon={PenTool} label="Créateur" />
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                    onClick={() => setView('esprit')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'esprit'
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952B] text-white shadow-lg shadow-[#D4AF37]/30'
                            : 'bg-gradient-to-r from-[#D4AF37]/80 to-[#B8952B]/80 text-white shadow-md shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105'
                        }`}
                >
                    <Brain className="w-4 h-4" />
                    <span className="hidden md:inline">L'Esprit Titan</span>
                </button>
            </div>

            <AnimatePresence mode='wait'>
                {view === 'protocol' && (
                    <motion.div
                        key="protocol"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                    >
                        {/* TODAY'S HERO */}
                        <div
                            onClick={() => handleStartWorkout(todayWorkout)}
                            className="group relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl shadow-slate-900/20"
                        >
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&q=80&w=2074')" }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#D4AF37] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#D4AF37]/30">
                                    Recommandé Aujourd'hui
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none mb-4">{todayWorkout.title}</h1>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                                        <Clock className="w-4 h-4 text-[#D4AF37]" /> {todayWorkout.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                                        <Zap className="w-4 h-4 text-[#D4AF37]" /> {todayWorkout.intensity}
                                    </div>

                                    <button className="ml-auto px-8 py-3 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center gap-2">
                                        <Play className="w-4 h-4 fill-current" /> GO
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CUSTOM PROGRAMS SECTION */}
                        {customPrograms.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Vos Créations</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {customPrograms.map(prog => (
                                        <div key={prog.id} onClick={() => handleStartWorkout(prog)} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#D4AF37] cursor-pointer group shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                                                    <PenTool className="w-5 h-5" />
                                                </div>
                                                <div className="px-3 py-1 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500">{prog.type}</div>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 uppercase">{prog.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium mb-4">{prog.exercises.length} Exercices • {prog.duration}</p>
                                            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest group-hover:underline">Lancer</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STANDARD LIBRARY SECTION (Categorized) */}
                        <div className="space-y-16">
                            {/* CATEGORY 1: PPL */}
                            <section>
                                <CategoryHeader detail={PROGRAM_DETAILS['ppl']} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    {TITAN_PROGRAM.filter(p => p.id.includes('push-a') || p.id.includes('pull-a') || p.id.includes('legs-a')).map((prog, i) => (
                                        <ProgramCard key={prog.id} prog={prog} index={i} onClick={() => handleStartWorkout(prog)} />
                                    ))}
                                </div>
                            </section>

                            {/* CATEGORY 2: ARNOLD */}
                            <section>
                                <CategoryHeader detail={PROGRAM_DETAILS['arnold']} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {TITAN_PROGRAM.filter(p => p.id.includes('arnold')).map((prog, i) => (
                                        <ProgramCard key={prog.id} prog={prog} index={i} onClick={() => handleStartWorkout(prog)} />
                                    ))}
                                </div>
                            </section>

                            {/* CATEGORY 3: ATHLÉTIQUE & FULL BODY */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <section>
                                    <CategoryHeader detail={PROGRAM_DETAILS['upper_lower']} />
                                    <div className="space-y-4 mt-6">
                                        {TITAN_PROGRAM.filter(p => p.id.includes('ul-')).map((prog, i) => (
                                            <ProgramCard key={prog.id} prog={prog} index={i} onClick={() => handleStartWorkout(prog)} compact />
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <CategoryHeader detail={PROGRAM_DETAILS['full_body']} />
                                    <div className="space-y-4 mt-6">
                                        {TITAN_PROGRAM.filter(p => p.id.includes('fb-') || p.id.includes('hiit')).map((prog, i) => (
                                            <ProgramCard key={prog.id} prog={prog} index={i} onClick={() => handleStartWorkout(prog)} compact />
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'library' && (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/5 min-h-[600px]">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-2">Giga Bibliothèque</h2>
                                <p className="text-slate-500">Plus de 500 variations d'exercices pour construire votre légende.</p>
                            </div>
                            <ExerciseLibrary />
                        </div>
                    </motion.div>
                )}

                {view === 'builder' && (
                    <motion.div
                        key="builder"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <ProgramBuilder onSave={handleSaveCustom} onCancel={() => setView('protocol')} />
                    </motion.div>
                )}

                {view === 'esprit' && (
                    <motion.div
                        key="esprit"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <EspritTitanIntegrated />
                    </motion.div>
                )}
            </AnimatePresence>

            {activeWorkout && (
                <ActiveSessionOverlay
                    isOpen={!!activeWorkout}
                    workout={activeWorkout}
                    onClose={() => setActiveWorkout(null)}
                />
            )}
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{label}</span>
        </button>
    );
}

function ProgramCard({ prog, index, onClick, compact }: any) {
    return (
        <div onClick={onClick} className={`bg-white rounded-3xl border border-slate-100 hover:border-[#D4AF37] cursor-pointer group hover:shadow-lg transition-all ${compact ? 'p-4 flex items-center gap-4' : 'p-6'}`}>
            {!compact && (
                <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl font-black text-slate-100 group-hover:text-[#D4AF37]/20 transition-colors">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <Play className="w-8 h-8 text-slate-200 group-hover:text-[#D4AF37] fill-current transition-colors" />
                </div>
            )}

            <div className="flex-1">
                <h4 className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-slate-900 uppercase italic leading-tight mb-2`}>{prog.title}</h4>
                <div className="flex gap-2">
                    {prog.muscles.slice(0, 2).map((m: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">{m}</span>
                    ))}
                    <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {prog.duration}
                    </span>
                </div>
            </div>

            {compact && (
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
            )}
        </div>
    );
}

function CategoryHeader({ detail }: { detail: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 cursor-pointer group select-none"
            >
                <div className={`w-1 h-8 rounded-full bg-current ${detail.iconColor.replace('text-', 'bg-')}`} />
                <h3 className="text-xl font-black text-slate-900 uppercase italic">{detail.title}</h3>
                <div className={`p-1 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pl-5 pt-4 pb-2">
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed max-w-2xl">{detail.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3" /> Avantages
                                    </h4>
                                    <ul className="space-y-1">
                                        {detail.pros.map((pro: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-500 font-medium">• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" /> Inconvénients
                                    </h4>
                                    <ul className="space-y-1">
                                        {detail.cons.map((con: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-500 font-medium">• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="inline-block px-3 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                                Cible : {detail.target}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
