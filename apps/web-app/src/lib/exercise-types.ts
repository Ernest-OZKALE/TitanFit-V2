// Shared types for exercise database
export type Equipment = 'bodyweight' | 'dumbbell' | 'barbell' | 'cable' | 'machine' | 'kettlebell' | 'band';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseCategory = 'strength' | 'stretching' | 'cardio';

export interface Exercise {
    id: string;
    name: string;
    targetMuscles: string[];
    secondaryMuscles?: string[];
    equipment: Equipment[];
    difficulty: Difficulty;
    category: ExerciseCategory;
    instructions: string[];
    videoUrl?: string;
}
