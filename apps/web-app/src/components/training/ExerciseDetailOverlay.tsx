'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Activity, Info, Zap } from 'lucide-react';
import { ExerciseDef } from '@/lib/exercise-db';
import { Button } from '@/components/ui/button';
import { MuscleAnatomy } from './MuscleAnatomy';

interface ExerciseDetailOverlayProps {
    exercise: ExerciseDef | null;
    onClose: () => void;
    onAddToProgram?: (ex: ExerciseDef) => void;
}

export function ExerciseDetailOverlay({ exercise, onClose, onAddToProgram }: ExerciseDetailOverlayProps) {
    if (!exercise) return null;

    return (
        <AnimatePresence>
            {exercise && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto z-[210] w-[95%] max-w-lg h-fit max-h-[85vh] bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header Visual -> HUGE MEDICAL ANATOMY VIEW */}
                        <div className="h-[500px] bg-white relative flex items-center justify-center overflow-hidden border-b border-slate-100">

                            {/* THE VISUAL RENDER - SCALED UP */}
                            <div className="absolute inset-0 z-10 p-0 flex items-center justify-center">
                                {exercise.gifUrl ? (
                                    <img
                                        src={exercise.gifUrl}
                                        alt={exercise.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <MuscleAnatomy target={exercise.muscle} subTarget={exercise.subTarget} className="scale-125 origin-center" />
                                )}
                            </div>

                            {/* Close Button - Floating Cleanly */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-20 shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Badge - Floating Cleanly */}
                            <div className="absolute bottom-6 right-6 z-20">
                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${exercise.difficulty === 'Avancé' ? 'bg-red-100 text-red-600' :
                                    exercise.difficulty === 'Intermédiaire' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {exercise.difficulty}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none mb-2">{exercise.name}</h2>
                                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-slate-500">
                                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {exercise.mechanic}</span>
                                    <span>•</span>
                                    <span>{exercise.force}</span>
                                    <span>•</span>
                                    <span>{exercise.equipment}</span>
                                </div>
                            </div>

                            {/* Anatomy Focus Text */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="pt-1"><Info className="w-5 h-5 text-[#D4AF37]" /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase">Cible Anatomique</h3>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Muscle Principal : <span className="font-bold text-slate-900">{exercise.muscle}</span>
                                        </p>
                                        <p className="text-sm text-[#D4AF37] font-bold mt-1.5 flex items-center gap-2">
                                            <Zap className="w-3 h-3 fill-current" /> Focus : {exercise.subTarget}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Exécution</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {exercise.instructions || "Aucune instruction spécifique. Concentrez-vous sur la technique et le ressenti musculaire."}
                                </p>
                            </div>

                            {/* Action Button */}
                            {onAddToProgram && (
                                <Button
                                    onClick={() => { onAddToProgram(exercise); onClose(); }}
                                    className="w-full mt-4 h-14 bg-[#D4AF37] hover:bg-[#B8860B] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-[#D4AF37]/20"
                                >
                                    Ajouter au Programme (+ Set)
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
