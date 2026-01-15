// HealthKit Service for TitanFit
// Real implementation for native builds
// Falls back to simulated data in Expo Go

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Health data types
export interface HealthData {
    weight?: number;
    steps?: number;
    heartRate?: number;
    activeEnergy?: number;
    restingEnergy?: number;
    sleep?: number;
    water?: number;
    lastSync: string;
}

export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
}

// Check if we're in a native build with HealthKit
let AppleHealthKit: any = null;
let isHealthKitAvailable = false;

// Try to import react-native-health (only works in native builds)
try {
    // This will fail in Expo Go but work in development builds
    AppleHealthKit = require('react-native-health').default;
    isHealthKitAvailable = Platform.OS === 'ios';
} catch (e) {
    console.log('[HealthKit] Not available - using simulated data');
    isHealthKitAvailable = false;
}

// Permissions we want to read/write
const HEALTH_PERMISSIONS = {
    permissions: {
        read: [
            'Weight',
            'BodyMassIndex',
            'BodyFatPercentage',
            'StepCount',
            'DistanceWalkingRunning',
            'ActiveEnergyBurned',
            'BasalEnergyBurned',
            'HeartRate',
            'RestingHeartRate',
            'SleepAnalysis',
            'Water',
        ],
        write: [
            'Weight',
            'Water',
            'DietaryEnergyConsumed',
            'DietaryProtein',
            'DietaryCarbohydrates',
            'DietaryFatTotal',
            'DietaryFiber',
            'DietarySugar',
        ],
    },
};

class HealthKitService {
    private isAuthorized = false;

    // Check if HealthKit is available on this device
    isAvailable(): boolean {
        return isHealthKitAvailable;
    }

    // Request authorization for HealthKit
    async requestAuthorization(): Promise<boolean> {
        if (!isHealthKitAvailable || !AppleHealthKit) {
            console.log('[HealthKit] Not available, using simulated data');
            return false;
        }

        return new Promise((resolve) => {
            AppleHealthKit.initHealthKit(HEALTH_PERMISSIONS, (error: any) => {
                if (error) {
                    console.error('[HealthKit] Authorization error:', error);
                    resolve(false);
                } else {
                    console.log('[HealthKit] Authorization granted!');
                    this.isAuthorized = true;
                    resolve(true);
                }
            });
        });
    }

    // Get all health data
    async getAllHealthData(): Promise<HealthData> {
        if (!this.isAuthorized || !AppleHealthKit) {
            return this.getSimulatedData();
        }

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        const [weight, steps, heartRate, activeEnergy, sleep] = await Promise.all([
            this.getLatestWeight(),
            this.getTodaySteps(startOfDay),
            this.getLatestHeartRate(),
            this.getTodayActiveEnergy(startOfDay),
            this.getLastNightSleep(),
        ]);

        const data: HealthData = {
            weight,
            steps,
            heartRate,
            activeEnergy,
            sleep,
            lastSync: new Date().toISOString(),
        };

        // Cache the data
        await AsyncStorage.setItem('titan_health_data', JSON.stringify(data));

        return data;
    }

    // Get latest weight
    private getLatestWeight(): Promise<number | undefined> {
        return new Promise((resolve) => {
            AppleHealthKit.getLatestWeight({}, (err: any, result: any) => {
                if (err || !result) {
                    resolve(undefined);
                } else {
                    resolve(Math.round(result.value * 10) / 10);
                }
            });
        });
    }

    // Get today's steps
    private getTodaySteps(startDate: Date): Promise<number | undefined> {
        return new Promise((resolve) => {
            AppleHealthKit.getStepCount(
                { date: startDate.toISOString() },
                (err: any, result: any) => {
                    if (err || !result) {
                        resolve(undefined);
                    } else {
                        resolve(Math.round(result.value));
                    }
                }
            );
        });
    }

    // Get latest heart rate
    private getLatestHeartRate(): Promise<number | undefined> {
        return new Promise((resolve) => {
            AppleHealthKit.getHeartRateSamples(
                {
                    limit: 1,
                    ascending: false,
                },
                (err: any, results: any[]) => {
                    if (err || !results || results.length === 0) {
                        resolve(undefined);
                    } else {
                        resolve(Math.round(results[0].value));
                    }
                }
            );
        });
    }

    // Get today's active energy
    private getTodayActiveEnergy(startDate: Date): Promise<number | undefined> {
        return new Promise((resolve) => {
            AppleHealthKit.getActiveEnergyBurned(
                { date: startDate.toISOString() },
                (err: any, result: any) => {
                    if (err || !result) {
                        resolve(undefined);
                    } else {
                        resolve(Math.round(result.value));
                    }
                }
            );
        });
    }

    // Get last night's sleep
    private getLastNightSleep(): Promise<number | undefined> {
        return new Promise((resolve) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(18, 0, 0, 0);

            AppleHealthKit.getSleepSamples(
                {
                    startDate: yesterday.toISOString(),
                },
                (err: any, results: any[]) => {
                    if (err || !results || results.length === 0) {
                        resolve(undefined);
                    } else {
                        // Calculate total sleep in hours
                        let totalMinutes = 0;
                        results.forEach((sample: any) => {
                            if (sample.value === 'ASLEEP' || sample.value === 'INBED') {
                                const start = new Date(sample.startDate).getTime();
                                const end = new Date(sample.endDate).getTime();
                                totalMinutes += (end - start) / 60000;
                            }
                        });
                        resolve(Math.round((totalMinutes / 60) * 10) / 10);
                    }
                }
            );
        });
    }

    // Save weight to HealthKit
    async saveWeight(weightKg: number): Promise<boolean> {
        if (!this.isAuthorized || !AppleHealthKit) {
            console.log('[HealthKit] Cannot save - not authorized');
            return false;
        }

        return new Promise((resolve) => {
            AppleHealthKit.saveWeight(
                { value: weightKg },
                (err: any) => {
                    if (err) {
                        console.error('[HealthKit] Save weight error:', err);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    // Save nutrition to HealthKit
    async saveNutrition(nutrition: NutritionData): Promise<boolean> {
        if (!this.isAuthorized || !AppleHealthKit) {
            console.log('[HealthKit] Cannot save - not authorized');
            return false;
        }

        // Save each nutrition value
        const promises = [
            this.saveSingleNutrient('DietaryEnergyConsumed', nutrition.calories),
            this.saveSingleNutrient('DietaryProtein', nutrition.protein),
            this.saveSingleNutrient('DietaryCarbohydrates', nutrition.carbs),
            this.saveSingleNutrient('DietaryFatTotal', nutrition.fat),
        ];

        const results = await Promise.all(promises);
        return results.every((r) => r);
    }

    private saveSingleNutrient(type: string, value: number): Promise<boolean> {
        return new Promise((resolve) => {
            const sampleType = `HKQuantityTypeIdentifier${type}`;
            AppleHealthKit.saveSample(
                {
                    type: sampleType,
                    value: value,
                    date: new Date().toISOString(),
                },
                (err: any) => {
                    resolve(!err);
                }
            );
        });
    }

    // Save water intake
    async saveWater(liters: number): Promise<boolean> {
        if (!this.isAuthorized || !AppleHealthKit) {
            return false;
        }

        return new Promise((resolve) => {
            AppleHealthKit.saveWater(
                { value: liters },
                (err: any) => {
                    resolve(!err);
                }
            );
        });
    }

    // Generate simulated data for demo/Expo Go
    private getSimulatedData(): HealthData {
        return {
            weight: Math.round((70 + Math.random() * 15) * 10) / 10,
            steps: Math.floor(Math.random() * 8000) + 4000,
            heartRate: Math.floor(Math.random() * 25) + 60,
            activeEnergy: Math.floor(Math.random() * 300) + 200,
            sleep: Math.round((6 + Math.random() * 3) * 10) / 10,
            lastSync: new Date().toISOString(),
        };
    }

    // Load cached data
    async getCachedData(): Promise<HealthData | null> {
        try {
            const cached = await AsyncStorage.getItem('titan_health_data');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }
}

// Export singleton instance
export const healthKitService = new HealthKitService();
export default healthKitService;
