import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.welcome}>Bonjour, Titan 💪</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>

                {/* STATS CARDS */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statValue}>1,850</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>💪</Text>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⚡</Text>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Objectif</Text>
                    </View>
                </View>

                {/* TODAY'S PLAN */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📅 Aujourd'hui</Text>
                    <View style={styles.planCard}>
                        <Text style={styles.planTime}>08:00</Text>
                        <View style={styles.planDetails}>
                            <Text style={styles.planTitle}>Petit-déjeuner Protéiné</Text>
                            <Text style={styles.planSub}>Oeufs, Avoine, Fruits</Text>
                        </View>
                        <Text style={styles.planCals}>450 kcal</Text>
                    </View>
                    <View style={styles.planCard}>
                        <Text style={styles.planTime}>12:30</Text>
                        <View style={styles.planDetails}>
                            <Text style={styles.planTitle}>Déjeuner Prise de Masse</Text>
                            <Text style={styles.planSub}>Poulet, Riz, Légumes</Text>
                        </View>
                        <Text style={styles.planCals}>650 kcal</Text>
                    </View>
                    <View style={styles.planCard}>
                        <Text style={styles.planTime}>18:00</Text>
                        <View style={styles.planDetails}>
                            <Text style={styles.planTitle}>Entraînement - Push</Text>
                            <Text style={styles.planSub}>Pectoraux, Épaules, Triceps</Text>
                        </View>
                        <Text style={styles.planCals}>🏋️</Text>
                    </View>
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionIcon}>🍽️</Text>
                            <Text style={styles.actionLabel}>Log</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionIcon}>💧</Text>
                            <Text style={styles.actionLabel}>Eau</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionIcon}>🏋️</Text>
                            <Text style={styles.actionLabel}>Workout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionIcon}>📊</Text>
                            <Text style={styles.actionLabel}>Stats</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    content: { paddingBottom: 100 },
    header: { paddingHorizontal: 20, paddingTop: 20 },
    welcome: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    date: { fontSize: 14, color: '#888', marginTop: 4 },
    statsGrid: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 25 },
    statCard: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFD700' },
    statLabel: { fontSize: 11, color: '#888', marginTop: 4 },
    section: { marginHorizontal: 20, marginTop: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
    planCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    planTime: { color: '#FFD700', fontWeight: 'bold', fontSize: 12, width: 50 },
    planDetails: { flex: 1 },
    planTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    planSub: { color: '#666', fontSize: 12, marginTop: 2 },
    planCals: { color: '#888', fontSize: 12, fontWeight: '600' },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    actionBtn: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, alignItems: 'center', width: '22%' },
    actionIcon: { fontSize: 28, marginBottom: 8 },
    actionLabel: { color: '#888', fontSize: 10, fontWeight: 'bold' },
});
