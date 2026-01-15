import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { HealthService } from '../services/health';
import { FontAwesome5 } from '@expo/vector-icons';

export default function HeartRateWidget() {
    const [bpm, setBpm] = useState(0);
    const [source, setSource] = useState('...');

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const fetchHeartRate = async () => {
                const data = await HealthService.getLatestHeartRate();
                if (active) {
                    setBpm(data.bpm);
                    setSource(data.source);
                }
            };

            fetchHeartRate();
            // Refresh every 5 seconds "Live" feel
            const interval = setInterval(fetchHeartRate, 5000);

            return () => {
                active = false;
                clearInterval(interval);
            };
        }, [])
    );

    const getZoneColor = (hr: number) => {
        if (hr < 60) return "text-blue-400"; // Resting
        if (hr < 100) return "text-green-400"; // Normal
        if (hr < 140) return "text-yellow-400"; // Moderate
        return "text-red-500"; // Intense
    };

    return (
        <View className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex-row justify-between items-center">
            <View>
                <View className="flex-row items-center gap-2 mb-1">
                    <FontAwesome5 name="heartbeat" size={20} color="#ef4444" />
                    <Text className="text-white font-bold text-lg">Fréquence Cardiaque</Text>
                </View>
                <Text className="text-gray-400 text-xs">Source: {source}</Text>
            </View>

            <View className="items-end">
                {bpm > 0 ? (
                    <>
                        <Text className={`text-4xl font-mono font-black ${getZoneColor(bpm)}`}>
                            {Math.round(bpm)}
                        </Text>
                        <Text className="text-gray-500 text-xs font-bold uppercase">BPM</Text>
                    </>
                ) : (
                    <Text className="text-gray-500 text-lg">--</Text>
                )}
            </View>
        </View>
    );
}
