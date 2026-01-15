// ============================================
// TITAN NUTRITION - RECIPE DATABASE CORE
// ============================================

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake' | 'dessert' | 'sauce';
export type DietTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'high-protein' | 'low-carb' | 'bulk' | 'cut' | 'meal-prep' | 'quick' | 'budget' | 'high-fiber' | 'low-fat' | 'healthy-fat' | 'balanced' | 'paleo' | 'raw' | 'no-cook' | 'pre-workout' | 'post-workout' | 'energy' | 'detox' | 'supplement' | 'pescatarian' | 'dairy-free' | 'volume-eating' | 'clean-eating';
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
// SCANNED PRODUCT
// ============================================

export type TitanVerdict = 'excellent' | 'bon' | 'moyen' | 'mauvais';

export interface ScannedProduct {
    barcode: string;
    name: string;
    brand: string;
    imageUrl?: string;

    // Scores
    nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' | 'unknown';
    novaGroup: 1 | 2 | 3 | 4 | null;
    ecoScore: 'A' | 'B' | 'C' | 'D' | 'E' | 'unknown';

    // Titan Analysis
    titanVerdict: TitanVerdict;
    verdictReason: string;

    // Nutrition
    macrosPer100g: Macros;
    servingSize: number;

    // Warnings
    additives: string[];
    allergens: string[];

    // History
    scannedAt: string; // ISO date
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

export function getTitanVerdict(nutriScore: string, novaGroup: number | null, additives: string[]): TitanVerdict {
    let score = 0;

    // Nutri-Score contribution
    if (nutriScore === 'A') score += 40;
    else if (nutriScore === 'B') score += 30;
    else if (nutriScore === 'C') score += 20;
    else if (nutriScore === 'D') score += 10;
    else if (nutriScore === 'E') score += 0;

    // NOVA contribution (lower is better)
    if (novaGroup === 1) score += 40;
    else if (novaGroup === 2) score += 30;
    else if (novaGroup === 3) score += 15;
    else if (novaGroup === 4) score += 0;

    // Additives penalty
    score -= Math.min(additives.length * 5, 20);

    if (score >= 70) return 'excellent';
    if (score >= 50) return 'bon';
    if (score >= 30) return 'moyen';
    return 'mauvais';
}
