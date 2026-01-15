import { Goal, MealSlot, DayPlan, WeekPlan, RecipeFull } from './recipe-database';
import { ALL_RECIPES, getRecipesByCategory } from './recipes/index';

// Definitions de routines types
export interface RoutineTemplate {
    id: string;
    name: string;
    goal: Goal;
    description: string;
    structure: {
        breakfast: boolean;
        morningSnack: boolean;
        lunch: boolean;
        afternoonSnack: boolean;
        dinner: boolean;
        eveningSnack: boolean;
    };
    targetCalories: number;
}

export const ROUTINES: RoutineTemplate[] = [
    // === PRISE DE MASSE ===
    {
        id: 'bulk_standard',
        name: 'Prise de Masse Classique',
        goal: 'bulk',
        description: '3 repas solides + 2 collations pour maximiser l\'apport calorique.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 3000
    },
    {
        id: 'bulk_extreme',
        name: 'Masse Extrême (Hardgainer)',
        goal: 'bulk',
        description: '6 repas/jour pour les ectomorphes qui peinent à grossir.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: true },
        targetCalories: 3500
    },
    {
        id: 'bulk_clean',
        name: 'Prise de Masse Propre',
        goal: 'bulk',
        description: 'Surplus calorique modéré pour minimiser le gras.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 2800
    },
    {
        id: 'bulk_athlete',
        name: 'Athlète Haute Performance',
        goal: 'bulk',
        description: 'Pour sportifs avec 2+ entraînements/jour. Beaucoup de glucides.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: true },
        targetCalories: 4000
    },

    // === SÈCHE ===
    {
        id: 'cut_aggressive',
        name: 'Sèche Intense',
        goal: 'cut',
        description: 'Déficit agressif (-500 kcal), focus protéines.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 1800
    },
    {
        id: 'cut_moderate',
        name: 'Sèche Modérée',
        goal: 'cut',
        description: 'Déficit léger (-300 kcal) pour préserver le muscle.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 2000
    },
    {
        id: 'cut_if_168',
        name: 'Jeûne Intermittent 16:8',
        goal: 'cut',
        description: 'Pas de petit-déj. Fenêtre alimentaire de 12h à 20h.',
        structure: { breakfast: false, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 1800
    },
    {
        id: 'cut_high_volume',
        name: 'Sèche Volume Eating',
        goal: 'cut',
        description: 'Beaucoup de légumes et aliments faibles en calories pour manger à satiété.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 1600
    },
    {
        id: 'cut_keto',
        name: 'Sèche Keto / Low Carb',
        goal: 'cut',
        description: 'Très faible en glucides (<50g), riche en lipides.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: false, dinner: true, eveningSnack: false },
        targetCalories: 1700
    },

    // === MAINTENANCE ===
    {
        id: 'maintain_balanced',
        name: 'Maintenance Équilibrée',
        goal: 'maintain',
        description: 'Le juste milieu pour garder la ligne sans se priver.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 2500
    },
    {
        id: 'maintain_flex',
        name: 'Maintenance Flexible',
        goal: 'maintain',
        description: 'Adapté pour les weekends plus gourmands.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: false, dinner: true, eveningSnack: true },
        targetCalories: 2400
    },
    {
        id: 'maintain_vegetarian',
        name: 'Maintenance Végétarien',
        goal: 'maintain',
        description: 'Plan sans viande, riche en légumineuses et protéines végétales.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 2300
    },
    {
        id: 'maintain_busy',
        name: 'Journée Chargée (3 repas)',
        goal: 'maintain',
        description: 'Seulement 3 repas, idéal pour les emplois du temps serrés.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: false, dinner: true, eveningSnack: false },
        targetCalories: 2200
    },

    // === SPÉCIALISÉS ===
    {
        id: 'special_omad',
        name: 'OMAD (1 repas/jour)',
        goal: 'cut',
        description: 'Un seul gros repas par jour. Jeûne extrême.',
        structure: { breakfast: false, morningSnack: false, lunch: false, afternoonSnack: false, dinner: true, eveningSnack: false },
        targetCalories: 1500
    },
    {
        id: 'special_warrior',
        name: 'Warrior Diet (20:4)',
        goal: 'cut',
        description: 'Fenêtre de 4h seulement. Repas principal le soir.',
        structure: { breakfast: false, morningSnack: false, lunch: false, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 1700
    },
    {
        id: 'special_6meals',
        name: '6 Petits Repas',
        goal: 'maintain',
        description: 'Mange toutes les 2-3h pour maintenir le métabolisme.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: true },
        targetCalories: 2600
    },
    {
        id: 'special_precontest',
        name: 'Sèche Compétition',
        goal: 'cut',
        description: 'Dernier sprint avant une compétition. Très strict.',
        structure: { breakfast: true, morningSnack: true, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 1400
    },
    {
        id: 'special_recomp',
        name: 'Recomposition Corporelle',
        goal: 'maintain',
        description: 'Perdre du gras et gagner du muscle en même temps. Protéines élevées.',
        structure: { breakfast: true, morningSnack: false, lunch: true, afternoonSnack: true, dinner: true, eveningSnack: false },
        targetCalories: 2200
    }
];

export function getRandomRecipe(category: string, goal?: Goal): RecipeFull | undefined {
    let candidates = getRecipesByCategory(category);
    if (goal) {
        // Soft filter: try to find recipes matching the goal, but fallback if none
        const goalMatches = candidates.filter(r => r.goal.includes(goal));
        if (goalMatches.length > 0) candidates = goalMatches;
    }

    if (candidates.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
}

export function generateDayPlan(date: string, routineId: string): DayPlan {
    const routine = ROUTINES.find(r => r.id === routineId) || ROUTINES[0];
    const slots: MealSlot[] = [];
    const goal = routine.goal;

    if (routine.structure.breakfast) {
        const recipe = getRandomRecipe('breakfast', goal);
        slots.push({ type: 'breakfast', recipeId: recipe?.id });
    }

    if (routine.structure.morningSnack) {
        const recipe = getRandomRecipe('snack', goal);
        slots.push({ type: 'morning-snack', recipeId: recipe?.id });
    }

    if (routine.structure.lunch) {
        const recipe = getRandomRecipe('lunch', goal);
        slots.push({ type: 'lunch', recipeId: recipe?.id });
    }

    if (routine.structure.afternoonSnack) {
        const recipe = Math.random() > 0.5 ? getRandomRecipe('snack', goal) : getRandomRecipe('shake', goal);
        slots.push({ type: 'afternoon-snack', recipeId: recipe?.id });
    }

    if (routine.structure.dinner) {
        const recipe = getRandomRecipe('dinner', goal);
        slots.push({ type: 'dinner', recipeId: recipe?.id });
    }

    if (routine.structure.eveningSnack) {
        const recipe = Math.random() > 0.5 ? getRandomRecipe('dessert', goal) : getRandomRecipe('snack', goal);
        slots.push({ type: 'evening-snack', recipeId: recipe?.id });
    }

    // Calculate totals (placeholder logic, real calculation needs full recipe objects)
    return {
        date,
        slots,
        totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }, // Would be calculated in UI
        targetMacros: { calories: routine.targetCalories, protein: 200, carbs: 300, fat: 80, fiber: 30, sugar: 50, sodium: 2000 }
    };
}

export function generateWeekPlan(startDate: Date, routineId: string): WeekPlan {
    const routine = ROUTINES.find(r => r.id === routineId) || ROUTINES[0];
    const days: DayPlan[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        days.push(generateDayPlan(date.toISOString().split('T')[0], routineId));
    }

    return {
        startDate: startDate.toISOString().split('T')[0],
        days,
        goal: routine.goal
    };
}
