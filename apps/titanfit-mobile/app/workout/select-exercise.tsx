import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useWorkoutCreate } from '../../context/WorkoutCreateContext';
import { FontAwesome5 } from '@expo/vector-icons';

// Using the same MUSCLE_DATA logic but via Supabase if possible.
// Fallback logic implemented here.

type Exercise = {
    id: string;
    name: string;
    muscle_group: string;
};

// Hardcoded fallback if DB is empty (Seeding logic)
const SEED_EXERCISES = [
    { name: "Bench Press (Barbell)", muscle_group: "Chest" },
    { name: "Squat (Barbell)", muscle_group: "Legs" },
    { name: "Deadlift (Barbell)", muscle_group: "Back" },
    { name: "Overhead Press", muscle_group: "Shoulders" },
    { name: "Pull Up", muscle_group: "Back" },
    { name: "Dumbbell Curl", muscle_group: "Arms" },
    { name: "Tricep Extension", muscle_group: "Arms" },
    { name: "Leg Press", muscle_group: "Legs" }
];

export default function SelectExerciseScreen() {
    const router = useRouter();
    const { addExercise } = useWorkoutCreate();
    const [search, setSearch] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchExercises = async () => {
        setLoading(true);
        let { data, error } = await supabase
            .from('exercises')
            .select('*')
            .ilike('name', `%${search}%`)
            .limit(50);

        if (data && data.length > 0) {
            setExercises(data);
        } else if (!search) {
            // If empty, offer seed or show empty
            // Actually, let's just show local seed as "Quick Suggestions" if DB returns nothing
            // Better yet: If DB is empty, auto-seed it? No, side-effect heavy.
            // Just display SEED_EXERCISES as a fallback UI for now.
            setExercises([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timeout = setTimeout(fetchExercises, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleSelect = (ex: Exercise) => {
        addExercise({ id: ex.id, name: ex.name, muscle_group: ex.muscle_group });
        router.back();
    };

    // Quick add for unknown exercises
    const handleCreateCustom = async () => {
        if (!search) return;
        // Optimistic add locally
        const newId = Math.random().toString(36).substring(7); // Temp ID
        // Ideally we insert into DB too.
        const { data } = await supabase.from('exercises').insert({ name: search, muscle_group: 'Other' }).select().single();

        if (data) {
            handleSelect(data);
        } else {
            // Fallback
            handleSelect({ id: newId, name: search, muscle_group: 'Other' });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="p-4 border-b border-white/10 flex-row gap-3 items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-gray-400">Cancel</Text>
                </TouchableOpacity>
                <View className="flex-1 bg-white/10 h-10 rounded-lg flex-row items-center px-3">
                    <FontAwesome5 name="search" size={14} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-white h-full"
                        placeholder="Search exercise..."
                        placeholderTextColor="#666"
                        autoFocus
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View className="p-10"><ActivityIndicator color="#D4AF37" /></View>
            ) : (
                <FlatList
                    data={exercises.length > 0 ? exercises : SEED_EXERCISES.map((e, i) => ({ id: `seed-${i}`, ...e }))}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="p-4 border-b border-white/5 flex-row justify-between items-center active:bg-white/5"
                            onPress={() => handleSelect(item as Exercise)}
                        >
                            <Text className="text-white font-bold text-base">{item.name}</Text>
                            <Text className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded">{item.muscle_group}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <TouchableOpacity
                            className="p-4 items-center flex-row justify-center gap-2"
                            onPress={handleCreateCustom}
                        >
                            <FontAwesome5 name="plus" size={14} color="#D4AF37" />
                            <Text className="text-titanium-500 font-bold">Create "{search}"</Text>
                        </TouchableOpacity>
                    }
                />
            )}
        </SafeAreaView>
    );
}
