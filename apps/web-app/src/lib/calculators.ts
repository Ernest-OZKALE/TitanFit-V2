export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type Goal = 'cut' | 'maintain' | 'bulk';

interface MacroResult {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export const CALCULATORS = {
    // 1. One Rep Max (Brzycki Formula)
    calculate1RM: (weight: number, reps: number): number => {
        if (reps === 1) return weight;
        return Math.round(weight * (36 / (37 - reps)));
    },

    // 2. BMR (Mifflin-St Jeor)
    calculateBMR: (weightKg: number, heightCm: number, age: number, gender: Gender): number => {
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        return gender === 'male' ? bmr + 5 : bmr - 161;
    },

    // 3. TDEE (Total Daily Energy Expenditure)
    calculateTDEE: (bmr: number, activity: ActivityLevel): number => {
        const multipliers = {
            'sedentary': 1.2,      // Desk job, little exercise
            'light': 1.375,        // 1-3 days/week
            'moderate': 1.55,      // 3-5 days/week
            'active': 1.725,       // 6-7 days/week
            'athlete': 1.9         // Physical job or 2x training
        };
        return Math.round(bmr * multipliers[activity]);
    },

    // 4. Macros
    calculateMacros: (tdee: number, goal: Goal): MacroResult => {
        let targetCalories = tdee;
        if (goal === 'cut') targetCalories -= 500;
        if (goal === 'bulk') targetCalories += 300;

        // Standard Split: 30% Protein, 35% Carbs, 35% Fats (Balanced)
        // Or Bodybuilding Split: 40% P / 40% C / 20% F?
        // Let's go with a solid "Titan" split: High Protein.

        // 2g protein per kg is better logic, but for simple calorie split:
        // Cut: 40P / 35F / 25C (Low Carb)
        // Bulk: 30P / 25F / 45C (High Carb)
        // Maintain: 30P / 35F / 35C

        let p_ratio = 0.3;
        let c_ratio = 0.35;
        let f_ratio = 0.35;

        if (goal === 'cut') { p_ratio = 0.4; f_ratio = 0.35; c_ratio = 0.25; }
        if (goal === 'bulk') { p_ratio = 0.3; f_ratio = 0.25; c_ratio = 0.45; }

        return {
            calories: Math.round(targetCalories),
            protein: Math.round((targetCalories * p_ratio) / 4),
            carbs: Math.round((targetCalories * c_ratio) / 4),
            fats: Math.round((targetCalories * f_ratio) / 9)
        };
    }
};
