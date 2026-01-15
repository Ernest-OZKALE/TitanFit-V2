// Storage keys and utility functions
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'titan_auth_token',
    USER_ID: 'titan_user_id',
    USER_PROFILE: 'titan_user_profile',
    HEALTH_DATA: 'titan_health_data',
    NUTRITION_GOALS: 'titan_nutrition_goals',
    TODAY_NUTRITION: 'titan_nutrition_today',
    MEAL_PLAN: 'titan_meal_plan',
    ONBOARDING_COMPLETE: 'titan_onboarding_complete',
    THEME: 'titan_theme',
};

// Storage helper functions
export const storage = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    },

    async set(key: string, value: any): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    },
};

// Date helpers
export const formatDate = (date: Date, locale = 'fr-FR') => {
    return date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
};

export const formatTime = (date: Date | string, locale = 'fr-FR') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getToday = () => new Date().toISOString().split('T')[0];

// Nutrition helpers
export const calculateMacroPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
};

export const getMacroColor = (macro: 'calories' | 'protein' | 'carbs' | 'fat') => {
    const colors = {
        calories: '#FF6B6B',
        protein: '#4ECDC4',
        carbs: '#FFE66D',
        fat: '#A78BFA',
    };
    return colors[macro];
};

// Number formatting
export const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
};
