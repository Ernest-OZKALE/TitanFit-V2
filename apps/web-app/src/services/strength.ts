import { supabase } from '@/lib/supabase';

export interface WorkoutSet {
    id?: string;
    workout_id: string;
    exercise_name: string;
    set_number: number;
    weight_kg: number;
    reps: number;
    rpe?: number;
    estimated_1rm?: number;
}

export interface WorkoutSession {
    id?: string;
    name: string;
    started_at: string;
    status: 'active' | 'completed';
}

// Epley Formula: 1RM = Weight * (1 + Reps/30)
export const calculate1RM = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    if (reps === 0) return 0;
    return Math.round(weight * (1 + reps / 30));
};

export const startWorkout = async (name: string, userId: string): Promise<WorkoutSession | null> => {
    const { data, error } = await supabase
        .from('workouts')
        .insert({
            user_id: userId,
            name,
            status: 'active',
            started_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('Error starting workout:', error);
        return null;
    }
    return data;
};

export const logSet = async (set: WorkoutSet): Promise<WorkoutSet | null> => {
    const estimated1rm = calculate1RM(set.weight_kg, set.reps);

    const { data, error } = await supabase
        .from('workout_sets')
        .insert({
            ...set,
            estimated_1rm: estimated1rm
        })
        .select()
        .single();

    if (error) {
        console.error('Error logging set:', error);
        return null;
    }
    return data;
};

export const finishWorkout = async (workoutId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('workouts')
        .update({
            status: 'completed',
            ended_at: new Date().toISOString()
        })
        .eq('id', workoutId);

    return !error;
};
