'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type RewardType = 'level_up' | 'achievement' | 'goal_reached';

interface RewardContextType {
    triggerReward: (type: RewardType, data?: any) => void;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export function RewardProvider({ children }: { children: React.ReactNode }) {
    const [activeReward, setActiveReward] = useState<{ type: RewardType; data?: any } | null>(null);

    const triggerReward = useCallback((type: RewardType, data?: any) => {
        setActiveReward({ type, data });
        // Auto-clear after a set duration (matches animation duration)
        setTimeout(() => setActiveReward(null), 5000);
    }, []);

    return (
        <RewardContext.Provider value={{ triggerReward }}>
            {children}
            {/* The Overlay will be rendered here via a separate component or logic */}
            {activeReward && <RewardRenderer reward={activeReward} onComplete={() => setActiveReward(null)} />}
        </RewardContext.Provider>
    );
}

export const useReward = () => {
    const context = useContext(RewardContext);
    if (!context) throw new Error('useReward must be used within RewardProvider');
    return context;
};

// Internal renderer to decouple logic from the provider
import { LevelUpOverlay } from '@/components/ui/LevelUpOverlay';

function RewardRenderer({ reward, onComplete }: { reward: { type: RewardType; data?: any }; onComplete: () => void }) {
    if (reward.type === 'level_up') {
        return <LevelUpOverlay onComplete={onComplete} data={reward.data} />;
    }
    // Handle other types here
    return null;
}
