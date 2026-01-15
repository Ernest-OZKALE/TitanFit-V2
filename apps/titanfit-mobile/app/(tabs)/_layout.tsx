import { Tabs } from 'expo-router';
import { Chrome as Home, User, BarChart } from 'lucide-react-native'; // Lucide icons for React Native?
// Wait, Lucide React Native needs generic Icon component or imports.
// expo-vector-icons is safer if lucide not installed. I'll use FontAwesome for now or install lucide-react-native.
// Actually Expo comes with @expo/vector-icons.

import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#1A1A1A',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#666',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome5 name="th-large" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color }) => (
            <View className="bg-titanium-500 rounded-full p-3 -mt-6 shadow-lg shadow-amber-500/20">
              <FontAwesome5 name="dumbbell" size={20} color="black" />
            </View>
          ),
          tabBarLabel: () => null, // Hide label for the center button
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
