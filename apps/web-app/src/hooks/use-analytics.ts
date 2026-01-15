'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, trackPageView } from '@/lib/analytics';
import { useAuth } from '@/lib/auth-context';

/**
 * Analytics Hook for TitanFit V2
 * Provides easy access to analytics functions and handles automatic page tracking
 */
export function useAnalytics() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Track page views automatically on route change
    useEffect(() => {
        if (pathname) {
            const pageTitle = document.title || 'TitanFit';
            trackPageView(pathname, pageTitle);
        }
    }, [pathname]);

    // Set user properties when user changes
    useEffect(() => {
        if (user) {
            // Fetch user data and set properties
            // This could be extended to fetch from your profiles table
            analytics.setUserProperties({
                is_premium: false, // Update from actual user data
            });
        }
    }, [user?.id]);

    // Memoized tracking functions
    const trackWorkout = useCallback((workoutType: string, duration: number, exerciseCount: number) => {
        analytics.trackWorkoutCompleted({ workoutType, duration, exerciseCount });
    }, []);

    const trackMeal = useCallback((mealType: string, calories: number, protein: number) => {
        analytics.trackMealLogged({ mealType, calories, protein });
    }, []);

    const trackFeature = useCallback((featureName: string) => {
        analytics.trackFeatureUsed(featureName);
    }, []);

    const trackAchievement = useCallback((name: string, xp: number) => {
        analytics.trackAchievementUnlocked(name, xp);
    }, []);

    const trackCheckout = useCallback(() => {
        analytics.trackCheckoutInitiated();
    }, []);

    const trackError = useCallback((type: string, message: string) => {
        analytics.trackError(type, message);
    }, []);

    return {
        // Core tracking
        trackWorkout,
        trackMeal,
        trackFeature,
        trackAchievement,
        trackCheckout,
        trackError,
        // Full analytics object for advanced usage
        analytics,
    };
}

/**
 * Analytics Provider Component (optional wrapper)
 * Can be used to provide analytics context to the entire app
 */
export function AnalyticsProvider({children}: { children: React.ReactNode }) {
    // Initialize analytics on mount
    useEffect(() => {
        console.log('[Analytics] Provider initialized');
    }, []);

    return <>{children} </>;
}

