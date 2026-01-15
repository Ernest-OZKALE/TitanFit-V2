'use client';

import WorkInProgress from '@/components/ui/WorkInProgress';

export default function MealPhotoAnalyzer() {
    return (
        <WorkInProgress
            feature="Analyse Photo IA"
            description="L'analyse visuelle des repas par IA nécessite un accès à l'API GPT-4 Vision (Service Payant)."
            requiredApi="OpenAI Vision API"
        />
    );
}
