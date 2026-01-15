/**
 * Analytics Tracking Service for TitanFit V2
 * Handles custom event tracking for Google Analytics
 */

// Check if window and gtag are available
const isClient = typeof window !== 'undefined';
const gtag = isClient ? (window as any).gtag : undefined;

// Track custom event to Google Analytics
export const trackEvent = (
    eventName: string,
    params?: Record<string, any>
) => {
    if (!isClient || !gtag) {
        console.log('[Analytics] Event (dev):', eventName, params);
        return;
    }

    gtag('event', eventName, params);
};

// ============================================
// WORKOUT EVENTS
// ============================================

export const trackWorkoutStarted = (workoutType: string) => {
    trackEvent('workout_started', {
        event_category: 'Fitness',
        event_label: workoutType,
    });
};

export const trackWorkoutCompleted = (data: {
    workoutType: string;
    duration: number; // minutes
    exerciseCount: number;
}) => {
    trackEvent('workout_completed', {
        event_category: 'Fitness',
        event_label: data.workoutType,
        value: data.duration,
        exercise_count: data.exerciseCount,
    });
};

export const trackExerciseLogged = (exerciseName: string, sets: number) => {
    trackEvent('exercise_logged', {
        event_category: 'Fitness',
        event_label: exerciseName,
        value: sets,
    });
};

// ============================================
// NUTRITION EVENTS
// ============================================

export const trackMealLogged = (data: {
    mealType: string; // breakfast, lunch, dinner, snack
    calories: number;
    protein: number;
}) => {
    trackEvent('meal_logged', {
        event_category: 'Nutrition',
        event_label: data.mealType,
        value: data.calories,
        protein_grams: data.protein,
    });
};

export const trackRecipeGenerated = (ingredientCount: number) => {
    trackEvent('recipe_generated', {
        event_category: 'Nutrition',
        event_label: 'Fridge Alchemist',
        value: ingredientCount,
    });
};

export const trackFoodScanned = (confidence: number) => {
    trackEvent('food_scanned', {
        event_category: 'Nutrition',
        event_label: 'Titan Vision',
        value: confidence,
    });
};

// ============================================
// SUBSCRIPTION EVENTS
// ============================================

export const trackSubscriptionStarted = (planName: string) => {
    trackEvent('subscription_started', {
        event_category: 'Monetization',
        event_label: planName,
    });
};

export const trackSubscriptionCanceled = (reason?: string) => {
    trackEvent('subscription_canceled', {
        event_category: 'Monetization',
        event_label: reason || 'unknown',
    });
};

export const trackCheckoutInitiated = () => {
    trackEvent('checkout_initiated', {
        event_category: 'Monetization',
    });
};

// ============================================
// FEATURE USAGE EVENTS
// ============================================

export const trackFeatureUsed = (featureName: string) => {
    trackEvent('feature_used', {
        event_category: 'Engagement',
        event_label: featureName,
    });
};

export const trackAICoachMessage = () => {
    trackEvent('ai_coach_message', {
        event_category: 'Engagement',
        event_label: 'AI Coach',
    });
};

export const trackAchievementUnlocked = (achievementName: string, xp: number) => {
    trackEvent('achievement_unlocked', {
        event_category: 'Gamification',
        event_label: achievementName,
        value: xp,
    });
};

export const trackStreakMilestone = (days: number) => {
    trackEvent('streak_milestone', {
        event_category: 'Gamification',
        event_label: `${days} days`,
        value: days,
    });
};

// ============================================
// SOCIAL EVENTS
// ============================================

export const trackPostCreated = (postType: string) => {
    trackEvent('post_created', {
        event_category: 'Social',
        event_label: postType,
    });
};

export const trackPostLiked = () => {
    trackEvent('post_liked', {
        event_category: 'Social',
    });
};

// ============================================
// ERROR TRACKING
// ============================================

export const trackError = (errorType: string, errorMessage: string) => {
    trackEvent('app_error', {
        event_category: 'Error',
        event_label: errorType,
        error_message: errorMessage,
    });
};

export const trackAPIError = (endpoint: string, statusCode: number) => {
    trackEvent('api_error', {
        event_category: 'Error',
        event_label: endpoint,
        value: statusCode,
    });
};

// ============================================
// PAGE VIEW TRACKING
// ============================================

export const trackPageView = (pagePath: string, pageTitle: string) => {
    if (!isClient || !gtag) return;

    gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
    });
};

// ============================================
// USER PROPERTIES
// ============================================

export const setUserProperties = (properties: {
    is_premium?: boolean;
    plan_name?: string;
    signup_date?: string;
    total_workouts?: number;
}) => {
    if (!isClient || !gtag) return;

    gtag('set', 'user_properties', properties);
};

// ============================================
// CONVERSION TRACKING
// ============================================

export const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
        event_category: 'Conversion',
        event_label: conversionType,
        value: value || 0,
    });
};

// Export all analytics functions
export const analytics = {
    // Workout
    trackWorkoutStarted,
    trackWorkoutCompleted,
    trackExerciseLogged,
    // Nutrition
    trackMealLogged,
    trackRecipeGenerated,
    trackFoodScanned,
    // Subscription
    trackSubscriptionStarted,
    trackSubscriptionCanceled,
    trackCheckoutInitiated,
    // Features
    trackFeatureUsed,
    trackAICoachMessage,
    trackAchievementUnlocked,
    trackStreakMilestone,
    // Social
    trackPostCreated,
    trackPostLiked,
    // Errors
    trackError,
    trackAPIError,
    // Page
    trackPageView,
    // User
    setUserProperties,
    // Conversion
    trackConversion,
};
