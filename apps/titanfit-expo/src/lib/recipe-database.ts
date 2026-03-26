// ============================================
// TITAN NUTRITION - RECIPE DATABASE CORE (MOBILE)
// ============================================

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake' | 'dessert' | 'sauce';
export type DietTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'high-protein' | 'low-carb' | 'high-carb' | 'bulk' | 'cut' | 'meal-prep' | 'quick' | 'budget' | 'high-fiber' | 'low-fat' | 'healthy-fat' | 'balanced' | 'paleo' | 'raw' | 'no-cook' | 'pre-workout' | 'post-workout' | 'energy' | 'detox' | 'supplement' | 'pescatarian' | 'dairy-free' | 'volume-eating' | 'clean-eating';
export type Difficulty = 'Facile' | 'Moyen' | 'Difficile' | 'Très Facile';
export type Goal = 'bulk' | 'cut' | 'maintain';

export interface Macros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number; // mg
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: 'g' | 'ml' | 'pièce' | 'c.à.s' | 'c.à.c' | 'tasse' | 'tranche' | 'pincée' | 'portion' | 'branche';
    macros: Macros; // Per specified quantity
}

export interface RecipeFull {
    id: string;
    name: string;
    description: string;
    category: MealCategory;
    difficulty: Difficulty;
    prepTime: number; // minutes
    cookTime: number; // minutes
    servings: number;

    // Nutrition (per serving)
    macros: Macros;

    // Content
    ingredients: Ingredient[];
    instructions: string[];
    tips?: string;

    // Metadata
    tags: DietTag[];
    goal: Goal[];
    imageUrl?: string;
    videoUrl?: string;

    // User interaction
    isFavorite?: boolean;
    rating?: number;
    timesCooked?: number;
}

// ============================================
// INGREDIENT DATABASE (for Fridge Engine)
// ============================================

export interface IngredientDef {
    id: string;
    name: string;
    aliases: string[]; // Alternative names for fuzzy matching
    category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'spice' | 'sauce' | 'other';
    macrosPer100g: Macros;
    shelfLife: number; // days
    substitutes: string[]; // IDs of substitute ingredients
}

// ============================================
// MEAL PLAN
// ============================================

export interface MealSlot {
    type: 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner' | 'evening-snack';
    recipeId?: string;
    customMeal?: string;
    macros?: Macros;
}

export interface DayPlan {
    date: string; // ISO date
    slots: MealSlot[];
    totalMacros: Macros;
    targetMacros: Macros;
    notes?: string;
}

export interface WeekPlan {
    startDate: string;
    days: DayPlan[];
    goal: Goal;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateTotalMacros(ingredients: Ingredient[]): Macros {
    return ingredients.reduce((acc, ing) => ({
        calories: acc.calories + ing.macros.calories,
        protein: acc.protein + ing.macros.protein,
        carbs: acc.carbs + ing.macros.carbs,
        fat: acc.fat + ing.macros.fat,
        fiber: acc.fiber + ing.macros.fiber,
        sugar: acc.sugar + ing.macros.sugar,
        sodium: acc.sodium + ing.macros.sodium,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
}

export function scaleMacros(macros: Macros, factor: number): Macros {
    return {
        calories: Math.round(macros.calories * factor),
        protein: Math.round(macros.protein * factor * 10) / 10,
        carbs: Math.round(macros.carbs * factor * 10) / 10,
        fat: Math.round(macros.fat * factor * 10) / 10,
        fiber: Math.round(macros.fiber * factor * 10) / 10,
        sugar: Math.round(macros.sugar * factor * 10) / 10,
        sodium: Math.round(macros.sodium * factor),
    };
}

export function getMacroPercentages(macros: Macros): { protein: number; carbs: number; fat: number } {
    const totalCals = (macros.protein * 4) + (macros.carbs * 4) + (macros.fat * 9);
    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
        protein: Math.round((macros.protein * 4 / totalCals) * 100),
        carbs: Math.round((macros.carbs * 4 / totalCals) * 100),
        fat: Math.round((macros.fat * 9 / totalCals) * 100),
    };
}
