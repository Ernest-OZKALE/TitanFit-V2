"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ChefHat, Plus, X } from "lucide-react";
import { GlassCard, GoldButton } from "@/components/ui/premium-components";

// Mock Recipes
const MOCK_RECIPES = [
    {
        title: "Omelette 'Titan' Bio-Active",
        time: "10 min",
        cals: 450,
        protein: 35,
        match: 98,
        desc: "Optimisée pour la récupération nerveuse. Riche en Choline.",
        tags: ["Oeufs", "Epinards", "Curcuma"]
    },
    {
        title: "Power Bowl 'Green God'",
        time: "15 min",
        cals: 620,
        protein: 42,
        match: 85,
        desc: "Complex Carbs + Lean Protein. Le carburant parfait pré-workout.",
        tags: ["Riz", "Poulet", "Avocat"]
    }
];

export function FridgeEngine() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const addIngredient = () => {
        if (input && !ingredients.includes(input)) {
            setIngredients([...ingredients, input]);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') addIngredient();
    };

    const generateRecipes = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setResults(MOCK_RECIPES);
        }, 2000);
    };

    return (
        <div className="min-h-[600px] flex flex-col md:flex-row gap-8">

            {/* LEFT: Input Zone */}
            <GlassCard className="flex-1 flex flex-col relative overflow-hidden">
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <ChefHat className="w-8 h-8 text-[#D4AF37]" /> Fridge Alchemist 🧬
                    </h3>
                    <p className="text-slate-500">Transformez vos restes en or anabolique.</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ajouter un ingrédient (ex: Oeufs...)"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-bold text-slate-700"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <button
                        onClick={addIngredient}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Tags Area */}
                <div className="flex-1 flex flex-wrap content-start gap-2 mb-8 min-h-[100px]">
                    <AnimatePresence>
                        {ingredients.map(ing => (
                            <motion.span
                                key={ing}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 flex items-center gap-2 shadow-sm"
                            >
                                {ing}
                                <button onClick={() => setIngredients(ingredients.filter(i => i !== ing))} className="hover:text-red-500">
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {ingredients.length === 0 && (
                        <div className="w-full text-center text-slate-400 text-sm italic py-10">
                            Le frigo est vide... Scannez ou ajoutez des items.
                        </div>
                    )}
                </div>

                {/* Action */}
                <GoldButton
                    onClick={generateRecipes}
                    disabled={ingredients.length === 0 || isGenerating}
                    className="w-full py-4 text-lg shadow-gold-glow"
                >
                    {isGenerating ? (
                        <span className="flex items-center gap-2">
                            <Sparkles className="animate-spin" /> Alchemy in progress...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles /> Générer Recettes
                        </span>
                    )}
                </GoldButton>
            </GlassCard>

            {/* RIGHT: Results */}
            <div className="flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                    {results.length > 0 ? (
                        results.map((recipe, idx) => (
                            <motion.div
                                key={recipe.title}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard className="p-0 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform">
                                    <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <h4 className="text-xl font-black text-white">{recipe.title}</h4>
                                            <div className="bg-[#D4AF37] text-slate-900 text-xs font-black px-2 py-1 rounded">
                                                {recipe.match}% MATCH
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex gap-4 mb-4 text-sm font-bold text-slate-500">
                                            <span className="flex items-center gap-1"><span className="text-slate-900">{recipe.time}</span> Prep</span>
                                            <span className="flex items-center gap-1"><span className="text-slate-900">{recipe.cals}</span> Kcal</span>
                                            <span className="flex items-center gap-1"><span className="text-[#D4AF37]">{recipe.protein}g</span> Prot</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">{recipe.desc}</p>
                                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-slate-400">
                                            {recipe.tags.map(t => <span key={t}>#{t}</span>)}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-300">
                            <ChefHat className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-bold">En attente d'ingrédients...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
