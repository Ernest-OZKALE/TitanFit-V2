import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    TextInput,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import healthKit, { HealthData } from '../lib/healthkit';

interface MacroGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface TodayNutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export default function NutritionScreen() {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [mealInput, setMealInput] = useState('');

    const [goals, setGoals] = useState<MacroGoals>({
        calories: 2500,
        protein: 150,
        carbs: 250,
        fat: 80,
    });

    const [todayNutrition, setTodayNutrition] = useState<TodayNutrition>({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    useEffect(() => {
        loadGoals();
        loadTodayNutrition();
        refreshHealthData();
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

    const refreshHealthData = async () => {
        setIsRefreshing(true);
        try {
            const data = await healthKit.getAllHealthData();
            setHealthData(data);
        } catch (e) {
            console.error('Error refreshing:', e);
        }
        setIsRefreshing(false);
    };

    const logMeal = async () => {
        if (!mealInput.trim()) return;

        const calories = Math.floor(Math.random() * 400) + 200;
        const protein = Math.floor(Math.random() * 30) + 10;
        const carbs = Math.floor(Math.random() * 50) + 20;
        const fat = Math.floor(Math.random() * 20) + 5;

        const newNutrition = {
            calories: todayNutrition.calories + calories,
            protein: todayNutrition.protein + protein,
            carbs: todayNutrition.carbs + carbs,
            fat: todayNutrition.fat + fat,
        };

        setTodayNutrition(newNutrition);

        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem(`titan_nutrition_${today}`, JSON.stringify(newNutrition));

        setMealInput('');
        setShowLogModal(false);
    };

    const MacroCard = ({ label, current, goal, color, unit = '' }: {
        label: string;
        current: number;
        goal: number;
        color: string;
        unit?: string;
    }) => {
        const percentage = Math.min((current / goal) * 100, 100);
        return (
            <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>{label}</Text>
                <Text style={[styles.macroValue, { color }]}>
                    {current}{unit}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]}
                    />
                </View>
                <Text style={styles.macroGoal}>/ {goal}{unit}</Text>
            </View>
        );
    };

    const HealthCard = ({ label, value, unit, icon, color }: {
        label: string;
        value: number | string;
        unit: string;
        icon: string;
        color: string;
    }) => (
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
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refreshHealthData}
                        tintColor="#FFD700"
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>TITAN<Text style={styles.titleAccent}>FIT</Text></Text>
                    <Text style={styles.subtitle}>Fuel Command</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Macros du Jour</Text>
                    <View style={styles.macrosGrid}>
                        <MacroCard label="Calories" current={todayNutrition.calories} goal={goals.calories} color="#FF6B6B" unit=" kcal" />
                        <MacroCard label="Proteines" current={todayNutrition.protein} goal={goals.protein} color="#4ECDC4" unit="g" />
                        <MacroCard label="Glucides" current={todayNutrition.carbs} goal={goals.carbs} color="#FFE66D" unit="g" />
                        <MacroCard label="Lipides" current={todayNutrition.fat} goal={goals.fat} color="#A78BFA" unit="g" />
                    </View>
                </View>

                {healthData && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Donnees Sante</Text>
                        <View style={styles.healthGrid}>
                            {healthData.weight && (
                                <HealthCard label="Poids" value={healthData.weight.value} unit="kg" icon="⚖️" color="#3B82F6" />
                            )}
                            {healthData.steps && (
                                <HealthCard label="Pas" value={healthData.steps.value.toLocaleString()} unit="" icon="👟" color="#10B981" />
                            )}
                            {healthData.heartRate && (
                                <HealthCard label="Coeur" value={healthData.heartRate.value} unit="bpm" icon="❤️" color="#EF4444" />
                            )}
                            {healthData.activeEnergy && (
                                <HealthCard label="Brulees" value={healthData.activeEnergy.value} unit="kcal" icon="🔥" color="#F59E0B" />
                            )}
                        </View>
                        {healthData.lastSync && (
                            <Text style={styles.lastSync}>
                                Sync: {new Date(healthData.lastSync).toLocaleTimeString('fr-FR')}
                            </Text>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.logButton}
                    onPress={() => setShowLogModal(true)}
                >
                    <Text style={styles.logButtonText}>+ LOG REPAS</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showLogModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un repas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Poulet grille, riz, legumes..."
                            placeholderTextColor="#666"
                            value={mealInput}
                            onChangeText={setMealInput}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowLogModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={logMeal}
                            >
                                <Text style={styles.confirmButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    scrollContent: { paddingBottom: 100 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
    titleAccent: { color: '#FFD700' },
    subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
    section: { marginHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
    macrosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    macroCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, width: '47%', marginBottom: 12 },
    macroLabel: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 4 },
    macroValue: { fontSize: 28, fontWeight: 'bold' },
    progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
    progressFill: { height: 6, borderRadius: 3 },
    macroGoal: { color: '#555', fontSize: 12, marginTop: 6 },
    healthGrid: {},
    healthCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, marginBottom: 12 },
    healthIcon: { fontSize: 28, marginRight: 16 },
    healthLabel: { color: '#888', fontSize: 12, fontWeight: '600' },
    healthValue: { fontSize: 24, fontWeight: 'bold' },
    healthUnit: { fontSize: 14, fontWeight: 'normal' },
    lastSync: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 15 },
    logButton: { backgroundColor: '#FFD700', marginHorizontal: 20, marginTop: 30, padding: 18, borderRadius: 16, alignItems: 'center' },
    logButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    input: { backgroundColor: '#0A0A0A', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, minHeight: 100 },
    modalButtons: { flexDirection: 'row', marginTop: 20 },
    cancelButton: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center', marginRight: 6 },
    cancelButtonText: { color: '#888', fontWeight: 'bold' },
    confirmButton: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#FFD700', alignItems: 'center', marginLeft: 6 },
    confirmButtonText: { color: '#000', fontWeight: 'bold' },
});
