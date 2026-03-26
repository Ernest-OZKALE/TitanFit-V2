'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface OnboardingTourProps {
    runTour: boolean;
    onComplete: () => void;
}

export default function OnboardingTour({ runTour, onComplete }: OnboardingTourProps) {
    const steps: Step[] = [
        {
            target: 'body',
            content: 'Bienvenue sur TitanFit ! Laissez-moi vous faire visiter. 👋',
            placement: 'center',
        },
        {
            target: '[data-tour="dashboard"]',
            content: 'Voici votre tableau de bord. Vous y verrez vos statistiques et progrès.',
        },
        {
            target: '[data-tour="log-meal"]',
            content: 'Cliquez ici pour enregistrer vos repas et suivre vos macros.',
        },
        {
            target: '[data-tour="log-workout"]',
            content: 'Et ici pour logger vos entraînements et suivre votre force.',
        },
        {
            target: '[data-tour="ai-coach"]',
            content: 'Besoin de conseils ? Votre coach IA est là 24/7 ! 🤖',
        },
        {
            target: '[data-tour="progress"]',
            content: 'Suivez votre progression avec des graphiques et photos.',
        },
        {
            target: '[data-tour="feed"]',
            content: 'Partagez votre parcours et soutenez la communauté ! 💪',
        },
        {
            target: 'body',
            content: 'Vous êtes prêt ! Commencez votre transformation dès maintenant. 🚀',
            placement: 'center',
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if (status === 'finished' || status === 'skipped') {
            onComplete();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={runTour}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#9333ea',
                    zIndex: 10000,
                },
            }}
            locale={{
                back: 'Retour',
                close: 'Fermer',
                last: 'Terminer',
                next: 'Suivant',
                skip: 'Passer',
            }}
        />
    );
}
