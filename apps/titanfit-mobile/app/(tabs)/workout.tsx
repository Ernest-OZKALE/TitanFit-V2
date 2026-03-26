import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

type Workout = {
    id: string;
    name: string;
    created_at: string;
    exercises_count?: number;
};

export default function WorkoutScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const fetchWorkouts = async () => {
        if (!user) return;
        setRefreshing(true);

        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setWorkouts(data);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        fetchWorkouts();
    }, [user]);

    const renderItem = ({ item }: { item: Workout }) => (
        <TouchableOpacity
            className="bg-white/5 border border-white/10 p-4 rounded-xl mb-3 flex-row items-center justify-between active:bg-white/10"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-titanium-500/10 rounded-full items-center justify-center border border-titanium-500/20">
                    <FontAwesome5 name="dumbbell" size={16} color="#D4AF37" />
                </View>
                <View>
                    <Text className="text-white font-bold text-base">{item.name}</Text>
                    <Text className="text-gray-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-black p-6">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-3xl font-bold tracking-tight">Workouts</Text>
                <TouchableOpacity
                    className="w-10 h-10 bg-titanium-500 rounded-full items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                    onPress={() => {
                        router.push('/workout/create');
                    }}
                >
                    <FontAwesome5 name="plus" size={16} color="black" />
                </TouchableOpacity>
            </View>

            {workouts.length === 0 && !refreshing ? (
                <View className="flex-1 justify-center items-center opacity-50">
                    <MaterialCommunityIcons name="weight-lifter" size={64} color="#333" />
                    <Text className="text-gray-500 mt-4 text-center">Aucun entraînement récent.</Text>
                    <Text className="text-gray-600 text-xs text-center mt-1">Commencez une session pour voir l'historique.</Text>
                </View>
            ) : (
                <FlatList
                    data={workouts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchWorkouts} tintColor="#D4AF37" />
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </SafeAreaView>
    );
}
