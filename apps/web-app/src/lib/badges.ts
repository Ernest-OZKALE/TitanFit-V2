// Badge system for gamification

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'Bronze' | 'Argent' | 'Or' | 'Diamant';
    requirement: string;
    points: number;
    threshold: number; // For progress calculation
}

export const ACHIEVEMENTS: Badge[] = [
    {
        id: 'first_workout',
        name: 'Première Séance',
        description: 'Complétez votre premier entraînement',
        icon: '🏋️',
        rarity: 'Bronze',
        requirement: 'Log 1 workout',
        points: 10,
        threshold: 1
    },
    {
        id: 'workout_streak_7',
        name: 'Semaine Acharnée',
        description: '7 jours de suite avec entraînement',
        icon: '🔥',
        rarity: 'Argent',
        requirement: '7-day workout streak',
        points: 50,
        threshold: 7
    },
    {
        id: 'workout_streak_30',
        name: 'Titan du Mois',
        description: '30 jours de suite avec entraînement',
        icon: '💪',
        rarity: 'Or',
        requirement: '30-day workout streak',
        points: 200,
        threshold: 30
    },
    {
        id: 'macro_perfect_7',
        name: 'Nutrition Parfaite',
        description: '7 jours d\'affilée à atteindre vos macros',
        icon: '🎯',
        rarity: 'Argent',
        requirement: 'Hit macros 7 days straight',
        points: 60,
        threshold: 7
    },
    {
        id: 'photos_progress',
        name: 'Photographe Fitness',
        description: 'Uploadez 5 photos de progression',
        icon: '📸',
        rarity: 'Bronze',
        requirement: 'Upload 5 progress photos',
        points: 25,
        threshold: 5
    },
    {
        id: 'weight_goal',
        name: 'Objectif Atteint',
        description: 'Atteignez votre objectif de poids',
        icon: '🏆',
        rarity: 'Or',
        requirement: 'Reach weight goal',
        points: 150,
        threshold: 1
    },
    {
        id: 'community_helper',
        name: 'Entraide Communautaire',
        description: 'Aidez 10 membres de la communauté',
        icon: '🤝',
        rarity: 'Argent',
        requirement: 'Help 10 community members',
        points: 75,
        threshold: 10
    },
    {
        id: 'beast_mode',
        name: 'Mode Bête',
        description: 'Soulevez 2x votre poids corporel au deadlift',
        icon: '🦍',
        rarity: 'Diamant',
        requirement: 'Deadlift 2x bodyweight',
        points: 300,
        threshold: 2
    },
    {
        id: 'meal_logger',
        name: 'Chef Discipliné',
        description: 'Loggez vos repas 50 jours',
        icon: '📝',
        rarity: 'Or',
        requirement: 'Log meals for 50 days',
        points: 100,
        threshold: 50
    },
    {
        id: 'early_bird',
        name: 'Lève-tôt',
        description: 'Entraînez-vous avant 7h du matin 10 fois',
        icon: '🌅',
        rarity: 'Argent',
        requirement: 'Workout before 7am 10 times',
        points: 80,
        threshold: 10
    }
];

export function checkBadgeUnlock(userId: string, userStats: any): Badge[] {
    // Logic to check which badges user has unlocked
    // This would in reality query the database
    return [];
}
