import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../../theme';
import { Plus, ChevronRight, Flame, ScanBarcode, Utensils, ChefHat, Refrigerator } from 'lucide-react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { NutritionPlan } from '../../../lib/nutrition-calculations';

// Mock Data (will be replaced by real storage)
const MOCK_TOTALS = {
    calories: 1450,
    protein: 110,
    carbs: 150,
    fat: 45
};

const MOCK_TARGETS: NutritionPlan = {
    calories: 2500,
    protein: 180,
    carbs: 250,
    fat: 80
};

export default function NutritionTracker() {
    const [totals, setTotals] = useState(MOCK_TOTALS);
    const [targets, setTargets] = useState(MOCK_TARGETS);

    const percentage = Math.min((totals.calories / targets.calories) * 100, 100);

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* MAIN RING CARD */}
            <View style={styles.ringCard}>
                <View style={styles.ringContainer}>
                    <ProgressRing
                        radius={110} // Bigger
                        stroke={14} // Thicker
                        progress={percentage}
                        color={colors.calories}
                    />
                    <View style={styles.ringContent}>
                        <Flame size={32} color={colors.calories} fill={colors.calories} style={{ opacity: 0.8 }} />
                        <Text style={styles.caloriesValue}>{totals.calories}</Text>
                        <Text style={styles.caloriesLabel}>
                            SUR {targets.calories} KCAL
                        </Text>
                    </View>
                </View>

                {/* MACROS ROW */}
                <View style={styles.macrosRow}>
                    <MacroItem
                        label="Protéines"
                        value={totals.protein}
                        target={targets.protein}
                        color={colors.protein}
                    />
                    <MacroItem
                        label="Glucides"
                        value={totals.carbs}
                        target={targets.carbs}
                        color={colors.carbs}
                    />
                    <MacroItem
                        label="Lipides"
                        value={totals.fat}
                        target={targets.fat}
                        color={colors.fat}
                    />
                </View>
            </View>

            {/* QUICK ACTIONS */}
            <Text style={styles.sectionTitle}>Ajout Rapide</Text>
            <View style={styles.actionGrid}>
                <ActionButton icon={Utensils} label="Repas" color="#6366F1" bgColor="#EEF2FF" />
                <ActionButton icon={ScanBarcode} label="Scan" color="#10B981" bgColor="#ECFDF5" />
                <ActionButton icon={ChefHat} label="Cuisiner" color="#F97316" bgColor="#FFF7ED" />
                <ActionButton icon={Refrigerator} label="Frigo" color="#EC4899" bgColor="#FDF2F8" />
            </View>

            {/* RECENT LOGS (Placeholder) */}
            <Text style={styles.sectionTitle}>Journal Aujourd'hui</Text>
            <View style={styles.emptyLog}>
                <Text style={styles.emptyText}>Aucun aliment enregistré</Text>
                <TouchableOpacity style={styles.addLogButton}>
                    <Text style={styles.addLogText}>Commencer</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function ActionButton({ icon: Icon, label, color, bgColor }: any) {
    return (
        <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: bgColor }]}>
                <Icon size={24} color={color} />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

function ProgressRing({ radius, stroke, progress, color }: any) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View style={{ width: radius * 2, height: radius * 2, transform: [{ rotate: '-90deg' }] }}>
            <Svg height={radius * 2} width={radius * 2}>
                {/* Background Circle */}
                <Circle
                    stroke={colors.border}
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeOpacity={0.5}
                />
                {/* Progress Circle */}
                <Circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" // Rounded ends
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </Svg>
        </View>
    );
}

function MacroItem({ label, value, target, color }: any) {
    const progress = Math.min((value / target) * 100, 100);
    return (
        <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color }]}>{label}</Text>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.macroValue}>{value}g <Text style={styles.macroTarget}>/ {target}</Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        paddingHorizontal: spacing.md,
    },
    ringCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 32, // Extra rounded
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.md,
        // Premium Shadow
        ...shadows.card,
        shadowColor: colors.primary, // Gold tint shadow
        shadowOpacity: 0.08,
    },
    ringContainer: {
        position: 'relative',
        marginBottom: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    caloriesValue: {
        fontSize: fontSize.display,
        fontWeight: '900',
        color: colors.text,
        lineHeight: 50,
        marginTop: 4,
        letterSpacing: -1,
    },
    caloriesLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    macrosRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: spacing.lg,
    },
    macroItem: {
        flex: 1,
        alignItems: 'center',
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    macroValue: {
        fontSize: fontSize.sm,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 4,
    },
    macroTarget: {
        fontSize: 10,
        color: colors.textMuted,
        fontWeight: '400',
    },
    progressBarBg: {
        height: 6,
        width: '100%',
        backgroundColor: colors.backgroundTertiary,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: borderRadius.full,
    },

    // Actions
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: '900', // Titan Bold
        color: colors.text,
        marginBottom: spacing.md,
        marginLeft: spacing.xs,
        fontStyle: 'italic',
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    actionButton: {
        alignItems: 'center',
        width: '23%',
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 24, // Squircle-ish
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        // Light shadow
        ...shadows.card,
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },

    // Empty State
    emptyLog: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: fontSize.md,
        marginBottom: spacing.md,
        fontStyle: 'italic',
    },
    addLogButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        ...shadows.glow,
    },
    addLogText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: fontSize.sm,
    }
});
