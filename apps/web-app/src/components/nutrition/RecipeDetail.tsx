'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, ChefHat, Users, ArrowRight, Check } from 'lucide-react';
import { RecipeFull } from '@/lib/recipe-database';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface RecipeDetailProps {
    recipe: RecipeFull | null;
    onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!recipe || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            {recipe && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9990]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-10 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white rounded-[2.5rem] z-[9999] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header Image Area */}
                        <div className={`h-48 relative flex-shrink-0 flex items-center justify-center ${recipe.category === 'breakfast' ? 'bg-orange-100 text-orange-500' :
                            recipe.category === 'lunch' ? 'bg-blue-100 text-blue-500' :
                                recipe.category === 'dinner' ? 'bg-indigo-100 text-indigo-500' :
                                    'bg-green-100 text-green-500'
                            }`}>
                            <ChefHat className="w-20 h-20 opacity-20" />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide shadow-sm">
                                        {recipe.category}
                                    </span>
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide shadow-sm">
                                        {recipe.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase italic">
                                {recipe.name}
                            </h2>
                            <p className="text-slate-500 font-medium mb-6">
                                {recipe.description}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-[#FF4D00] flex justify-center mb-1"><Flame className="w-5 h-5" /></div>
                                    <div className="font-black text-slate-900 text-lg">{recipe.macros.calories}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Calories</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-slate-900 flex justify-center mb-1"><Clock className="w-5 h-5" /></div>
                                    <div className="font-black text-slate-900 text-lg">{recipe.prepTime + recipe.cookTime}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Minutes</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-slate-900 flex justify-center mb-1"><Users className="w-5 h-5" /></div>
                                    <div className="font-black text-slate-900 text-lg">{recipe.servings}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Pers.</div>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-[#FF4D00] rounded-full" />
                                    Ingrédients
                                </h3>
                                <ul className="space-y-3">
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-slate-900">{ing.quantity} {ing.unit}</span>{' '}
                                                <span className="text-slate-600 font-medium">{ing.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-slate-900 rounded-full" />
                                    Préparation
                                </h3>
                                <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 ml-2">
                                    {recipe.instructions.map((step, i) => (
                                        <div key={i} className="relative">
                                            <span className="absolute -left-[21px] top-0 w-8 h-8 rounded-full bg-white border-4 border-slate-50 text-xs font-black flex items-center justify-center text-slate-300">
                                                {i + 1}
                                            </span>
                                            <p className="text-slate-600 font-medium leading-relaxed pl-4">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA Footer */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-[#FF4D00] text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF4D00]/30 hover:bg-[#E04400] transition-colors flex items-center justify-center gap-2"
                            >
                                J'ai cuisiné ça <Check className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
