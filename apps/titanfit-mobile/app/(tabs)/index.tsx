import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import PedometerWidget from '../../components/PedometerWidget';
import HeartRateWidget from '../../components/HeartRateWidget';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="p-6">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-xs uppercase tracking-wider">Welcome Back</Text>
            <Text className="text-white text-2xl font-bold">{user?.email?.split('@')[0] || 'Titan'}</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10">
            <Text className="text-titanium-500 font-bold">TF</Text>
          </View>
        </View>

        {/* Pedometer Live Widget */}
        <PedometerWidget />

        {/* Heart Rate Live Widget */}
        <HeartRateWidget />

        {/* Quick Actions */}
        <Text className="text-white font-bold text-lg mb-4">Actions Rapides</Text>
        <View className="flex-row gap-4">
          <View className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 aspect-square justify-center items-center">
            <Text className="text-titanium-500 text-2xl mb-2">⚡</Text>
            <Text className="text-white font-bold text-center">Log Workout</Text>
          </View>
          <View className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 aspect-square justify-center items-center">
            <Text className="text-titanium-500 text-2xl mb-2">🍎</Text>
            <Text className="text-white font-bold text-center">Scan Food</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
