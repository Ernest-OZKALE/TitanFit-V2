import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../../theme';
import healthKitService, { HealthData } from '../../services/healthkit';
import { formatNumber } from '../../utils/helpers';
import {
    Activity,
    Footprints,
    Heart,
    Flame,
    Moon,
    RefreshCw,
    Scale,
    Info,
    Smartphone,
    CheckCircle2,
    AlertCircle
} from 'lucide-react-native';

export default function HealthScreen() {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHealthKitAvailable, setIsHealthKitAvailable] = useState(false);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        const available = healthKitService.isAvailable();
        setIsHealthKitAvailable(available);
        await loadData();
    };

    const loadData = async () => {
        const data = await healthKitService.getAllHealthData();
        setHealthData(data);
    };

    const refreshData = async () => {
        setIsLoading(true);
        await loadData();
        setIsLoading(false);
        // Haptic feedback would go here
    };

    const requestPermissions = async () => {
        const granted = await healthKitService.requestAuthorization();
        if (granted) {
            Alert.alert('Succès!', 'Accès Apple Santé autorisé');
            loadData();
        } else {
            Alert.alert(
                'Info Développement',
                'En mode Expo Go, HealthKit est simulé.\n\nPour avoir les vraies données, une build de développement (EAS) est requise.',
                [{ text: 'Compris' }]
            );
        }
    };

    const HealthCard = ({ Icon, label, value, unit, color }: any) => (
        <View style={[styles.healthCard, { borderLeftColor: color }]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon size={24} color={color} />
            </View>
            <View style={styles.healthInfo}>
                <Text style={styles.healthLabel}>{label}</Text>
                <Text style={[styles.healthValue, { color }]}>
                    {value !== undefined ? formatNumber(value) : '--'} <Text style={styles.unit}>{unit}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Apple <Text style={styles.titleAccent}>Santé</Text></Text>
                    <Text style={styles.subtitle}>
                        {isHealthKitAvailable ? 'Connecté à HealthKit' : 'Mode Simulation (Expo Go)'}
                    </Text>
                </View>

                {/* Status Banner */}
                <View style={[
                    styles.statusBanner,
                    isHealthKitAvailable ? styles.statusConnected : styles.statusDemo
                ]}>
                    {isHealthKitAvailable ? (
                        <CheckCircle2 size={24} color={colors.success} style={styles.statusIcon} />
                    ) : (
                        <Smartphone size={24} color={colors.info} style={styles.statusIcon} />
                    )}
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusTitle}>
                            {isHealthKitAvailable ? 'HealthKit Actif' : 'Mode Démo Actif'}
                        </Text>
                        <Text style={styles.statusSub}>
                            {isHealthKitAvailable
                                ? 'Synchronisation automatique en temps réel'
                                : 'Données simulées. Build Native requise pour le réel.'}
                        </Text>
                    </View>
                </View>

                {/* Health Data */}
                {healthData && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Métriques du Jour</Text>

                        <HealthCard
                            Icon={Scale}
                            label="Poids"
                            value={healthData.weight}
                            unit="kg"
                            color={colors.info}
                        />
                        <HealthCard
                            Icon={Footprints}
                            label="Pas"
                            value={healthData.steps}
                            unit="pas"
                            color={colors.success}
                        />
                        <HealthCard
                            Icon={Heart}
                            label="Fréquence Cardiaque"
                            value={healthData.heartRate}
                            unit="bpm"
                            color={colors.heart}
                        />
                        <HealthCard
                            Icon={Flame}
                            label="Calories Actives"
                            value={healthData.activeEnergy}
                            unit="kcal"
                            color={colors.calories}
                        />
                        <HealthCard
                            Icon={Moon}
                            label="Sommeil"
                            value={healthData.sleep}
                            unit="h"
                            color={colors.sleep}
                        />
                    </View>
                )}

                {/* Actions */}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={refreshData}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    <RefreshCw size={20} color={colors.background} style={{ marginRight: 8 }} />
                    <Text style={styles.refreshButtonText}>
                        {isLoading ? 'Synchronisation...' : 'Actualiser'}
                    </Text>
                </TouchableOpacity>

                {!isHealthKitAvailable && (
                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={requestPermissions}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.permissionButtonText}>🔐  Simuler l'autorisation</Text>
                    </TouchableOpacity>
                )}

                {/* Technical Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Info size={16} color={colors.textSecondary} />
                            <Text style={styles.infoTitle}>Note Technique</Text>
                        </View>
                        <Text style={styles.infoText}>
                            L'accès réel à Apple Santé nécessite que l'application soit signée avec un certificat Apple Developer (IPA).
                            Dans cet environnement de test (Expo Go), nous utilisons des données fictives pour valider l'interface.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: 100 },
    header: { marginBottom: spacing.lg, marginTop: spacing.md },
    title: { fontSize: fontSize.hero, fontWeight: 'bold', color: colors.text, letterSpacing: -1 },
    titleAccent: { color: colors.primary }, // Orange
    subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },

    // Status Banner
    statusBanner: { flexDirection: 'row', padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg, alignItems: 'center' },
    statusConnected: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
    statusDemo: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
    statusIcon: { marginRight: spacing.md },
    statusInfo: { flex: 1 },
    statusTitle: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.md },
    statusSub: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },

    section: { marginBottom: spacing.lg },
    sectionTitle: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },

    // Health Cards
    healthCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    healthInfo: { flex: 1 },
    healthLabel: { color: colors.textSecondary, fontSize: fontSize.sm, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },
    healthValue: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    unit: { fontSize: fontSize.sm, fontWeight: '500', color: colors.textSecondary },

    // Buttons
    refreshButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        marginBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    refreshButtonText: { color: '#000', fontSize: fontSize.md, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },

    permissionButton: {
        backgroundColor: 'transparent',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
        borderStyle: 'dashed'
    },
    permissionButtonText: { color: colors.textSecondary, fontSize: fontSize.md, fontWeight: '600' },

    // Info Section
    infoSection: { marginTop: spacing.sm },
    infoCard: { backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.md },
    infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, opacity: 0.7 },
    infoTitle: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.sm, marginLeft: spacing.xs },
    infoText: { color: colors.textSecondary, fontSize: fontSize.xs, lineHeight: 18 },
});
