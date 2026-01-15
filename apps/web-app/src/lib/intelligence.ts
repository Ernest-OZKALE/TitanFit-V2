import { supabase } from '@/lib/supabase';

export interface Insight {
    id: string;
    type: 'correlation' | 'alert' | 'prediction';
    message: string;
    impact_percentage: number; // e.g. -15%
    confidence: number; // 0-100
    related_tags: string[]; // ['alcohol', 'sleep']
    actionable_tip: string;
}

// Mock RAG Engine (since we don't have months of data yet)
// In production, this would use Pearson Correlation Coefficient on the `daily_metrics` vs `journal_entries`
export const analyzeCorrelations = async (userId: string): Promise<Insight[]> => {
    // 1. Fetch recent Journal Entries
    // 2. Fetch recent Metrics
    // 3. Find patterns

    // MOCK INTELLIGENCE: Simulating the Bevel "Alcohol + Sleep" insight
    return [
        {
            id: 'insight-01',
            type: 'correlation',
            message: "L'alcool réduit votre sommeil profond.",
            impact_percentage: -18,
            confidence: 92,
            related_tags: ['Alcohol', 'Deep Sleep'],
            actionable_tip: "Évitez l'alcool 4h avant le coucher pour récupérer +15% de batterie."
        },
        {
            id: 'insight-02',
            type: 'prediction',
            message: "Pic de stress prévu demain.",
            impact_percentage: 12,
            confidence: 75,
            related_tags: ['Work', 'Monday'],
            actionable_tip: "Prévoyez une session de respiration de 5 min au réveil."
        },
        {
            id: 'insight-03',
            type: 'correlation',
            message: "Le magnésium améliore votre récupération.",
            impact_percentage: 8,
            confidence: 85,
            related_tags: ['Magnesium', 'Recovery'],
            actionable_tip: "Continuez votre supplémentation le soir."
        }
    ];
};
