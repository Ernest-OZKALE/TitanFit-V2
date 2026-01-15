'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Refrigerator, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestIngredients, findRecipesByIngredients } from '@/lib/ingredient-matcher';
import { ALL_RECIPES } from '@/lib/recipes/index';
import { Ingredient } from '@/lib/recipe-database';

export function FridgeEngine() {
    const [inputValue, setInputValue] = useState('');
    const [myIngredients, setMyIngredients] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [results, setResults] = useState<ReturnType<typeof findRecipesByIngredients>>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Load fridge ingredients from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('titan_fridge_ingredients');
        if (stored) {
            setMyIngredients(JSON.parse(stored));
        }
    }, []);

    // Save fridge ingredients to localStorage
    useEffect(() => {
        localStorage.setItem('titan_fridge_ingredients', JSON.stringify(myIngredients));
    }, [myIngredients]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (val.length >= 2) {
            setSuggestions(suggestIngredients(val));
        } else {
            setSuggestions([]);
        }
    };

    const addIngredient = (name: string) => {
        if (!myIngredients.includes(name)) {
            setMyIngredients([...myIngredients, name]);
        }
        setInputValue('');
        setSuggestions([]);
    };

    const removeIngredient = (name: string) => {
        setMyIngredients(myIngredients.filter(i => i !== name));
    };

    const handleGenerate = () => {
        setHasSearched(true);
        const matches = findRecipesByIngredients(myIngredients, ALL_RECIPES);
        setResults(matches);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* INPUT SECTION */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-visible z-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Refrigerator className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">QU'AVEZ-VOUS EN STOCK ?</h2>
                        <p className="text-xs text-slate-500 font-medium">Ajoutez vos ingrédients, le Titan cuisine.</p>
                    </div>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputValue) {
                                addIngredient(inputValue);
                            }
                        }}
                        placeholder="Ex: Poulet, riz, œufs..."
                        className="w-full h-12 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                    />
                    <button
                        onClick={() => inputValue && addIngredient(inputValue)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    {/* SUGGESTIONS RECOMMANDÉES */}
                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50">
                            {suggestions.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => addIngredient(s)}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0"
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ACTIVE INGREDIENTS LIST */}
                <div className="flex flex-wrap gap-2 min-h-[3rem]">
                    {myIngredients.length === 0 && (
                        <p className="text-sm text-slate-400 italic w-full text-center py-2">Votre frigo est vide pour le moment...</p>
                    )}
                    <AnimatePresence>
                        {myIngredients.map((ing) => (
                            <motion.div
                                key={ing}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 group"
                            >
                                {ing}
                                <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* GENERATE BUTTON */}
                <button
                    onClick={handleGenerate}
                    disabled={myIngredients.length === 0}
                    className={`w-full h-14 mt-6 rounded-2xl flex items-center justify-center gap-2 font-black text-lg tracking-wide shadow-lg transition-all ${myIngredients.length > 0
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/25'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                >
                    <Sparkles className="w-5 h-5" />
                    GÉNÉRER DES RECETTES
                </button>
            </div>

            {/* RESULTS SECTION */}
            {hasSearched && (
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 px-1">
                        RÉSULTATS <span className="text-slate-400 text-sm font-medium">({results.length})</span>
                    </h3>

                    {results.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <ChefHat className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500 font-medium">Aucune recette ne correspond assez.<br />Essayez d'ajouter des œufs, du riz ou du poulet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {results.map(({ recipe, score, missingIngredients }) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={recipe.id}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4"
                                >
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-slate-400 font-bold border border-slate-200">
                                        <span className={`text-xl ${score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-orange-500'}`}>
                                            {score}%
                                        </span>
                                        <span className="text-[9px] uppercase">Match</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{recipe.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">{recipe.description}</p>

                                        {/* MISSING INGREDIENTS */}
                                        {missingIngredients.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                <span className="text-[10px] uppercase font-bold text-red-400 mr-1 pt-0.5">Manque:</span>
                                                {missingIngredients.slice(0, 3).map((ing, idx) => (
                                                    <span key={idx} className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-medium border border-red-100">
                                                        {ing.name}
                                                    </span>
                                                ))}
                                                {missingIngredients.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 pt-0.5">+{missingIngredients.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        {missingIngredients.length === 0 && (
                                            <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg inline-block border border-green-100">
                                                Vous avez tout ! 🚀
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
