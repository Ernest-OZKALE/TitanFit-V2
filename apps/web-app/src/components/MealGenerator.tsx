'use client';

import WorkInProgress from '@/components/ui/WorkInProgress';

export default function MealGenerator() {
    return (
        <WorkInProgress
            feature="Fuel Synthesis (Chef IA)"
            description="Le générateur de recettes personnalisé nécessite un moteur LLM connecté (GPT-4) pour créer des recettes uniques."
            requiredApi="OpenAI API"
        />
    );
}
