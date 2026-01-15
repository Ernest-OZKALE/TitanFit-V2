import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeableCard } from './SwipeableCard';
import { Recipe, UserPreferences, MealContext } from '@/types/nutrition';
import { getSuggestions } from '@/lib/chef-ia-engine';
import { Loader2, RefreshCw } from 'lucide-react';
import { GoldButton } from '@/components/ui/premium-components';

export function MealSwiper({ context }: { context: MealContext }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // Mock User Prefs (would come from context/store)
    const userPrefs: UserPreferences = {
        dietType: 'balanced',
        allergens: [],
        dislikedIngredients: [],
        likedIngredients: [],
        calorieTarget: 2500,
        proteinTarget: 180
    };

    useEffect(() => {
        // Simulate "AI Thinking" delay
        setTimeout(() => {
            const suggestions = getSuggestions(userPrefs, context);
            setRecipes(suggestions);
            setLoading(false);
        }, 1200);
    }, [context]);

    const handleSwipe = (direction: 'left' | 'right') => {
        const currentRecipe = recipes[0];

        // Remove the top card (index 0)
        setTimeout(() => {
            setRecipes(prev => prev.slice(1));
        }, 200); // Small delay to let animation finish visually

        if (direction === 'right') {
            console.log("LIKED RECIPE!");
            // Navigate to detail view
            router.push(`/nutrition/recipe/${currentRecipe.id}`);
        }
    };

    const handleReset = () => {
        setLoading(true);
        setTimeout(() => {
            const suggestions = getSuggestions(userPrefs, context);
            setRecipes(suggestions);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg border border-slate-100">
                    <Loader2 className="h-10 w-10 text-[#D4AF37] animate-spin mb-4" />
                    <p className="text-slate-500 font-medium animate-pulse">Chef IA prépare le menu...</p>
                </div>
            ) : recipes.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg text-center p-8">
                    <p className="text-slate-500 mb-4">Vous avez vu toutes les suggestions !</p>
                    <GoldButton onClick={handleReset} icon={RefreshCw}>Recommencer</GoldButton>
                </div>
            ) : (
                <div className="relative w-full h-full">
                    {/* Render stack in reverse order so index 0 is on top */}
                    {recipes.map((recipe, index) => {
                        // Only render top 2 cards for performance
                        if (index > 1) return null;

                        return (
                            <SwipeableCard
                                key={recipe.id}
                                recipe={recipe}
                                onSwipe={handleSwipe}
                                active={index === 0}
                            />
                        );
                    }).reverse()}
                </div>
            )}
        </div>
    );
}
