import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../../theme';
import healthKitService, { HealthData } from '../../services/healthkit';
import { formatDate, formatNumber } from '../../utils/helpers';

interface HomeScreenProps {
    navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await healthKitService.getAllHealthData();
        setHealthData(data);
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const todayPlan = [
        { time: '08:00', title: 'Petit-dejeuner Proteine', sub: 'Oeufs, Avoine, Fruits', calories: 450 },
        { time: '10:30', title: 'Snack Matin', sub: 'Yaourt grec, Noix', calories: 200 },
        { time: '12:30', title: 'Dejeuner Masse', sub: 'Poulet, Riz, Legumes', calories: 650 },
        { time: '16:00', title: 'Pre-workout', sub: 'Banane, Beurre cacahuete', calories: 250 },
        { time: '18:00', title: 'Entrainement Push', sub: 'Pectoraux, Epaules, Triceps', isWorkout: true },
        { time: '19:30', title: 'Diner Recuperation', sub: 'Saumon, Patate douce', calories: 600 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Bonjour, Titan 💪</Text>
                        <Text style={styles.date}>{formatDate(new Date())}</Text>
                    </View>
                    <TouchableOpacity style={styles.notifButton}>
                        <Text style={styles.notifIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>

                {/* Health Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statValue}>
                            {healthData?.activeEnergy ? formatNumber(healthData.activeEnergy) : '--'}
                        </Text>
                        <Text style={styles.statLabel}>kcal brulees</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>👟</Text>
                        <Text style={styles.statValue}>
                            {healthData?.steps ? formatNumber(healthData.steps) : '--'}
                        </Text>
                        <Text style={styles.statLabel}>pas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>❤️</Text>
                        <Text style={styles.statValue}>
                            {healthData?.heartRate || '--'}
                        </Text>
                        <Text style={styles.statLabel}>bpm</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation?.navigate('Nutrition')}
                    >
                        <Text style={styles.quickActionIcon}>🍽️</Text>
                        <Text style={styles.quickActionLabel}>Log Repas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation?.navigate('Training')}
                    >
                        <Text style={styles.quickActionIcon}>💪</Text>
                        <Text style={styles.quickActionLabel}>Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation?.navigate('Health')}
                    >
                        <Text style={styles.quickActionIcon}>❤️</Text>
                        <Text style={styles.quickActionLabel}>Sante</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <Text style={styles.quickActionIcon}>📊</Text>
                        <Text style={styles.quickActionLabel}>Stats</Text>
                    </TouchableOpacity>
                </View>

                {/* Today's Plan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📅 Plan du jour</Text>
                    {todayPlan.map((item, index) => (
                        <View key={index} style={styles.planCard}>
                            <Text style={styles.planTime}>{item.time}</Text>
                            <View style={styles.planDetails}>
                                <Text style={styles.planTitle}>{item.title}</Text>
                                <Text style={styles.planSub}>{item.sub}</Text>
                            </View>
                            <Text style={styles.planMeta}>
                                {item.isWorkout ? '🏋️' : `${item.calories} kcal`}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Weekly Progress */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Cette semaine</Text>
                    <View style={styles.progressCard}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>Objectif calories</Text>
                            <Text style={styles.progressValue}>85%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '85%' }]} />
                        </View>
                    </View>
                    <View style={styles.progressCard}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>Entrainements</Text>
                            <Text style={styles.progressValue}>4/5</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '80%', backgroundColor: colors.success }]} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
    greeting: { fontSize: fontSize.title, fontWeight: 'bold', color: colors.text },
    date: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
    notifButton: { padding: spacing.sm },
    notifIcon: { fontSize: 24 },

    // Stats
    statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
    statCard: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    statIcon: { fontSize: 28, marginBottom: spacing.xs },
    statValue: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs },

    // Quick Actions
    quickActions: { flexDirection: 'row', marginBottom: spacing.lg },
    quickAction: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    quickActionIcon: { fontSize: 24, marginBottom: spacing.xs },
    quickActionLabel: { fontSize: fontSize.xs, color: colors.textSecondary },

    // Sections
    section: { marginBottom: spacing.lg },
    sectionTitle: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },

    // Plan Card
    planCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    planTime: { color: colors.primary, fontWeight: 'bold', fontSize: fontSize.sm, width: 50 },
    planDetails: { flex: 1 },
    planTitle: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.md },
    planSub: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
    planMeta: { color: colors.textSecondary, fontSize: fontSize.sm },

    // Progress
    progressCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
    progressLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
    progressValue: { color: colors.primary, fontWeight: 'bold' },
    progressBar: { height: 8, backgroundColor: colors.backgroundTertiary, borderRadius: borderRadius.full },
    progressFill: { height: 8, backgroundColor: colors.primary, borderRadius: borderRadius.full },
});
