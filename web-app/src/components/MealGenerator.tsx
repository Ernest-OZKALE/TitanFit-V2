'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ChefHat, Clock, Flame, Zap, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock database (Advanced)
const MEAL_DATABASE = [
    { id: 1, name: "Bowl Poulet Quinoa Supreme", calories: 450, protein: 35, carbs: 40, fat: 12, time: "15 min", type: "Repas", tags: ["Poulet", "Quinoa"], image: "🥗" },
    { id: 2, name: "Omelette Titan Avocat", calories: 380, protein: 22, carbs: 8, fat: 28, time: "10 min", type: "Repas", tags: ["Oeuf", "Avocat"], image: "🍳" },
    { id: 3, name: "Pancakes Protéinés Banane", calories: 320, protein: 25, carbs: 45, fat: 8, time: "15 min", type: "Collation", tags: ["Banane", "Oeuf"], image: "🥞" },
    { id: 4, name: "Smoothie Vert Atomique", calories: 180, protein: 15, carbs: 20, fat: 2, time: "3 min", type: "Boisson", tags: ["Épinard", "Pomme"], image: "🥤" },
    { id: 5, name: "Steak & Patate Douce Or", calories: 550, protein: 45, carbs: 50, fat: 18, time: "20 min", type: "Repas", tags: ["Boeuf", "Patate Douce"], image: "🥩" },
    { id: 6, name: "Skyr Fruits Rouges", calories: 150, protein: 18, carbs: 12, fat: 0, time: "2 min", type: "Collation", tags: ["Skyr", "Fruits"], image: "🥣" },
];

const INTENTIONS = [
    { id: 'muscle', label: 'Prise de Masse', icon: '💪', desc: 'Max Protéines' },
    { id: 'energy', label: 'Boost Énergie', icon: '⚡', desc: 'Avant-Sport' },
    { id: 'light', label: 'Léger & Fit', icon: '🍃', desc: 'Faible Calorie' },
    { id: 'cheat', label: 'Plaisir', icon: '🍔', desc: 'Récompense' },
];

const INGREDIENTS_SUGGESTIONS = ["Poulet", "Oeuf", "Avocat", "Riz", "Avoine", "Thon", "Banane", "Patate Douce"];

export default function MealGenerator() {
    const [step, setStep] = useState(0); // 0: Intention, 1: Context, 2: Result
    const [intention, setIntention] = useState<string | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [generatedMeal, setGeneratedMeal] = useState<typeof MEAL_DATABASE[0] | null>(null);
    const [loading, setLoading] = useState(false);

    const toggleIngredient = (ing: string) => {
        if (selectedIngredients.includes(ing)) {
            setSelectedIngredients(prev => prev.filter(i => i !== ing));
        } else {
            setSelectedIngredients(prev => [...prev, ing]);
        }
    };

    const handleGenerate = () => {
        setLoading(true);
        // Simulate advanced AI thinking
        setTimeout(() => {
            // Logic: Filter by ingredients if any selected, else random
            let pool = MEAL_DATABASE;
            if (selectedIngredients.length > 0) {
                const matches = MEAL_DATABASE.filter(m =>
                    m.tags.some(tag => selectedIngredients.includes(tag))
                );
                if (matches.length > 0) pool = matches;
            }

            // In a real app, intention would filter macros
            const random = pool[Math.floor(Math.random() * pool.length)];
            setGeneratedMeal(random);
            setStep(2);
            setLoading(false);
        }, 1200);
    };

    const resetWizard = () => {
        setStep(0);
        setIntention(null);
        setSelectedIngredients([]);
        setGeneratedMeal(null);
    };

    return (
        <Card className="border border-white/10 bg-black/40 backdrop-blur-2xl text-white overflow-hidden relative shadow-2xl group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />

            <CardHeader className="border-b border-white/5 bg-white/5 relative z-10">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <ChefHat className="h-8 w-8 text-[#D4AF37]" />
                    </motion.div>
                    Gainer<span className="text-[#D4AF37]">Lab</span>
                    <span className="text-[10px] ml-auto px-2 py-1 rounded bg-white/10 text-gray-400 font-normal tracking-wide">
                        V2.0
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    {/* STEP 0: INTENTION */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full"
                        >
                            <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">
                                Quelle est votre cible ?
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {INTENTIONS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setIntention(item.id)}
                                        className={`p-4 rounded-xl border transition-all text-left group/btn relative overflow-hidden ${intention === item.id
                                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_-5px_#D4AF37]'
                                                : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                                            }`}
                                    >
                                        <span className="text-2xl mb-2 block">{item.icon}</span>
                                        <span className="font-black uppercase text-sm block">{item.label}</span>
                                        <span className={`text-[10px] font-bold ${intention === item.id ? 'text-black/70' : 'text-gray-500'}`}>
                                            {item.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-auto">
                                <button
                                    onClick={() => setStep(intention ? 1 : 0)}
                                    disabled={!intention}
                                    className="w-full h-12 flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white"
                                >
                                    Suivant <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: CONTEXT (INGREDIENTS) */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full"
                        >
                            <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">
                                Ingrédients disponibles ?
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {INGREDIENTS_SUGGESTIONS.map((ing) => (
                                    <button
                                        key={ing}
                                        onClick={() => toggleIngredient(ing)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${selectedIngredients.includes(ing)
                                                ? 'bg-white text-black border-white'
                                                : 'bg-black/20 text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        {selectedIngredients.includes(ing) && <Check className="w-3 h-3" />}
                                        {ing}
                                    </button>
                                ))}
                            </div>

                            {loading ? (
                                <div className="mt-auto flex flex-col items-center justify-center h-24 gap-3">
                                    <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
                                    <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] animate-pulse">
                                        Analyse Neurale...
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="h-12 flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 font-bold uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        className="h-12 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F4CF57] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_-5px_#D4AF37]"
                                    >
                                        Générer <Zap className="w-4 h-4 fill-black" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: RESULT */}
                    {step === 2 && generatedMeal && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col h-full bg-black/20 -m-2 p-4 rounded-xl border border-white/5"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-6xl drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                    {generatedMeal.image}
                                </span>
                                <div className="flex flex-col items-end gap-1">
                                    <button onClick={handleGenerate} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <RefreshCw className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-white leading-none mb-1">
                                {generatedMeal.name}
                            </h2>
                            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                {generatedMeal.type} Optimisé
                            </p>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Calories</p>
                                    <p className="text-sm font-black text-white">{generatedMeal.calories}</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Protéines</p>
                                    <p className="text-sm font-black text-[#D4AF37]">{generatedMeal.protein}g</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Temps</p>
                                    <p className="text-sm font-black text-white">{generatedMeal.time}</p>
                                </div>
                            </div>

                            <button
                                onClick={resetWizard}
                                className="mt-auto w-full h-10 bg-white/10 hover:bg-white hover:text-black text-white font-bold uppercase text-xs tracking-widest rounded-lg transition-all"
                            >
                                Terminer
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            {/* Step Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step + 1) / 3) * 100}%` }}
                />
            </div>
        </Card>
    );
}
