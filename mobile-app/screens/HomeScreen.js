import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const { user, profile, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to TitanFit!</Text>
            <Text style={styles.subtitle}>
                {profile?.username || user?.email}
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎯 Your Dashboard</Text>
                <Text style={styles.cardText}>
                    This is where your fitness journey begins.
                </Text>
                <Text style={styles.cardText}>
                    Coming soon: Food logging, AI coaching, and more!
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 48,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    cardText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 8,
        lineHeight: 24,
    },
    logoutButton: {
        marginTop: 32,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
