'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Timer, RotateCcw, ChevronRight, Trophy, Play, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workout, Exercise } from '@/lib/workouts';
import { EXERCISE_DB } from '@/lib/exercise-db';
import confetti from 'canvas-confetti';

interface ActiveSessionProps {
    isOpen: boolean;
    workout: Workout;
    onClose: () => void;
}

export function ActiveSessionOverlay({ isOpen, workout, onClose }: ActiveSessionProps) {
    const [elapsed, setElapsed] = useState(0);
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
    const [sessionData, setSessionData] = useState<Record<string, any>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [showGif, setShowGif] = useState(false);

    // Timer Global
    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    // Sauvegarde automatique temporaire
    useEffect(() => {
        if (Object.keys(sessionData).length > 0) {
            localStorage.setItem('titan_current_session_temp', JSON.stringify(sessionData));
        }
    }, [sessionData]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSetComplete = (exId: string, setIndex: number, weight: string, reps: string) => {
        setSessionData(prev => ({
            ...prev,
            [`${exId}-${setIndex}`]: { weight, reps, completed: true }
        }));
    };

    const finishWorkout = () => {
        setIsFinished(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#ffffff']
        });

        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('titan_last_workout', today);
        localStorage.setItem('titan_last_workout_id', workout.id);
        localStorage.removeItem('titan_current_session_temp');
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
            onClose();
            setIsFinished(false);
            setElapsed(0);
            setActiveExerciseIndex(0);
            setSessionData({});
        }, 3000);
    };

    if (!isOpen || !workout) return null;

    // Enrichir l'exercice avec les données de la DB
    const exerciseDef = EXERCISE_DB.find(e => e.id === workout.exercises[activeExerciseIndex].id);
    const currentExercise = {
        ...workout.exercises[activeExerciseIndex],
        muscle: exerciseDef?.muscle || 'Global',
        gifUrl: exerciseDef?.gifUrl,
        instructions: exerciseDef?.instructions
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col font-sans"
                >
                    {/* Header HUD */}
                    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Session Active
                                </h2>
                                <h1 className="text-sm md:text-base font-bold text-white tracking-tight">{workout.title}</h1>
                            </div>
                        </div>
                        <div className="font-mono font-bold text-[#D4AF37] tabular-nums text-lg tracking-wider">
                            {formatTime(elapsed)}
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                        {isFinished ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                >
                                    <Trophy className="w-24 h-24 text-[#D4AF37] mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" />
                                </motion.div>
                                <h2 className="text-4xl font-black text-white uppercase italic mb-4 tracking-tighter">Séance Terminée</h2>
                                <p className="text-slate-400 max-w-sm leading-relaxed">
                                    Encore une victoire. Repos mérité, Titan.
                                </p>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto p-4 md:p-8 pb-32">
                                {/* Tabs */}
                                <div className="flex flex-wrap gap-2 pb-8">
                                    {workout.exercises.map((ex, i) => (
                                        <button
                                            key={ex.id}
                                            onClick={() => { setActiveExerciseIndex(i); setShowGif(false); }}
                                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${i === activeExerciseIndex
                                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                                }`}
                                        >
                                            {i + 1}. {ex.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Exercise Header + GIF Player */}
                                <div className="mb-10 relative">
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                                            {currentExercise.name}
                                        </h3>
                                        {currentExercise.gifUrl && (
                                            <button
                                                onClick={() => setShowGif(!showGif)}
                                                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors border px-3 py-1.5 rounded-full ${showGif ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-white'}`}
                                            >
                                                {showGif ? <X className="w-3 h-3" /> : <Play className="w-3 h-3" />} {showGif ? 'Fermer' : 'Voir Demo'}
                                            </button>
                                        )}
                                    </div>

                                    {/* GIF PLAYER */}
                                    <AnimatePresence mode='wait'>
                                        {showGif && currentExercise.gifUrl && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl"
                                            >
                                                <img
                                                    src={currentExercise.gifUrl}
                                                    alt={currentExercise.name}
                                                    className="w-full h-auto object-contain max-h-[300px]"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                            {currentExercise.muscle}
                                        </span>
                                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">
                                            {currentExercise.sets} Séries
                                        </span>
                                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">
                                            {currentExercise.reps} Reps
                                        </span>
                                    </div>

                                    {currentExercise.notes && (
                                        <div className="mt-4 flex gap-3 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-xs text-[#D4AF37]/80 leading-relaxed">
                                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            {currentExercise.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Logbook */}
                                <div className="space-y-2">
                                    <div className="grid grid-cols-[40px_1fr_80px_80px_50px] gap-4 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-4">
                                        <div className="text-center">Set</div>
                                        <div>Précédent</div>
                                        <div className="text-center">Kg</div>
                                        <div className="text-center">Reps</div>
                                        <div className="text-center">Valid</div>
                                    </div>

                                    {Array.from({ length: currentExercise.sets }).map((_, i) => (
                                        <SetRow
                                            key={i}
                                            setNumber={i + 1}
                                            prevLog="-"
                                            onComplete={(w, r) => handleSetComplete(currentExercise.id, i, w, r)}
                                            isCompleted={sessionData[`${currentExercise.id}-${i}`]?.completed}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {!isFinished && (
                        <div className="p-6 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent sticky bottom-0 z-50">
                            <div className="flex justify-between items-center max-w-2xl mx-auto">
                                <Button
                                    variant="ghost"
                                    disabled={activeExerciseIndex === 0}
                                    onClick={() => setActiveExerciseIndex(i => i - 1)}
                                    className="text-slate-500 hover:text-white hover:bg-white/5"
                                >
                                    Précédent
                                </Button>

                                {activeExerciseIndex < workout.exercises.length - 1 ? (
                                    <Button
                                        onClick={() => setActiveExerciseIndex(i => i + 1)}
                                        className="h-12 px-8 bg-white text-black hover:bg-slate-200 rounded-xl font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
                                    >
                                        Suivant <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={finishWorkout}
                                        className="h-12 px-8 bg-[#D4AF37] text-black hover:bg-[#B5952F] rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Terminer
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SetRow({ setNumber, prevLog, onComplete, isCompleted }: { setNumber: number, prevLog: string, onComplete: (w: string, r: string) => void, isCompleted?: boolean }) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [done, setDone] = useState(isCompleted || false);

    const handleCheck = () => {
        if (!weight || !reps) return;
        setDone(true);
        onComplete(weight, reps);
    };

    return (
        <div className={`grid grid-cols-[40px_1fr_80px_80px_50px] gap-4 items-center px-4 py-3 rounded-lg transition-all ${done ? 'bg-[#D4AF37]/5' : 'hover:bg-white/5'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${done ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-slate-500'}`}>
                {setNumber}
            </div>
            <div className="text-xs text-slate-500 font-mono">{prevLog}</div>
            <div className="relative">
                <input
                    type="number"
                    placeholder="-"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={done}
                    className={`w-full bg-transparent text-center font-bold text-lg outline-none transition-all placeholder:text-slate-700 ${done ? 'text-[#D4AF37]' : 'text-white border-b border-white/20 focus:border-[#D4AF37]'
                        }`}
                />
            </div>
            <div className="relative">
                <input
                    type="number"
                    placeholder="-"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    disabled={done}
                    className={`w-full bg-transparent text-center font-bold text-lg outline-none transition-all placeholder:text-slate-700 ${done ? 'text-[#D4AF37]' : 'text-white border-b border-white/20 focus:border-[#D4AF37]'
                        }`}
                />
            </div>
            <button
                onClick={handleCheck}
                disabled={done}
                className={`w-full h-8 flex items-center justify-center rounded-md transition-all ${done
                    ? 'text-[#D4AF37]'
                    : 'bg-white/10 text-slate-400 hover:bg-[#D4AF37] hover:text-black'
                    }`}
            >
                {done ? <Check className="w-5 h-5" /> : <Check className="w-4 h-4" />}
            </button>
        </div>
    );
}
