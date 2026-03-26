'use client';

import { useState } from 'react';
import { ALL_RECIPES } from '@/lib/recipes/index';
import { Search, Flame, Clock, ChefHat, Filter, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { RecipeFull, MealCategory } from '@/lib/recipe-database';
import { RecipeDetail } from './RecipeDetail';

type FilterCategory = 'all' | MealCategory;

export function RecipeLibrary() {


    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeFull | null>(null);

    const filteredRecipes = ALL_RECIPES.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryLabels: Record<string, string> = {
        'all': 'Tout',
        'breakfast': 'Petit-Déj',
        'lunch': 'Déjeuner',
        'dinner': 'Dîner',
        'snack': 'Snacks',
        'shake': 'Shakes',
        'dessert': 'Desserts'
    };

    return (
        <div className="space-y-6 pb-40">
            {/* SEARCH & FILTER BAR */}
            <div className="bg-[#FAFAFA]/90 backdrop-blur-md py-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une recette, un ingrédient..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/20 font-medium shadow-sm transition-all"
                    />
                </div>

                {/* CATEGORIES SCROLL */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                    {(Object.keys(categoryLabels) as FilterCategory[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {categoryLabels[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {/* RECIPES GRID */}
            <div className="grid grid-cols-1 gap-4">
                {filteredRecipes.map((recipe, index) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        index={index}
                        onClick={() => setSelectedRecipe(recipe)}
                    />
                ))}

                {filteredRecipes.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Aucune recette trouvée.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                            className="mt-2 text-[#FF4D00] text-sm font-bold hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>

            {/* RECIPE DETAIL OVERLAY */}
            <RecipeDetail
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />
        </div>
    );
}

function RecipeCard({ recipe, index, onClick }: { recipe: RecipeFull, index: number, onClick: () => void }) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden active:scale-95 duration-200"
        >
            <div className="flex gap-4">
                {/* Image Placeholder (Dynamic Color for now) */}
                <div className={`w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center ${recipe.category === 'breakfast' ? 'bg-orange-100 text-orange-500' :
                    recipe.category === 'lunch' ? 'bg-blue-100 text-blue-500' :
                        recipe.category === 'dinner' ? 'bg-indigo-100 text-indigo-500' :
                            'bg-green-100 text-green-500'
                    }`}>
                    <ChefHat className="w-8 h-8" />
                </div>

                <div className="flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#FF4D00] transition-colors line-clamp-2">
                            {recipe.name}
                        </h3>
                        {/* <button className="text-slate-300 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button> */}
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-3">
                        {recipe.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-1 text-[#FF4D00]">
                            <Flame className="w-3.5 h-3.5" fill="currentColor" />
                            {recipe.macros.calories} kcal
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.prepTime + recipe.cookTime} min
                        </div>
                        <div className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase text-slate-500">
                            {recipe.difficulty}
                        </div>
                    </div>
                </div>
            </div>

            {/* Macro Bars */}
            <div className="mt-4 flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                <div
                    className="bg-blue-500"
                    style={{ width: `${(recipe.macros.protein * 4 / recipe.macros.calories) * 100}%` }}
                />
                <div
                    className="bg-yellow-400"
                    style={{ width: `${(recipe.macros.carbs * 4 / recipe.macros.calories) * 100}%` }}
                />
                <div
                    className="bg-red-400"
                    style={{ width: `${(recipe.macros.fat * 9 / recipe.macros.calories) * 100}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 px-0.5">
                <span className="text-blue-500">{recipe.macros.protein}g Prot</span>
                <span className="text-yellow-500">{recipe.macros.carbs}g Carbs</span>
                <span className="text-red-500">{recipe.macros.fat}g Lipides</span>
            </div>
        </motion.div>
    );
}
