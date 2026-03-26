// src/components/onboarding/types.ts

export type OnboardingData = {
    // 1. Identity
    identity: {
        name: string;
        gender: "male" | "female" | "other";
        age: number;
    };

    // 2. Biometrics
    biometrics: {
        weight: number;
        height: number;
        target_weight: number;
        body_fat?: number; // Optional
    };

    // 3. Experience
    experience: {
        level: "beginner" | "intermediate" | "advanced" | "elite";
        years: number;
        last_program?: string;
    };

    // 4. Lifestyle (Expanded)
    lifestyle: {
        job_activity: "sedentary" | "light" | "active" | "physical";
        sleep_hours: number;
        stress_level: "low" | "medium" | "high";
        wake_time: "early" | "standard" | "late"; // New
        energy_level: "low" | "medium" | "high"; // New
        training_schedule: string[]; // Days available
        session_duration: number;
    };

    // 5. Goal
    goal: {
        primary: "mass" | "lean" | "strength" | "endurance";
        commitment: "casual" | "serious" | "hardcore";
        deadline?: string; // Optional
    };

    // 6. Nutrition (Expanded)
    nutrition: {
        diet_type: "classic" | "vegetarian" | "vegan" | "keto" | "paleo" | "pescatarian" | "flexitarian";
        meals_per_day: number;
        calories_target?: number; // AI calculated
        budget: "economy" | "standard" | "premium"; // New
        cooking_skill: "none" | "basic" | "advanced" | "chef"; // New
        hydration: "low" | "medium" | "high"; // New
        supplements: string[]; // New (Current stock)
        allergies: string[]; // Expanded
        dislikes: string[]; // New
    };

    // 7. Injuries & Limitations (Expanded)
    injuries: InjuryRecord[]; // New
    health_conditions: string[]; // New (Asthma, etc.)

    // 8. Arsenal (Equipment)
    equipment: {
        location: "commercial_gym" | "home_gym" | "bodyweight_only";
        items: string[]; // Granular list if Home Gym
        machines: string[]; // If Commercial (Available machines)
    };
};

export interface InjuryRecord {
    id: string;
    body_part: string;
    severity: "mild" | "moderate" | "severe";
    description: string;
    is_chronic: boolean;
    movements_to_avoid: string[];
}
