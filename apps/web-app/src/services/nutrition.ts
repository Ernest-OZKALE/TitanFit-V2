import { supabase } from '@/lib/supabase';

// AHEI (Alternate Healthy Eating Index) Weights
// Bevel-inspired: Points added or subtracted based on quality
const AHEI_POINTS = {
    green_leafy: 10,
    fruit: 5,
    whole_grain: 5,
    nuts_legumes: 5,
    omega_3: 8,

    processed_meat: -10,
    added_sugar: -8,
    sodium: -5,
    alcohol: -10,
    trans_fat: -10
};

export interface FoodItem {
    id: string;
    name: string;
    quality_tags: string[]; // JSON array in DB
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export const calculateAHEI = (qualityTags: string[]): number => {
    let score = 0;

    qualityTags.forEach(tag => {
        // @ts-ignore
        if (AHEI_POINTS[tag]) {
            // @ts-ignore
            score += AHEI_POINTS[tag];
        }
    });

    // Clamp -10 to +10 per item effectively, but let's allow range
    return score;
};

export const getFoodImpactColor = (score: number): string => {
    if (score >= 5) return '#10B981'; // Green
    if (score <= -5) return '#EF4444'; // Red
    return '#F59E0B'; // Amber
};

export const fetchFoodItems = async (search: string): Promise<FoodItem[]> => {
    const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', `%${search}%`)
        .limit(10);

    if (error) {
        console.error('Error fetching food:', error);
        return [];
    }
    return data || [];
};
