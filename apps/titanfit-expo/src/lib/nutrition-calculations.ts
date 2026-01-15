export interface UserStats {
    gender: 'male' | 'female';
    age: number;
    weight: number; // kg
    height: number; // cm
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
    goal: 'cut' | 'maintain' | 'bulk';
}

export interface NutritionPlan {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export function calculateTDEE(stats: UserStats): number {
    // Mifflin-St Jeor Equation
    let bmr = (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age);

    if (stats.gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // Activity Multipliers
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        athlete: 1.9
    };

    return Math.round(bmr * multipliers[stats.activityLevel]);
}

export function calculateMacros(tdee: number, goal: UserStats['goal']): NutritionPlan {
    let targetCalories = tdee;

    // Adjust calories based on goal
    if (goal === 'cut') {
        targetCalories -= 500; // ~0.5kg loss per week
    } else if (goal === 'bulk') {
        targetCalories += 300; // Lean bulk
    }

    // Macro split ratios (Protein/Fat/Carb)
    // Cut: High protein to spare muscle
    // Bulk: Higher carbs for energy
    // Maintain: Balanced

    let proteinRatio = 0.3;
    let fatRatio = 0.3;
    let carbsRatio = 0.4;

    if (goal === 'cut') {
        proteinRatio = 0.4;
        fatRatio = 0.3;
        carbsRatio = 0.3;
    } else if (goal === 'bulk') {
        proteinRatio = 0.25;
        fatRatio = 0.25;
        carbsRatio = 0.5;
    }

    // 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
    const protein = Math.round((targetCalories * proteinRatio) / 4);
    const fat = Math.round((targetCalories * fatRatio) / 9);
    const carbs = Math.round((targetCalories * carbsRatio) / 4);

    return {
        calories: Math.round(targetCalories),
        protein,
        carbs,
        fat
    };
}
