import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { HealthService } from '../services/health';

export default function PedometerWidget() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const [source, setSource] = useState('');

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const refresh = async () => {
                const healthInit = await HealthService.init();
                if (active && healthInit) {
                    const data = await HealthService.getStepsToday();
                    if (active) {
                        setIsAvailable(data.available);
                        setCurrentStepCount(data.steps);
                        setSource(data.source);
                    }
                }
            };

            refresh();

            return () => { active = false; };
        }, [])
    );

    return (
        <View className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-white font-bold text-lg">Mouvement</Text>
                    <Text className="text-gray-400 text-xs">Aujourd'hui ({source})</Text>
                </View>
                <Text className="text-titanium-500 font-mono text-3xl font-bold">{currentStepCount.toLocaleString()}</Text>
            </View>

            {/* Progress Bar (Goal 10k) */}
            <View className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                <View
                    className="h-full bg-titanium-500 rounded-full"
                    style={{ width: `${Math.min((currentStepCount / 10000) * 100, 100)}%` }}
                />
            </View>

            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-xs">
                    {isAvailable ? '● Connected' : '● Syncing...'}
                </Text>
                <Text className="text-gray-500 text-xs text-titanium-500">Goal: 10k</Text>
            </View>
        </View>
    );
}
