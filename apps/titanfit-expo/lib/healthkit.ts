// HealthKit service for reading Apple Health data
// Note: Real HealthKit requires native build with react-native-health
// This version provides mock data for Expo Go testing

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HealthData {
    weight?: { value: number; unit: string; date: string };
    steps?: { value: number; date: string };
    heartRate?: { value: number; unit: string; date: string };
    activeEnergy?: { value: number; unit: string; date: string };
    sleep?: { value: number; unit: string; date: string };
    lastSync?: string;
}

class HealthKitService {
    isAvailable: boolean = false;
    isAuthorized: boolean = false;

    async checkAvailability(): Promise<boolean> {
        // HealthKit only works on iOS with native build
        if (Platform.OS !== 'ios') {
            console.log('[HealthKit] Android detected - use Google Fit');
            return false;
        }

        // In Expo Go, HealthKit is not available
        console.log('[HealthKit] Expo Go mode - using mock data');
        return false;
    }

    async requestAuthorization(): Promise<boolean> {
        if (!this.isAvailable) {
            return false;
        }
        this.isAuthorized = true;
        return true;
    }

    // Get all health data (mock for Expo Go)
    async getAllHealthData(): Promise<HealthData> {
        // Try to load saved data first
        try {
            const saved = await AsyncStorage.getItem('titan_health_data');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('[HealthKit] No saved data');
        }

        // Return demo data for testing
        const demoData: HealthData = {
            weight: { value: 75, unit: 'kg', date: new Date().toISOString() },
            steps: { value: Math.floor(Math.random() * 5000) + 5000, date: new Date().toISOString() },
            heartRate: { value: Math.floor(Math.random() * 20) + 65, unit: 'bpm', date: new Date().toISOString() },
            activeEnergy: { value: Math.floor(Math.random() * 200) + 300, unit: 'kcal', date: new Date().toISOString() },
            sleep: { value: Math.round((Math.random() * 2 + 6) * 10) / 10, unit: 'hours', date: new Date().toISOString() },
            lastSync: new Date().toISOString(),
        };

        // Save for persistence
        await AsyncStorage.setItem('titan_health_data', JSON.stringify(demoData));

        return demoData;
    }

    // Save weight manually
    async saveWeight(weightKg: number): Promise<boolean> {
        try {
            const data = await this.getAllHealthData();
            data.weight = { value: weightKg, unit: 'kg', date: new Date().toISOString() };
            data.lastSync = new Date().toISOString();
            await AsyncStorage.setItem('titan_health_data', JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    }
}

export const healthKit = new HealthKitService();
export default healthKit;
