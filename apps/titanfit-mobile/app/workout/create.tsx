import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWorkoutCreate, WorkoutExercise, WorkoutSet } from '../../context/WorkoutCreateContext';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type SetRowProps = {
    set: WorkoutSet;
    index: number;
    onUpdate: (field: keyof WorkoutSet, value: string | boolean) => void;
    onDelete: () => void;
};

const SetRow = ({ set, index, onUpdate, onDelete }: SetRowProps) => (
    <View className="flex-row items-center gap-2 mb-2">
        <View className="w-8 items-center"><Text className="text-gray-500 font-mono">{index + 1}</Text></View>
        <TextInput
            className="flex-1 bg-white/5 text-white p-2 rounded text-center font-bold"
            placeholder="kg"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(v) => onUpdate('weight', v)}
        />
        <TextInput
            className="flex-1 bg-white/5 text-white p-2 rounded text-center font-bold"
            placeholder="reps"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(v) => onUpdate('reps', v)}
        />
        <TouchableOpacity
            onPress={() => onUpdate('completed', !set.completed)}
            className={`w-10 h-10 rounded items-center justify-center ${set.completed ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/10'} border`}
        >
            <MaterialCommunityIcons name="check" size={20} color={set.completed ? '#4ade80' : '#666'} />
        </TouchableOpacity>
    </View>
);

export default function CreateWorkoutScreen() {
    const router = useRouter();
    const { exercises, addSet, updateSet, removeSet, removeExercise, clearWorkout } = useWorkoutCreate();
    const { user } = useAuth();
    const [workoutName, setWorkoutName] = useState("Evening Workout");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        if (exercises.length === 0) {
            Alert.alert("Empty Workout", "Please add at least one exercise.");
            return;
        }

        setSaving(true);
        try {
            // 1. Create Workout
            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .insert({
                    profile_id: user.id,
                    name: workoutName,
                    started_at: new Date().toISOString(),
                    completed_at: new Date().toISOString(), // Instant save for now
                    status: 'completed'
                })
                .select()
                .single();

            if (workoutError) throw workoutError;

            // 2. Loop Exercises & Sets
            // Warning: This loop is naive. In production, use bulk insert or stored procedure.
            // But for MVP Mobile it's fine.
            for (const [index, exercise] of exercises.entries()) {
                const { data: exJoinData, error: joinError } = await supabase
                    .from('workout_exercises')
                    .insert({
                        workout_id: workoutData.id,
                        exercise_id: exercise.exercise_id,
                        order_index: index
                    })
                    .select()
                    .single();

                if (joinError) throw joinError;

                // Sets
                const setsToInsert = exercise.sets.map((s, i) => ({
                    workout_exercise_id: exJoinData.id,
                    weight: parseFloat(s.weight) || 0,
                    reps: parseInt(s.reps) || 0,
                    order_index: i,
                    rpe: 0
                }));

                const { error: setsError } = await supabase
                    .from('workout_sets')
                    .insert(setsToInsert);

                if (setsError) throw setsError;
            }

            Alert.alert("Success", "Workout saved globally!");
            clearWorkout();
            router.back();

        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row justify-between items-center p-4 border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-gray-400 text-lg">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg">New Workout</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    <Text className={`font-bold text-lg ${saving ? 'text-gray-500' : 'text-titanium-500'}`}>
                        {saving ? 'Saving...' : 'Finish'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs uppercase mb-2">Workout Name</Text>
                    <TextInput
                        className="text-white text-2xl font-bold border-b border-white/20 pb-2"
                        value={workoutName}
                        onChangeText={setWorkoutName}
                    />
                </View>

                {exercises.length === 0 ? (
                    <View className="items-center justify-center py-20 opacity-50">
                        <FontAwesome5 name="dumbbell" size={48} color="white" />
                        <Text className="text-gray-500 mt-4 text-center">No exercises added yet.</Text>
                        <Text className="text-gray-600 text-xs">Tap "Add Exercise" to start building.</Text>
                    </View>
                ) : (
                    exercises.map((exercise) => (
                        <View key={exercise.id} className="mb-6">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-titanium-500 text-lg font-bold">{exercise.name}</Text>
                                <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row mb-2 px-2">
                                <Text className="w-8 text-xs text-gray-500 text-center">Set</Text>
                                <Text className="flex-1 text-xs text-gray-500 text-center">kg</Text>
                                <Text className="flex-1 text-xs text-gray-500 text-center">Reps</Text>
                                <Text className="w-10 text-xs text-gray-500 text-center">✓</Text>
                            </View>

                            {exercise.sets.map((set, i) => (
                                <SetRow
                                    key={set.id}
                                    set={set}
                                    index={i}
                                    onUpdate={(f, v) => updateSet(exercise.id, set.id, f, v)}
                                    onDelete={() => removeSet(exercise.id, set.id)}
                                />
                            ))}

                            <TouchableOpacity
                                className="bg-white/5 py-3 rounded items-center mt-2 active:bg-white/10"
                                onPress={() => addSet(exercise.id)}
                            >
                                <Text className="text-titanium-500 font-bold text-xs uppercase">+ Add Set</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <TouchableOpacity
                    className="bg-titanium-500 h-14 rounded-xl items-center justify-center mt-4 mb-20 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                    onPress={() => router.push('/workout/select-exercise')}
                >
                    <Text className="text-black font-black text-lg uppercase tracking-wider">
                        + Add Exercise
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
