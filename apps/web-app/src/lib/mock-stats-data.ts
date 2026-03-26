export interface WeightPoint {
    date: string;
    weight: number;
    trend: number; // Moving average
}

export interface VolumePoint {
    date: string;
    volume: number; // Tonnage total
    intensity: number; // RPE moyen ou similar
}

export interface MacroPoint {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export const TIME_RANGES = ['1S', '1M', '3M', '6M', '1A', 'TOUT'] as const;
export type TimeRange = typeof TIME_RANGES[number];

// Helper to generate dates
const generateDates = (days: number) => {
    const dates = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

// MOCK DATA FACTORY
export const MOCK_WEIGHT_HISTORY: WeightPoint[] = generateDates(365).map((date, i) => {
    // Simulate realistic weight fluctuation with a downward trend
    const baseWeight = 85;
    const targetWeight = 78;
    const progress = i / 365;
    const trend = baseWeight - (baseWeight - targetWeight) * progress;
    const noise = Math.sin(i * 0.1) * 0.5 + (Math.random() - 0.5) * 0.8;

    return {
        date,
        weight: Number((trend + noise).toFixed(1)),
        trend: Number(trend.toFixed(1))
    };
});

export const MOCK_WORKOUT_VOLUME: VolumePoint[] = generateDates(90).map((date, i) => {
    // 3-4 workouts per week
    const day = new Date(date).getDay();
    const isRestDay = day === 0 || day === 2 || day === 4; // Rest on Sun, Tue, Thu

    if (isRestDay && Math.random() > 0.2) return { date, volume: 0, intensity: 0 };

    const baseVolume = 5000;
    const progress = i / 90;
    const volume = baseVolume * (1 + progress * 0.3) + (Math.random() * 1000 - 500);

    return {
        date,
        volume: Math.round(volume),
        intensity: 7 + Math.random() * 2 // RPE 7-9
    };
});

export const MOCK_MACROS: MacroPoint[] = generateDates(30).map((date, i) => {
    return {
        date,
        calories: Math.round(2400 + (Math.random() * 300 - 150)),
        protein: Math.round(180 + (Math.random() * 20 - 10)),
        carbs: Math.round(250 + (Math.random() * 40 - 20)),
        fats: Math.round(70 + (Math.random() * 15 - 7.5)),
    };
});

export const BODY_STATS_CURRENT = {
    weight: 79.4,
    weightChange: -2.3, // last 30 days
    bodyFat: 14.5,
    bodyFatChange: -1.2,
    muscleMass: 64.2,
    muscleMassChange: +0.5,
    hydration: 58.2
};

export const MOCK_MUSCLE_DISTRIBUTION = [
    { muscle: 'Pectoraux', score: 85, fullMark: 100 },
    { muscle: 'Dos', score: 75, fullMark: 100 },
    { muscle: 'Jambes', score: 95, fullMark: 100 },
    { muscle: 'Épaules', score: 60, fullMark: 100 },
    { muscle: 'Bras', score: 80, fullMark: 100 },
    { muscle: 'Cardio', score: 40, fullMark: 100 },
];

export const MOCK_PR_HISTORY = [
    { exercise: 'Développé Couché', weight: 105, date: '2025-10-15', improvement: +5 },
    { exercise: 'Squat', weight: 140, date: '2025-11-02', improvement: +10 },
    { exercise: 'Soulevé de Terre', weight: 180, date: '2025-09-20', improvement: +15 },
    { exercise: 'Tractions', weight: 25, date: '2025-12-01', improvement: +2.5 }, // Weighted
    { exercise: 'Militaire', weight: 65, date: '2025-11-20', improvement: +2.5 },
];
