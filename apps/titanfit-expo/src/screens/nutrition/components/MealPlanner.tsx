import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../../theme';
import { Calendar, Plus, Clock, MoreVertical, X, ChefHat } from 'lucide-react-native';
import { ALL_RECIPES } from '../../../lib/recipes';

const DAYS = ['LUN', 'MAR', 'MER JEU', 'VEN', 'SAM', 'DIM'];
const SLOTS = [
    { id: 'breakfast', label: 'Petit-Déjeuner' },
    { id: 'lunch', label: 'Déjeuner' },
    { id: 'snack', label: 'Collation' },
    { id: 'dinner', label: 'Dîner' },
];

export default function MealPlanner() {
    const [selectedDay, setSelectedDay] = useState(0); // 0 = Lundi
    const [plan, setPlan] = useState<any>({}); // { "dayIndex-slotId": recipeId }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<string | null>(null);

    const handleAddMeal = (slotId: string) => {
        setActiveSlot(slotId);
        setIsModalOpen(true);
    };

    const selectRecipe = (recipe: any) => {
        if (activeSlot) {
            setPlan({
                ...plan,
                [`${selectedDay}-${activeSlot}`]: recipe
            });
        }
        setIsModalOpen(false);
    };

    const removeMeal = (slotId: string) => {
        const newPlan = { ...plan };
        delete newPlan[`${selectedDay}-${slotId}`];
        setPlan(newPlan);
    };

    const renderSlot = (slot: any) => {
        const recipe = plan[`${selectedDay}-${slot.id}`];

        return (
            <View key={slot.id} style={styles.slotContainer}>
                <Text style={styles.slotLabel}>{slot.label}</Text>

                {recipe ? (
                    <View style={styles.mealCard}>
                        <View style={styles.mealInfo}>
                            <Text style={styles.mealTitle} numberOfLines={1}>{recipe.name}</Text>
                            <Text style={styles.mealMeta}>
                                {recipe.macros.calories} kcal • {recipe.macros.protein}g P
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeMeal(slot.id)}
                        >
                            <X size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.emptySlot}
                        onPress={() => handleAddMeal(slot.id)}
                    >
                        <Plus size={20} color={colors.primary} />
                        <Text style={styles.addText}>Ajouter</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* DATE STRIP */}
            <View style={styles.dateStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                    {DAYS.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayItem,
                                selectedDay === index && styles.dayItemActive
                            ]}
                            onPress={() => setSelectedDay(index)}
                        >
                            <Text style={[
                                styles.dayLabel,
                                selectedDay === index && styles.dayLabelActive
                            ]}>
                                {day}
                            </Text>
                            <View style={[
                                styles.dayIndicator,
                                selectedDay === index && styles.dayIndicatorActive
                            ]} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* MEAL SLOTS */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.dayTitle}>Plan de {DAYS[selectedDay]}</Text>
                    <View style={styles.statsBadge}>
                        <Text style={styles.statsText}>
                            {/* Simple Stats Calculation */}
                            {SLOTS.reduce((acc, slot) => {
                                const r = plan[`${selectedDay}-${slot.id}`];
                                return acc + (r ? r.macros.calories : 0);
                            }, 0)} kcal
                        </Text>
                    </View>
                </View>

                {SLOTS.map(renderSlot)}
            </ScrollView>

            {/* RECIPE SELECTION MODAL */}
            <Modal visible={isModalOpen} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Choisir une recette</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <FlatList
                        data={ALL_RECIPES}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.recipeItem}
                                onPress={() => selectRecipe(item)}
                            >
                                <View style={styles.recipeIcon}>
                                    <ChefHat size={20} color={colors.textSecondary} />
                                </View>
                                <View style={styles.recipeContent}>
                                    <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.recipeMeta}>
                                        {item.macros.calories} kcal • {item.macros.protein}g Protéines
                                    </Text>
                                </View>
                                <Plus size={20} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dateStrip: {
        height: 60,
        backgroundColor: colors.backgroundSecondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dateScroll: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    dayItem: {
        marginRight: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    dayItemActive: {
        // 
    },
    dayLabel: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    dayLabelActive: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    dayIndicator: {
        height: 3,
        width: 20,
        backgroundColor: 'transparent',
        marginTop: 4,
        borderRadius: 2,
    },
    dayIndicatorActive: {
        backgroundColor: colors.primary,
    },

    content: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dayTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.text,
    },
    statsBadge: {
        backgroundColor: colors.backgroundTertiary,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    statsText: {
        fontWeight: 'bold',
        color: colors.text,
    },

    // Slots
    slotContainer: {
        marginBottom: spacing.lg,
    },
    slotLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptySlot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        gap: spacing.sm,
    },
    addText: {
        color: colors.text,
        fontWeight: '600',
    },
    mealCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    mealInfo: {
        flex: 1,
    },
    mealTitle: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: fontSize.md,
        marginBottom: 2,
    },
    mealMeta: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
    },
    removeButton: {
        padding: spacing.sm,
    },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.text,
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    recipeIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.backgroundTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    recipeContent: {
        flex: 1,
    },
    recipeName: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: fontSize.md,
    },
    recipeMeta: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginTop: 2,
    }
});
