'use client';

import React from 'react';
import { PullToRefresh } from './pull-to-refresh';
import { useAnalytics } from '@/hooks/use-analytics';

interface MobileLayoutProps {
    children: React.ReactNode;
    onRefresh?: () => Promise<void>;
    showHeader?: boolean;
    title?: string;
    rightAction?: React.ReactNode;
}

/**
 * MobileLayout Component
 * Standardizes mobile experience with pull-to-refresh and a sticky header
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    onRefresh,
    showHeader = true,
    title,
    rightAction,
}) => {
    const { analytics } = useAnalytics();

    const handleRefresh = async () => {
        if (onRefresh) {
            analytics.trackFeatureUsed('PullToRefresh');
            await onRefresh();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden safe-bottom">
            {/* Mobile Header */}
            {showHeader && (
                <header className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
                    <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
                        {title || 'TitanFit'}
                    </h1>
                    <div className="flex items-center gap-3">
                        {rightAction}
                    </div>
                </header>
            )}

            {/* Main Content with Pull-To-Refresh */}
            <main className="flex-1 overflow-hidden relative">
                {onRefresh ? (
                    <PullToRefresh onRefresh={handleRefresh}>
                        <div className="px-6 py-6 pb-24">
                            {children}
                        </div>
                    </PullToRefresh>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar px-6 py-6 pb-24">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MobileLayout;
