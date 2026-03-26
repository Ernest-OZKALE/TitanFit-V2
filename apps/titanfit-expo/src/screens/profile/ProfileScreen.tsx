import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../../theme';
import healthKitService from '../../services/healthkit';
import { formatNumber } from '../../utils/helpers';

export default function ProfileScreen() {
    const [healthData, setHealthData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await healthKitService.getAllHealthData();
        setHealthData(data);
    };

    const profile = {
        name: 'Titan User',
        goal: 'Prise de masse',
        height: 180,
        age: 25,
        activityLevel: 'Actif',
    };

    const goals = {
        calories: 2500,
        protein: 150,
        carbs: 250,
        fat: 80,
        water: 3,
    };

    const achievements = [
        { icon: '🔥', title: '7 jours consecutifs', desc: 'Objectif calories atteint' },
        { icon: '💪', title: '10 entrainements', desc: 'Ce mois-ci' },
        { icon: '⚖️', title: '-2kg', desc: 'Progression' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>🏋️</Text>
                    </View>
                    <Text style={styles.profileName}>{profile.name}</Text>
                    <Text style={styles.profileGoal}>{profile.goal}</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{healthData?.weight || 75}</Text>
                        <Text style={styles.statLabel}>kg</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{profile.height}</Text>
                        <Text style={styles.statLabel}>cm</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{profile.age}</Text>
                        <Text style={styles.statLabel}>ans</Text>
                    </View>
                </View>

                {/* Nutrition Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Objectifs nutritionnels</Text>
                    <View style={styles.goalCard}>
                        <Text style={styles.goalIcon}>🔥</Text>
                        <View style={styles.goalInfo}>
                            <Text style={styles.goalLabel}>Calories</Text>
                            <Text style={styles.goalValue}>{formatNumber(goals.calories)} kcal/jour</Text>
                        </View>
                    </View>
                    <View style={styles.goalCard}>
                        <Text style={styles.goalIcon}>🥩</Text>
                        <View style={styles.goalInfo}>
                            <Text style={styles.goalLabel}>Proteines</Text>
                            <Text style={styles.goalValue}>{goals.protein}g/jour</Text>
                        </View>
                    </View>
                    <View style={styles.goalCard}>
                        <Text style={styles.goalIcon}>🍚</Text>
                        <View style={styles.goalInfo}>
                            <Text style={styles.goalLabel}>Glucides</Text>
                            <Text style={styles.goalValue}>{goals.carbs}g/jour</Text>
                        </View>
                    </View>
                    <View style={styles.goalCard}>
                        <Text style={styles.goalIcon}>🥑</Text>
                        <View style={styles.goalInfo}>
                            <Text style={styles.goalLabel}>Lipides</Text>
                            <Text style={styles.goalValue}>{goals.fat}g/jour</Text>
                        </View>
                    </View>
                    <View style={styles.goalCard}>
                        <Text style={styles.goalIcon}>💧</Text>
                        <View style={styles.goalInfo}>
                            <Text style={styles.goalLabel}>Hydratation</Text>
                            <Text style={styles.goalValue}>{goals.water}L/jour</Text>
                        </View>
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Succes recents</Text>
                    {achievements.map((achievement, index) => (
                        <View key={index} style={styles.achievementCard}>
                            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                            <View style={styles.achievementInfo}>
                                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Parametres</Text>
                    <TouchableOpacity style={styles.settingCard}>
                        <Text style={styles.settingIcon}>👤</Text>
                        <Text style={styles.settingLabel}>Modifier le profil</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingCard}>
                        <Text style={styles.settingIcon}>🎯</Text>
                        <Text style={styles.settingLabel}>Objectifs</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingCard}>
                        <Text style={styles.settingIcon}>❤️</Text>
                        <Text style={styles.settingLabel}>Apple Sante</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingCard}>
                        <Text style={styles.settingIcon}>🔔</Text>
                        <Text style={styles.settingLabel}>Notifications</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingCard}>
                        <Text style={styles.settingIcon}>🌙</Text>
                        <Text style={styles.settingLabel}>Theme</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Deconnexion</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.version}>TitanFit v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: 100 },

    // Profile Header
    profileHeader: { alignItems: 'center', paddingVertical: spacing.lg },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.backgroundSecondary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
    avatar: { fontSize: 48 },
    profileName: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.text },
    profileGoal: { fontSize: fontSize.md, color: colors.primary, marginTop: spacing.xs },

    // Stats Grid
    statsGrid: { flexDirection: 'row', marginBottom: spacing.lg },
    statCard: { flex: 1, backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', marginHorizontal: spacing.xs },
    statValue: { fontSize: fontSize.title, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },

    section: { marginBottom: spacing.lg },
    sectionTitle: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },

    // Goal Cards
    goalCard: { backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    goalIcon: { fontSize: 24, marginRight: spacing.md },
    goalInfo: { flex: 1 },
    goalLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
    goalValue: { color: colors.text, fontSize: fontSize.lg, fontWeight: 'bold', marginTop: spacing.xs },

    // Achievements
    achievementCard: { backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    achievementIcon: { fontSize: 28, marginRight: spacing.md },
    achievementInfo: { flex: 1 },
    achievementTitle: { color: colors.text, fontWeight: 'bold' },
    achievementDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },

    // Settings
    settingCard: { backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    settingIcon: { fontSize: 20, marginRight: spacing.md },
    settingLabel: { flex: 1, color: colors.text, fontSize: fontSize.md },
    settingArrow: { color: colors.textSecondary, fontSize: fontSize.lg },

    // Logout
    logoutButton: { backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: spacing.md },
    logoutButtonText: { color: colors.error, fontWeight: 'bold' },

    // Version
    version: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.lg },
});
