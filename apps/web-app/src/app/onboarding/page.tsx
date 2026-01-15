'use client';

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import TitaniumBackground from '@/components/TitaniumBackground';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
            <div className="relative z-10 w-full max-w-xl">
                <OnboardingWizard />
            </div>
        </div>
    );
}
