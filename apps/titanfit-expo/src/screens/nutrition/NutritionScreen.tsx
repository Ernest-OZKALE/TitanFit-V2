import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../../theme';
import {
    Utensils,
    ChefHat,
    Refrigerator,
    ScanBarcode,
    CalendarRange,
    ShoppingCart,
    Heart
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
// Types
type Tab = 'tracker' | 'recipes' | 'fridge' | 'scanner' | 'planner' | 'shopping' | 'health';

const SCREEN_WIDTH = Dimensions.get('window').width;

import NutritionTracker from './components/NutritionTracker';
import RecipeLibrary from './components/RecipeLibrary';

// ...

import FridgeEngine from './components/FridgeEngine';

// ...

import MealPlanner from './components/MealPlanner';

// ...

import ShoppingList from './components/ShoppingList';

// ...

export default function NutritionScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<Tab>('tracker');
    const [dailyTarget, setDailyTarget] = useState(2500);

    const TABS = [
        { id: 'tracker', icon: Utensils, label: 'Tracker' },
        { id: 'recipes', icon: ChefHat, label: 'Cuisine' },
        { id: 'fridge', icon: Refrigerator, label: 'Frigo' },
        { id: 'scanner', icon: ScanBarcode, label: 'Scan' },
        { id: 'planner', icon: CalendarRange, label: 'Plan' },
        { id: 'shopping', icon: ShoppingCart, label: 'Courses' },
        { id: 'health', icon: Heart, label: 'Santé' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'tracker': return <NutritionTracker />;
            case 'recipes': return <RecipeLibrary />;
            case 'fridge': return <FridgeEngine />;
            case 'scanner':
                // Navigate to Camera Screen (to be built) or Placeholder
                return <View style={styles.placeholder}><Text>Scanner Camera Here</Text></View>;
            case 'planner': return <MealPlanner />;
            case 'shopping': return <ShoppingList />;
            case 'health':
                // We might redirect to the main Health Tab, OR render the Health View here
                return <View style={styles.placeholder}><Text>Health View Integrated</Text></View>;
            default: return <NutritionTracker />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>INGÉNIERIE</Text>
                <Text style={styles.headerSubtitle}>DU CARBURANT.</Text>

                <TouchableOpacity style={styles.targetPill}>
                    <Text style={styles.targetText}>Objectif: {dailyTarget} kcal</Text>
                    <Text style={styles.targetEdit}>(Modifier)</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation Tabs (Grid Layout like Web) */}
            <View style={styles.navContainer}>
                <View style={styles.navGrid}>
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.navButton, isActive && styles.navButtonActive]}
                                onPress={() => setActiveTab(tab.id as Tab)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    size={20}
                                    color={isActive ? colors.text : colors.textSecondary}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <Text style={[styles.navLabel, isActive && styles.navLabelActive]} numberOfLines={1}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Content Area - No Global ScrollView to avoid VirtualizedList errors */}
            <View style={styles.contentArea}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: colors.backgroundSecondary,
        borderBottomWidth: 0, // Removed border for cleaner look
        // Shadow for header
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: fontSize.hero,
        fontWeight: '900',
        fontStyle: 'italic',
        color: colors.text,
        letterSpacing: -1,
        lineHeight: 32,
    },
    headerSubtitle: {
        fontSize: fontSize.hero,
        fontWeight: '900',
        fontStyle: 'italic',
        color: colors.primary,
        letterSpacing: -1,
        lineHeight: 32,
        marginBottom: spacing.sm,
        textShadowColor: 'rgba(212, 175, 55, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    targetPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginTop: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    targetText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    targetEdit: {
        fontSize: fontSize.xs,
        color: colors.primary,
        marginLeft: spacing.xs,
        fontWeight: 'bold',
    },

    // Navigation Grid
    navContainer: {
        backgroundColor: colors.backgroundSecondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        zIndex: 5, // Below header
    },
    navGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.sm, // Increased gap
    },
    navButton: {
        width: (SCREEN_WIDTH - 60) / 4, // Adjusted for gap
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.background, // Slight contrast
    },
    navButtonActive: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        transform: [{ translateY: -2 }], // Lift effect
    },
    navLabel: {
        fontSize: 10,
        color: colors.textMuted,
        marginTop: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    navLabelActive: {
        color: '#000', // Black on Gold
        fontWeight: 'bold',
    },

    contentArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    placeholder: {
        height: 200,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.lg,
    }
});
