'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, ArrowLeft, Dumbbell, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseLibrary } from './ExerciseLibrary';
import { EXERCISE_DB } from '@/lib/exercise-db';
import { Workout } from '@/lib/workouts';

interface ProgramBuilderProps {
    onSave: (workout: Workout) => void;
    onCancel: () => void;
}

export function ProgramBuilder({ onSave, onCancel }: ProgramBuilderProps) {
    const [step, setStep] = useState<'details' | 'selection'>('details');
    const [title, setTitle] = useState('');
    const [type, setType] = useState<any>('fullbody');
    const [selectedExercises, setSelectedExercises] = useState<{ id: string, sets: number, reps: string }[]>([]);

    const handleAddExercise = (exId: string) => {
        setSelectedExercises(prev => [...prev, { id: exId, sets: 3, reps: '10-12' }]);
    };

    const handleRemoveExercise = (index: number) => {
        setSelectedExercises(prev => prev.filter((_, i) => i !== index));
    };

    const handleFinish = () => {
        if (!title || selectedExercises.length === 0) return;

        // Hydrate full exercise objects
        const fullExercises = selectedExercises.map(sel => {
            const def = EXERCISE_DB.find(e => e.id === sel.id)!;
            return {
                id: def.id,
                name: def.name,
                sets: sel.sets,
                reps: sel.reps,
                rest: 60, // Default
                notes: ''
            };
        });

        const newWorkout: Workout = {
            id: `custom-${Date.now()}`,
            title,
            type,
            duration: `${selectedExercises.length * 5 + 10} min`, // Est. duration
            intensity: 'Moyenne',
            muscles: Array.from(new Set(fullExercises.map(e => EXERCISE_DB.find(db => db.id === e.id)?.muscle || 'Corps'))),
            exercises: fullExercises
        };

        onSave(newWorkout);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
            {/* HEADER */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900 uppercase italic">Créateur de Programme</h2>
                </div>
                {selectedExercises.length > 0 && (
                    <div className="px-3 py-1 bg-[#D4AF37] text-white text-xs font-bold rounded-full">
                        {selectedExercises.length} Exos
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* LEFT PANEL: BUILDER FORM */}
                <div className="w-1/3 border-r border-slate-100 p-6 overflow-y-auto bg-slate-50/50">
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom du Programme</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Pecs Destruction"
                            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-[#D4AF37] outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 font-medium text-slate-600 focus:border-[#D4AF37] outline-none bg-white"
                        >
                            <option value="fullbody">Full Body</option>
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="legs">Legs</option>
                            <option value="cardio">Cardio</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        {selectedExercises.map((sel, i) => {
                            const def = EXERCISE_DB.find(e => e.id === sel.id);
                            return (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm text-slate-900 truncate max-w-[120px]">{def?.name}</div>
                                        <button onClick={() => handleRemoveExercise(i)} className="text-slate-300 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <input
                                            value={sel.sets}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                const newExs = [...selectedExercises];
                                                newExs[i].sets = val;
                                                setSelectedExercises(newExs);
                                            }}
                                            className="w-10 bg-slate-50 border rounded p-1 text-center"
                                        />
                                        <span className="flex items-center text-slate-400">Sets</span>
                                        <input
                                            value={sel.reps}
                                            onChange={(e) => {
                                                const newExs = [...selectedExercises];
                                                newExs[i].reps = e.target.value;
                                                setSelectedExercises(newExs);
                                            }}
                                            className="w-14 bg-slate-50 border rounded p-1 text-center"
                                        />
                                        <span className="flex items-center text-slate-400">Reps</span>
                                    </div>
                                </div>
                            );
                        })}
                        {selectedExercises.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                                Ajoutez des exercices depuis la bibliothèque à droite.
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleFinish}
                        disabled={!title || selectedExercises.length === 0}
                        className="w-full mt-6 bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold"
                    >
                        <Save className="w-4 h-4 mr-2" /> Créer le Programme
                    </Button>
                </div>

                {/* RIGHT PANEL: EXERCISE PICKER */}
                <div className="w-2/3 p-6 bg-white overflow-hidden flex flex-col">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Bibliothèque (500+ Exos)</h3>
                    <div className="flex-1 overflow-hidden">
                        <ExerciseLibrary selectionMode onSelect={handleAddExercise} />
                    </div>
                </div>
            </div>
        </div>
    );
}
