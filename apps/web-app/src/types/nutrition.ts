export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DietType = 'vegan' | 'vegetarian' | 'pescatarian' | 'paleo' | 'keto' | 'balanced';
export type Allergen = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy' | 'shellfish';

export interface NutritionFacts {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
    sugar?: number;
}

export interface Ingredient {
    id: string;
    name: string;
    amount: number;
    unit: string; // 'g', 'ml', 'unit', 'tbsp', etc.
    category?: string;
    image?: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string; // High quality URL
    prepTime: number; // minutes
    cookTime: number; // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;

    macros: NutritionFacts;
    ingredients: Ingredient[];
    instructions: string[];

    tags: string[]; // 'quick', 'budget', 'muscle-gain', etc.
    dietTypes: DietType[];
    allergens: Allergen[];

    matchScore?: number; // Calculated dynamically by Chef IA
    matchReason?: string; // "Riche en protéines" or "Parfait pour ce soir"
}

export interface UserPreferences {
    dietType: DietType;
    allergens: Allergen[];
    dislikedIngredients: string[];
    likedIngredients: string[];
    calorieTarget: number;
    proteinTarget: number;
}

export interface MealContext {
    mealType: MealType;
    remainingCalories: number;
    remainingProtein: number;
    timeAvailable: number; // minutes
}
