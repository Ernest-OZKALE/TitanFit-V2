'use client';

import { Recipe } from '@/types/nutrition';
import { Check, Clock, Users, Flame } from 'lucide-react';
import { GlassCard } from '@/components/ui/premium-components';

export function RecipeContent({ recipe }: { recipe: Recipe }) {
    return (
        <div className="space-y-8">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <GlassCard className="flex flex-col items-center justify-center py-4">
                    <Clock className="h-5 w-5 text-[#D4AF37] mb-2" />
                    <span className="text-sm font-bold text-slate-900">{recipe.prepTime + recipe.cookTime} m</span>
                    <span className="text-xs text-slate-400">Total</span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center py-4">
                    <Flame className="h-5 w-5 text-orange-500 mb-2" />
                    <span className="text-sm font-bold text-slate-900">{recipe.macros.calories}</span>
                    <span className="text-xs text-slate-400">Kcal</span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center py-4">
                    <Users className="h-5 w-5 text-blue-500 mb-2" />
                    <span className="text-sm font-bold text-slate-900">{recipe.servings}</span>
                    <span className="text-xs text-slate-400">Pers.</span>
                </GlassCard>
            </div>

            {/* Ingredients */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-[#D4AF37]/10 w-8 h-8 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">1</span>
                    Ingrédients
                </h3>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
                    {/* Mock ingredients list since our mock DB had empty arrays for simplicity, 
                        in real app this iterates recipe.ingredients */}
                    {['2 filets de saumon frais', '1 avocat mûr', '200g de riz jasmin', 'Graines de sésame', 'Sauce soja réduite en sel'].map((ing, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-[#D4AF37] transition-colors" />
                            <span className="text-slate-600 font-medium">{ing}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-[#D4AF37]/10 w-8 h-8 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">2</span>
                    Préparation
                </h3>
                <div className="space-y-6">
                    {recipe.instructions.length > 0 ? recipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm mt-1">
                                {i + 1}
                            </div>
                            <p className="text-slate-600 leading-relaxed pt-1">{step}</p>
                        </div>
                    )) : (
                        <p className="text-slate-400 italic">Instructions détaillées disponibles en mode cuisine.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
