import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import healthKit from '../lib/healthkit';

export default function NutritionScreen({ navigation }) {
    const [healthData, setHealthData] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [healthKitStatus, setHealthKitStatus] = useState('checking');

    // Nutrition goals (loaded from storage)
    const [goals, setGoals] = useState({
        calories: 2500,
        protein: 150,
        carbs: 250,
        fat: 80,
    });

    // Today's logged nutrition
    const [todayNutrition, setTodayNutrition] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    useEffect(() => {
        loadGoals();
        loadTodayNutrition();
        checkHealthKit();
    }, []);

    const loadGoals = async () => {
        try {
            const saved = await AsyncStorage.getItem('titan_nutrition_goals');
            if (saved) setGoals(JSON.parse(saved));
        } catch (e) {
            console.log('Error loading goals:', e);
        }
    };

    const loadTodayNutrition = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const saved = await AsyncStorage.getItem(`titan_nutrition_${today}`);
            if (saved) setTodayNutrition(JSON.parse(saved));
        } catch (e) {
            console.log('Error loading nutrition:', e);
        }
    };

    const checkHealthKit = async () => {
        const available = await healthKit.checkAvailability();
        if (!available) {
            setHealthKitStatus('unavailable');
            // Load mock/saved data instead
            loadSavedHealthData();
            return;
        }

        const authorized = await healthKit.requestAuthorization();
        if (authorized) {
            setHealthKitStatus('connected');
            refreshHealthData();
        } else {
            setHealthKitStatus('denied');
        }
    };

    const loadSavedHealthData = async () => {
        try {
            const saved = await AsyncStorage.getItem('titan_health_data');
            if (saved) {
                setHealthData(JSON.parse(saved));
            } else {
                // Demo data for testing
                setHealthData({
                    weight: { value: 75, unit: 'kg' },
                    steps: { value: 8500 },
                    heartRate: { value: 72, unit: 'bpm' },
                    activeEnergy: { value: 450, unit: 'kcal' },
                    sleep: { value: 7.5, unit: 'hours' },
                    lastSync: new Date().toISOString(),
                });
            }
        } catch (e) {
            console.log('Error loading health data:', e);
        }
    };

    const refreshHealthData = async () => {
        setIsRefreshing(true);
        try {
            const data = await healthKit.getAllHealthData();
            setHealthData(data);
            // Save for offline access
            await AsyncStorage.setItem('titan_health_data', JSON.stringify(data));
        } catch (e) {
            console.error('Error refreshing health data:', e);
        }
        setIsRefreshing(false);
    };

    const onRefresh = () => {
        if (healthKitStatus === 'connected') {
            refreshHealthData();
        } else {
            loadSavedHealthData();
            setIsRefreshing(false);
        }
    };

    const MacroCard = ({ label, current, goal, color, unit = '' }) => {
        const percentage = Math.min((current / goal) * 100, 100);
        return (
            <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>{label}</Text>
                <Text style={[styles.macroValue, { color }]}>
                    {current}{unit}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${percentage}%`, backgroundColor: color }
                        ]}
                    />
                </View>
                <Text style={styles.macroGoal}>/ {goal}{unit}</Text>
            </View>
        );
    };

    const HealthCard = ({ label, value, unit, icon, color }) => (
        <View style={[styles.healthCard, { borderLeftColor: color }]}>
            <Text style={styles.healthIcon}>{icon}</Text>
            <View>
                <Text style={styles.healthLabel}>{label}</Text>
                <Text style={[styles.healthValue, { color }]}>
                    {value} <Text style={styles.healthUnit}>{unit}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>FUEL COMMAND</Text>
                    <Text style={styles.subtitle}>Ingénierie du Carburant</Text>
                </View>

                {/* HEALTHKIT STATUS */}
                <TouchableOpacity
                    style={[
                        styles.statusBanner,
                        healthKitStatus === 'connected' ? styles.statusConnected :
                            healthKitStatus === 'unavailable' ? styles.statusUnavailable :
                                styles.statusPending
                    ]}
                    onPress={checkHealthKit}
                >
                    <Text style={styles.statusIcon}>
                        {healthKitStatus === 'connected' ? '✅' :
                            healthKitStatus === 'unavailable' ? '⚠️' : '🔄'}
                    </Text>
                    <View style={styles.statusText}>
                        <Text style={styles.statusTitle}>
                            {healthKitStatus === 'connected' ? 'Apple Santé Connecté' :
                                healthKitStatus === 'unavailable' ? 'Apple Santé Non Disponible' :
                                    'Connexion en cours...'}
                        </Text>
                        <Text style={styles.statusSubtitle}>
                            {healthKitStatus === 'unavailable' && Platform.OS === 'ios'
                                ? 'Nécessite un build natif (pas Expo Go)'
                                : healthKitStatus === 'unavailable' && Platform.OS === 'android'
                                    ? 'Utilisez Google Fit sur Android'
                                    : 'Tap pour synchroniser'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* MACROS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Macros du Jour</Text>
                    <View style={styles.macrosGrid}>
                        <MacroCard
                            label="Calories"
                            current={todayNutrition.calories}
                            goal={goals.calories}
                            color="#FF6B6B"
                            unit=" kcal"
                        />
                        <MacroCard
                            label="Protéines"
                            current={todayNutrition.protein}
                            goal={goals.protein}
                            color="#4ECDC4"
                            unit="g"
                        />
                        <MacroCard
                            label="Glucides"
                            current={todayNutrition.carbs}
                            goal={goals.carbs}
                            color="#FFE66D"
                            unit="g"
                        />
                        <MacroCard
                            label="Lipides"
                            current={todayNutrition.fat}
                            goal={goals.fat}
                            color="#A78BFA"
                            unit="g"
                        />
                    </View>
                </View>

                {/* HEALTH DATA SECTION */}
                {healthData && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>❤️ Données Santé</Text>
                        <View style={styles.healthGrid}>
                            {healthData.weight && (
                                <HealthCard
                                    label="Poids"
                                    value={healthData.weight.value}
                                    unit="kg"
                                    icon="⚖️"
                                    color="#3B82F6"
                                />
                            )}
                            {healthData.steps && (
                                <HealthCard
                                    label="Pas"
                                    value={healthData.steps.value.toLocaleString()}
                                    unit=""
                                    icon="👟"
                                    color="#10B981"
                                />
                            )}
                            {healthData.heartRate && (
                                <HealthCard
                                    label="Cœur"
                                    value={healthData.heartRate.value}
                                    unit="bpm"
                                    icon="❤️"
                                    color="#EF4444"
                                />
                            )}
                            {healthData.activeEnergy && (
                                <HealthCard
                                    label="Brûlées"
                                    value={healthData.activeEnergy.value}
                                    unit="kcal"
                                    icon="🔥"
                                    color="#F59E0B"
                                />
                            )}
                            {healthData.sleep && (
                                <HealthCard
                                    label="Sommeil"
                                    value={healthData.sleep.value}
                                    unit="h"
                                    icon="🌙"
                                    color="#8B5CF6"
                                />
                            )}
                        </View>

                        {healthData.lastSync && (
                            <Text style={styles.lastSync}>
                                Dernière sync: {new Date(healthData.lastSync).toLocaleTimeString('fr-FR')}
                            </Text>
                        )}
                    </View>
                )}

                {/* QUICK ACTIONS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>🍽️</Text>
                            <Text style={styles.actionLabel}>Log Repas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>💧</Text>
                            <Text style={styles.actionLabel}>Eau</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📷</Text>
                            <Text style={styles.actionLabel}>Scanner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📅</Text>
                            <Text style={styles.actionLabel}>Plan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFD700',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 15,
        borderRadius: 16,
    },
    statusConnected: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        borderColor: '#10B981',
    },
    statusUnavailable: {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    statusPending: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    statusIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    statusText: {
        flex: 1,
    },
    statusTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    statusSubtitle: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    section: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 15,
    },
    macrosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    macroCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        width: '47%',
    },
    macroLabel: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    macroValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    macroGoal: {
        color: '#555',
        fontSize: 12,
        marginTop: 6,
    },
    healthGrid: {
        gap: 12,
    },
    healthCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
    },
    healthIcon: {
        fontSize: 28,
        marginRight: 16,
    },
    healthLabel: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    healthValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    healthUnit: {
        fontSize: 14,
        fontWeight: '400',
    },
    lastSync: {
        color: '#555',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 15,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        width: '22%',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionLabel: {
        color: '#888',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
