// API Service for connecting to TitanFit web backend
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - change this to your deployed URL
const API_BASE_URL = __DEV__
    ? 'http://192.168.1.79:3000'
    : 'https://your-titanfit-production-url.com';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiService {
    private authToken: string | null = null;

    async init() {
        this.authToken = await AsyncStorage.getItem('titan_auth_token');
    }

    // Generic fetch with auth
    private async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
                ...options.headers,
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || 'Request failed' };
            }

            return { success: true, data };
        } catch (error) {
            console.error('[API] Error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async signup(email: string, password: string, name: string) {
        return this.fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    // Nutrition endpoints
    async logMeal(mealData: any) {
        return this.fetch('/api/nutrition/log', {
            method: 'POST',
            body: JSON.stringify(mealData),
        });
    }

    async analyzeMeal(description: string) {
        return this.fetch('/api/nutrition/analyze', {
            method: 'POST',
            body: JSON.stringify({ description }),
        });
    }

    async getRecipes(category?: string) {
        const query = category ? `?category=${category}` : '';
        return this.fetch(`/api/recipes${query}`);
    }

    async scanBarcode(barcode: string) {
        return this.fetch(`/api/nutrition/scan/${barcode}`);
    }

    // Health sync endpoint
    async syncHealthData(userId: string, healthData: any) {
        return this.fetch('/api/health-sync', {
            method: 'POST',
            body: JSON.stringify({ userId, ...healthData }),
        });
    }

    // Training endpoints
    async getWorkouts() {
        return this.fetch('/api/training/workouts');
    }

    async logWorkout(workoutData: any) {
        return this.fetch('/api/training/log', {
            method: 'POST',
            body: JSON.stringify(workoutData),
        });
    }

    // Profile endpoints
    async getProfile() {
        return this.fetch('/api/profile');
    }

    async updateProfile(profileData: any) {
        return this.fetch('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    // Progress endpoints
    async getProgressData(period: 'week' | 'month' | 'year' = 'month') {
        return this.fetch(`/api/progress?period=${period}`);
    }

    // Meal plan endpoints
    async getMealPlan() {
        return this.fetch('/api/nutrition/meal-plan');
    }

    async generateMealPlan(preferences: any) {
        return this.fetch('/api/nutrition/meal-plan/generate', {
            method: 'POST',
            body: JSON.stringify(preferences),
        });
    }

    // Shopping list
    async getShoppingList() {
        return this.fetch('/api/nutrition/shopping-list');
    }
}

export const apiService = new ApiService();
export default apiService;
