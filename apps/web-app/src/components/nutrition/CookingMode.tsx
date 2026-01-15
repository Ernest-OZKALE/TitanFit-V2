'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '@/types/nutrition';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export function CookingMode({ recipe, onClose }: { recipe: Recipe, onClose: () => void }) {
    const [step, setStep] = useState(0);
    // Mock steps if empty
    const steps = recipe.instructions.length > 0 ? recipe.instructions : [
        "Préparez tous vos ingrédients sur le plan de travail.",
        "Faites chauffer une poêle à feu moyen avec un filet d'huile.",
        "Saisissez la protéine 3-4 minutes de chaque côté.",
        "Dressez l'assiette avec la garniture et servez chaud."
    ];

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 bg-slate-900 z-[100] flex flex-col text-white"
        >
            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X className="h-6 w-6" />
                </button>
                <div className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Mode Cuisine</div>
                <div className="w-10" />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="max-w-xl"
                    >
                        <span className="block text-9xl font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none -z-10">
                            {step + 1}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                            {steps[step]}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="px-8 pb-12 pt-8 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <button
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="p-4 rounded-full border border-white/20 disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    {step === steps.length - 1 ? (
                        <button
                            onClick={onClose}
                            className="bg-[#D4AF37] text-slate-900 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <CheckCircle className="h-6 w-6" /> Terminer
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                            className="p-4 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
