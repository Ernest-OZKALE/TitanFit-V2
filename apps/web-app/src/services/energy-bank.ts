import { supabase } from '@/lib/supabase';

export interface DailyMetrics {
    id: string;
    user_id: string;
    date: string;
    recovery_score: number | null;
    sleep_score: number | null;
    strain_score: number | null;
    stress_score: number | null;
    energy_bank: number | null;
    hrv_ms: number | null;
    resting_hr: number | null;
    sleep_duration_minutes: number | null;
}

export const fetchDailyMetrics = async (date: Date): Promise<DailyMetrics | null> => {
    const formattedDate = date.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('date', formattedDate)
        .maybeSingle();

    if (error) {
        return null;
    }

    return data;
};

export const calculateEnergyBank = (metrics: Partial<DailyMetrics>, previousBank: number = 80): number => {
    // Bevel-inspired Algorithm (Simplified)

    // 1. Base Charge from Sleep (0-100)
    const sleepCharge = (metrics.sleep_score || 0) * 0.5; // Up to 50% recharge

    // 2. Recovery Bonus (0-30)
    const recoveryBonus = (metrics.recovery_score || 0) * 0.3; // Up to 30% bonus

    // 3. Strain Drain (0-100)
    // Strain of 21 (Max) should drain ~100% of energy theoretically
    const strainDrain = (metrics.strain_score || 0) * 4;

    // 4. Stress Drain
    const stressDrain = (metrics.stress_score || 0) * 0.2;

    // 5. Carry-over from previous day (Decay)
    // If you ended yesterday with 10%, you start lower today
    const decayFactor = 0.5;
    const carryOver = previousBank * decayFactor;

    // Formula
    let bank = carryOver + sleepCharge + recoveryBonus - strainDrain - stressDrain;

    // Clamping
    return Math.min(100, Math.max(0, Math.round(bank)));
};
