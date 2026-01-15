import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../../theme';

const workouts = [
    {
        id: 1,
        name: 'Push Day',
        muscles: 'Pectoraux, Epaules, Triceps',
        duration: 60,
        exercises: 6,
        icon: '💪',
    },
    {
        id: 2,
        name: 'Pull Day',
        muscles: 'Dos, Biceps, Arriere epaules',
        duration: 55,
        exercises: 6,
        icon: '🏋️',
    },
    {
        id: 3,
        name: 'Leg Day',
        muscles: 'Quadriceps, Ischio, Mollets',
        duration: 65,
        exercises: 7,
        icon: '🦵',
    },
    {
        id: 4,
        name: 'Full Body',
        muscles: 'Tous les groupes musculaires',
        duration: 75,
        exercises: 10,
        icon: '🔥',
    },
];

const exercises = [
    { name: 'Developpe couche', sets: 4, reps: '8-10', weight: 80 },
    { name: 'Developpe incline halteres', sets: 3, reps: '10-12', weight: 30 },
    { name: 'Ecarte poulie', sets: 3, reps: '12-15', weight: 15 },
    { name: 'Developpe militaire', sets: 4, reps: '8-10', weight: 50 },
    { name: 'Elevations laterales', sets: 3, reps: '12-15', weight: 12 },
    { name: 'Triceps poulie', sets: 3, reps: '12-15', weight: 25 },
];

export default function TrainingScreen() {
    const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);

    const openWorkout = (workout: any) => {
        setSelectedWorkout(workout);
        setShowWorkoutModal(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>TITAN<Text style={styles.titleAccent}>TRAINING</Text></Text>
                    <Text style={styles.subtitle}>Programmes d'entrainement</Text>
                </View>

                {/* Today's Workout */}
                <View style={styles.todayCard}>
                    <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>AUJOURD'HUI</Text>
                    </View>
                    <Text style={styles.todayIcon}>💪</Text>
                    <Text style={styles.todayTitle}>Push Day</Text>
                    <Text style={styles.todaySub}>Pectoraux, Epaules, Triceps</Text>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => openWorkout(workouts[0])}
                    >
                        <Text style={styles.startButtonText}>COMMENCER</Text>
                    </TouchableOpacity>
                </View>

                {/* Workouts List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Programmes</Text>
                    {workouts.map((workout) => (
                        <TouchableOpacity
                            key={workout.id}
                            style={styles.workoutCard}
                            onPress={() => openWorkout(workout)}
                        >
                            <Text style={styles.workoutIcon}>{workout.icon}</Text>
                            <View style={styles.workoutInfo}>
                                <Text style={styles.workoutName}>{workout.name}</Text>
                                <Text style={styles.workoutMuscles}>{workout.muscles}</Text>
                            </View>
                            <View style={styles.workoutMeta}>
                                <Text style={styles.workoutDuration}>{workout.duration} min</Text>
                                <Text style={styles.workoutExercises}>{workout.exercises} exos</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cette semaine</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>4</Text>
                            <Text style={styles.statLabel}>Seances</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>3h50</Text>
                            <Text style={styles.statLabel}>Temps total</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>12,500</Text>
                            <Text style={styles.statLabel}>kg souleves</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Workout Detail Modal */}
            <Modal visible={showWorkoutModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalIcon}>{selectedWorkout?.icon}</Text>
                            <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                            <TouchableOpacity onPress={() => setShowWorkoutModal(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSub}>{selectedWorkout?.muscles}</Text>
                        <Text style={styles.modalDuration}>
                            ⏱️ {selectedWorkout?.duration} min | {selectedWorkout?.exercises} exercices
                        </Text>

                        <ScrollView style={styles.exercisesList}>
                            {exercises.map((exercise, index) => (
                                <View key={index} style={styles.exerciseCard}>
                                    <Text style={styles.exerciseNumber}>{index + 1}</Text>
                                    <View style={styles.exerciseInfo}>
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                        <Text style={styles.exerciseDetails}>
                                            {exercise.sets} x {exercise.reps} | {exercise.weight}kg
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.modalStartButton}>
                            <Text style={styles.modalStartButtonText}>🏋️ DEMARRER L'ENTRAINEMENT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: 100 },
    header: { marginBottom: spacing.lg },
    title: { fontSize: fontSize.hero, fontWeight: 'bold', color: colors.text, letterSpacing: 2 },
    titleAccent: { color: colors.primary },
    subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },

    // Today Card
    todayCard: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    todayBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginBottom: spacing.sm },
    todayBadgeText: { color: colors.background, fontSize: fontSize.xs, fontWeight: 'bold' },
    todayIcon: { fontSize: 48, marginBottom: spacing.sm },
    todayTitle: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.background },
    todaySub: { fontSize: fontSize.md, color: 'rgba(0,0,0,0.7)', marginTop: spacing.xs },
    startButton: { backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.lg },
    startButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: fontSize.lg },

    section: { marginBottom: spacing.lg },
    sectionTitle: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },

    // Workout Cards
    workoutCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    workoutIcon: { fontSize: 32, marginRight: spacing.md },
    workoutInfo: { flex: 1 },
    workoutName: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.lg },
    workoutMuscles: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
    workoutMeta: { alignItems: 'flex-end' },
    workoutDuration: { color: colors.primary, fontWeight: 'bold' },
    workoutExercises: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: spacing.xs },

    // Stats
    statsRow: { flexDirection: 'row' },
    statCard: { flex: 1, backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', marginHorizontal: spacing.xs },
    statValue: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.backgroundSecondary, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    modalIcon: { fontSize: 32, marginRight: spacing.sm },
    modalTitle: { flex: 1, fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.text },
    closeButton: { fontSize: 24, color: colors.textSecondary, padding: spacing.sm },
    modalSub: { color: colors.textSecondary, fontSize: fontSize.md },
    modalDuration: { color: colors.primary, fontSize: fontSize.sm, marginTop: spacing.xs, marginBottom: spacing.lg },
    exercisesList: { maxHeight: 300 },
    exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
    exerciseNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, color: colors.background, textAlign: 'center', lineHeight: 30, fontWeight: 'bold', marginRight: spacing.md },
    exerciseInfo: { flex: 1 },
    exerciseName: { color: colors.text, fontWeight: 'bold' },
    exerciseDetails: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
    modalStartButton: { backgroundColor: colors.success, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: spacing.lg },
    modalStartButtonText: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.lg },
});
