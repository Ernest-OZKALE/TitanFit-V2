'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    disabled?: boolean;
}

/**
 * Mobile Pull-To-Refresh Component
 * Features: Touch-native feel, Fluid animations, Haptic-ready
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    disabled = false,
}) => {
    const [pulling, setPulling] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const controls = useAnimation();

    const THRESHOLD = 80;
    const MAX_PULL = 120;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled || refreshing || (containerRef.current?.scrollTop || 0) > 0) return;
        startY.current = e.touches[0].pageY;
        setPulling(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!pulling || refreshing) return;

        const currentY = e.touches[0].pageY;
        const distance = currentY - startY.current;

        if (distance > 0 && (containerRef.current?.scrollTop || 0) === 0) {
            // Apply resistance
            const dampedDistance = Math.min(MAX_PULL, distance * 0.5);
            setPullDistance(dampedDistance);

            // Prevent default to disable native pull-to-refresh on mobile browsers
            if (distance > 10 && e.cancelable) {
                e.preventDefault();
            }
        } else {
            setPullDistance(0);
            setPulling(false);
        }
    };

    const handleTouchEnd = async () => {
        if (!pulling) return;
        setPulling(false);

        if (pullDistance >= THRESHOLD) {
            setRefreshing(true);
            setPullDistance(THRESHOLD);

            try {
                // Potential for Haptic Feedback here if supported
                if ('vibrate' in navigator) navigator.vibrate(10);

                await onRefresh();
            } finally {
                setRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-full overflow-y-auto custom-scrollbar"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Refresh Indicator */}
            <div
                className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none z-50"
                style={{ height: pullDistance }}
            >
                <div
                    className="flex flex-col items-center justify-center transition-opacity duration-200"
                    style={{
                        opacity: pullDistance / THRESHOLD,
                        transform: `translateY(${pullDistance - 40}px)`
                    }}
                >
                    <motion.div
                        animate={refreshing ? { rotate: 360 } : { rotate: (pullDistance / THRESHOLD) * 180 }}
                        transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { type: "spring" }}
                        className={`p-2 rounded-full bg-[#D4AF37] text-black shadow-lg ${refreshing ? 'scale-110' : ''}`}
                    >
                        <RefreshCw size={20} />
                    </motion.div>
                </div>
            </div>

            {/* Content Container */}
            <motion.div
                animate={{ y: pullDistance }}
                transition={{ type: "spring", damping: 20, stiffness: 150 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PullToRefresh;
