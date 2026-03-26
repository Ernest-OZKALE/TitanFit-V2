import { Recipe, UserPreferences, MealContext, DietType, MealType } from '@/types/nutrition';

// ============================================================================
// 1. MOCK DATABASE - "Premium Quality Only"
// ============================================================================

export const RECIPE_DATABASE: Recipe[] = [
    {
        id: 'r1',
        title: "Poké Bowl Saumon & Avocat Gold",
        description: "Un bol frais et énergisant avec du saumon sashimi, avocat crémeux et une sauce mangue-sesame.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1600",
        prepTime: 15,
        cookTime: 10,
        difficulty: 'easy',
        servings: 1,
        macros: { calories: 550, protein: 35, carbs: 65, fats: 22 },
        ingredients: [], // Simplified for mock
        instructions: ["Cuire le riz", "Couper le saumon", "Assembler"],
        tags: ['fresh', 'omega3', 'muscle-gain'],
        dietTypes: ['pescatarian', 'balanced'],
        allergens: []
    },
    {
        id: 'r2',
        title: "Steak de Thon Saisi & Asperges",
        description: "Thon rouge mi-cuit en croûte de sésame, accompagné d'asperges grillées à l'huile de truffe.",
        image: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&q=80&w=1600",
        prepTime: 10,
        cookTime: 10,
        difficulty: 'medium',
        servings: 1,
        macros: { calories: 420, protein: 48, carbs: 12, fats: 18 },
        ingredients: [],
        instructions: [],
        tags: ['low-carb', 'high-protein', 'quick'],
        dietTypes: ['pescatarian', 'balanced'],
        allergens: []
    },
    {
        id: 'r3',
        title: "Pancakes Protéinés 'Fluffy Cloud'",
        description: "Des pancakes aériens à la vanille, sans sucre ajouté, servis avec des baies fraîches.",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=1600",
        prepTime: 10,
        cookTime: 15,
        difficulty: 'easy',
        servings: 1,
        macros: { calories: 380, protein: 30, carbs: 45, fats: 10 },
        ingredients: [],
        instructions: [],
        tags: ['breakfast', 'sweet', 'comfort'],
        dietTypes: ['vegetarian', 'balanced'],
        allergens: ['eggs', 'dairy']
    },
    {
        id: 'r4',
        title: "Curry Vert Thaï Végétal",
        description: "Lait de coco onctueux, tofu croustillant et légumes croquants. Une explosion de saveurs.",
        image: "https://images.unsplash.com/photo-1626804475297-411dbcc75199?auto=format&fit=crop&q=80&w=1600",
        prepTime: 20,
        cookTime: 25,
        difficulty: 'medium',
        servings: 2,
        macros: { calories: 480, protein: 22, carbs: 35, fats: 28 },
        ingredients: [],
        instructions: [],
        tags: ['vegan', 'spicy', 'warming'],
        dietTypes: ['vegan', 'vegetarian'],
        allergens: ['soy']
    },
    {
        id: 'r5',
        title: "Poulet Rôti Citron & Romarin",
        description: "Suprême de poulet juteux mariné aux herbes fraîches, patates douces rôties.",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1600",
        prepTime: 10,
        cookTime: 35,
        difficulty: 'easy',
        servings: 1,
        macros: { calories: 600, protein: 55, carbs: 50, fats: 18 },
        ingredients: [],
        instructions: [],
        tags: ['classic', 'high-protein', 'post-workout'],
        dietTypes: ['balanced', 'paleo'],
        allergens: []
    },
    {
        id: 'r6',
        title: "Smoothie Bowl 'Purple Rain'",
        description: "Açaï, banane, myrtilles et granola maison. Le plein d'antioxydants pour démarrer.",
        image: "https://images.unsplash.com/photo-1490474504059-bfd8d642ed43?auto=format&fit=crop&q=80&w=1600",
        prepTime: 5,
        cookTime: 0,
        difficulty: 'easy',
        servings: 1,
        macros: { calories: 350, protein: 12, carbs: 60, fats: 8 },
        ingredients: [],
        instructions: [],
        tags: ['fresh', 'vitamin', 'breakfast'],
        dietTypes: ['vegan', 'vegetarian'],
        allergens: ['nuts']
    }
];

// ============================================================================
// 2. THE "CHEF IA" SCORING ALGORITHM
// ============================================================================

export function getSuggestions(
    userPrefs: UserPreferences,
    context: MealContext
): Recipe[] {

    // 1. Filter Check (Hard Filters)
    let candidates = RECIPE_DATABASE.filter(recipe => {
        // Diet check
        if (userPrefs.dietType !== 'balanced' && !recipe.dietTypes.includes(userPrefs.dietType)) {
            return false;
        }
        // Allergen check
        const hasAllergen = recipe.allergens.some(a => userPrefs.allergens.includes(a));
        if (hasAllergen) return false;

        // Time check
        if ((recipe.prepTime + recipe.cookTime) > context.timeAvailable) {
            return false;
        }

        return true;
    });

    // 2. Scoring System (0 to 100)
    const scoredRecipes = candidates.map(recipe => {
        let score = 50; // Base score
        let reason = "Recommandé pour vous";

        // Macro Fit (Max +30)
        // Simplistic logic: if calories fit within bounds
        const diffCal = Math.abs(recipe.macros.calories - context.remainingCalories);
        if (diffCal < 100) {
            score += 30;
            reason = "Idéal pour vos calories restantes";
        } else if (diffCal < 200) {
            score += 15;
        }

        // Protein Boost (Max +20)
        // If user needs protein and recipe is high protein
        if (context.remainingProtein > 20 && recipe.macros.protein > 30) {
            score += 20;
            reason = "Boost de protéines parfait";
        }

        // Meal Type Affinity (Max +20)
        // Boost breakfast items in morning, etc.
        const isBreakfasty = recipe.tags.includes('breakfast');
        if (context.mealType === 'breakfast' && isBreakfasty) score += 20;
        if (context.mealType !== 'breakfast' && isBreakfasty) score -= 20;

        return { ...recipe, matchScore: Math.min(score, 100), matchReason: reason };
    });

    // 3. Sort by Score
    return scoredRecipes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
