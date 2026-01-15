import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from './src/screens/home/HomeScreen';
import NutritionScreen from './src/screens/nutrition/NutritionScreen';
import HealthScreen from './src/screens/health/HealthScreen';
import TrainingScreen from './src/screens/training/TrainingScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

// Services
import healthKitService from './src/services/healthkit';

// Theme
import { colors } from './src/theme';
import { House, Utensils, HeartPulse, Dumbbell, User } from 'lucide-react-native';

// ...

type TabId = 'home' | 'nutrition' | 'health' | 'training' | 'profile';

const tabs = [
  { id: 'home', icon: House, label: 'Accueil' },
  { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
  { id: 'health', icon: HeartPulse, label: 'Santé' },
  { id: 'training', icon: Dumbbell, label: 'Training' },
  { id: 'profile', icon: User, label: 'Profil' },
] as const;

// Custom Tab Bar Component
function TabBar({
  activeTab,
  setActiveTab
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void
}) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.id as TabId)}
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text style={[
              styles.tabLabel,
              isActive && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request HealthKit authorization
      const hasHealthKit = healthKitService.isAvailable();
      if (hasHealthKit) {
        await healthKitService.requestAuthorization();
      }

      // Load last active tab
      const savedTab = await AsyncStorage.getItem('titan_active_tab');
      if (savedTab && tabs.some(t => t.id === savedTab)) {
        setActiveTab(savedTab as TabId);
      }
    } catch (error) {
      console.error('Init error:', error);
    }
    setIsInitialized(true);
  };

  const handleTabChange = async (tab: TabId) => {
    setActiveTab(tab);
    await AsyncStorage.setItem('titan_active_tab', tab);
  };

  // Render current screen based on active tab
  const renderScreen = () => {
    const navigation = { navigate: handleTabChange };

    switch (activeTab) {
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'nutrition':
        return <NutritionScreen navigation={navigation} />;
      case 'health':
        return <HealthScreen />;
      case 'training':
        return <TrainingScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  // Loading screen
  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>💪</Text>
          <Text style={styles.loadingTitle}>TITAN<Text style={styles.loadingAccent}>FIT</Text></Text>
          <Text style={styles.loadingSubtitle}>Chargement...</Text>
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
        <TabBar activeTab={activeTab} setActiveTab={handleTabChange} />
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 4,
  },
  loadingAccent: {
    color: colors.primary,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
