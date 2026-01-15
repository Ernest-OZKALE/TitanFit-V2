import { breakfastRecipes } from './breakfast';
import { lunchRecipes } from './lunch';
import { dinnerRecipes } from './dinner';
import { snackRecipes } from './snacks';
import { shakeRecipes } from './shakes';
import { dessertRecipes } from './desserts';
import { RecipeFull } from '../recipe-database';

// Combine all recipes
export const ALL_RECIPES: RecipeFull[] = [
    ...breakfastRecipes,
    ...lunchRecipes,
    ...dinnerRecipes,
    ...snackRecipes,
    ...shakeRecipes,
    ...dessertRecipes,
];

// Helper to get by ID
export function getRecipeById(id: string): RecipeFull | undefined {
    return ALL_RECIPES.find(r => r.id === id);
}

// Helper to filter by category
export function getRecipesByCategory(category: string): RecipeFull[] {
    return ALL_RECIPES.filter(r => r.category === category);
}

// Stats for debugging
console.log(`Loaded ${ALL_RECIPES.length} recipes into Titan Nutrition Engine.`);
