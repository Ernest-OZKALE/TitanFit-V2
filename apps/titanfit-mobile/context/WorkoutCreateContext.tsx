import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WorkoutSet = {
    id: string; // crypto.randomUUID()
    weight: string;
    reps: string;
    rpe?: string;
    completed: boolean;
};

export type WorkoutExercise = {
    id: string; // crypto.randomUUID()
    exercise_id: string; // Supabase ID (or name if custom)
    name: string;
    muscle_group?: string;
    sets: WorkoutSet[];
};

type WorkoutCreateContextType = {
    exercises: WorkoutExercise[];
    addExercise: (exercise: { id: string, name: string, muscle_group: string }) => void;
    removeExercise: (id: string) => void;
    addSet: (exerciseId: string) => void;
    updateSet: (exerciseId: string, setId: string, field: keyof WorkoutSet, value: string | boolean) => void;
    removeSet: (exerciseId: string, setId: string) => void;
    clearWorkout: () => void;
    saveWorkout: (name: string) => Promise<void>;
};

const WorkoutCreateContext = createContext<WorkoutCreateContextType | undefined>(undefined);

export function WorkoutCreateProvider({ children }: { children: ReactNode }) {
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    const addExercise = (exercise: { id: string, name: string, muscle_group: string }) => {
        const newExercise: WorkoutExercise = {
            id: Math.random().toString(36).substring(7),
            exercise_id: exercise.id,
            name: exercise.name,
            muscle_group: exercise.muscle_group,
            sets: [
                { id: Math.random().toString(36).substring(7), weight: '', reps: '', completed: false }
            ]
        };
        setExercises([...exercises, newExercise]);
    };

    const removeExercise = (id: string) => {
        setExercises(exercises.filter(e => e.id !== id));
    };

    const addSet = (exerciseId: string) => {
        setExercises(exercises.map(e => {
            if (e.id === exerciseId) {
                const previousSet = e.sets[e.sets.length - 1];
                return {
                    ...e,
                    sets: [...e.sets, {
                        id: Math.random().toString(36).substring(7),
                        weight: previousSet ? previousSet.weight : '',
                        reps: previousSet ? previousSet.reps : '',
                        completed: false
                    }]
                };
            }
            return e;
        }));
    };

    const updateSet = (exerciseId: string, setId: string, field: keyof WorkoutSet, value: string | boolean) => {
        setExercises(exercises.map(e => {
            if (e.id === exerciseId) {
                return {
                    ...e,
                    sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
                };
            }
            return e;
        }));
    };

    const removeSet = (exerciseId: string, setId: string) => {
        setExercises(exercises.map(e => {
            if (e.id === exerciseId) {
                return { ...e, sets: e.sets.filter(s => s.id !== setId) };
            }
            return e;
        }));
    };

    const clearWorkout = () => {
        setExercises([]);
    };

    const saveWorkout = async (name: string) => {
        // Implemented in component via Supabase usually, but could be here.
        // Keeping it simple for now, logic will be in create.tsx or here later.
    };

    return (
        <WorkoutCreateContext.Provider value={{
            exercises,
            addExercise,
            removeExercise,
            addSet,
            updateSet,
            removeSet,
            clearWorkout,
            saveWorkout
        }}>
            {children}
        </WorkoutCreateContext.Provider>
    );
}

export function useWorkoutCreate() {
    const context = useContext(WorkoutCreateContext);
    if (context === undefined) {
        throw new Error('useWorkoutCreate must be used within a WorkoutCreateProvider');
    }
    return context;
}
