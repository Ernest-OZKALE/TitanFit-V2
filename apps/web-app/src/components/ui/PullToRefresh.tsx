'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    className?: string;
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const pullThreshold = 80;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current?.scrollTop === 0) {
            const startY = e.touches[0].pageY;

            const handleTouchMove = (moveEvent: TouchEvent) => {
                const currentY = moveEvent.touches[0].pageY;
                const distance = Math.max(0, (currentY - startY) * 0.4); // Resistance
                setPullDistance(distance);

                if (distance > 10) {
                    if (moveEvent.cancelable) moveEvent.preventDefault();
                }
            };

            const handleTouchEnd = async () => {
                if (pullDistance > pullThreshold) {
                    setIsRefreshing(true);
                    setPullDistance(pullThreshold);
                    try {
                        await onRefresh();
                    } finally {
                        setIsRefreshing(false);
                        setPullDistance(0);
                    }
                } else {
                    setPullDistance(0);
                }
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
            };

            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            className={cn("relative overflow-y-auto h-full scrollbar-none", className)}
        >
            {/* Liquid Gold Pull Indicator */}
            <div
                className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none z-50"
                style={{ height: Math.max(pullDistance, isRefreshing ? pullThreshold : 0) }}
            >
                {/* Main Liquid Body */}
                <motion.div
                    animate={{
                        height: isRefreshing ? '60px' : `${pullDistance}px`,
                        borderRadius: isRefreshing ? '0 0 100% 100%' : '0 0 50% 50%'
                    }}
                    className="w-full bg-gradient-to-b from-[#B8860B] via-[#D4AF37] to-[#FFD700] shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex flex-col items-center justify-end pb-2"
                >
                    <AnimatePresence>
                        {isRefreshing ? (
                            <motion.div
                                initial={{ opacity: 0, rotate: 0 }}
                                animate={{ opacity: 1, rotate: 360 }}
                                exit={{ opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <RefreshCw size={24} className="text-black" />
                            </motion.div>
                        ) : (
                            <motion.div
                                style={{
                                    opacity: pullDistance / pullThreshold,
                                    scale: Math.min(pullDistance / pullThreshold, 1)
                                }}
                            >
                                <Sparkles size={24} className="text-black animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Drip Animation (When pulled far) */}
                {pullDistance > pullThreshold && !isRefreshing && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.5, 0], y: [0, 50] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute bottom-0 w-4 h-4 rounded-full bg-titan-gold blur-sm"
                    />
                )}
            </div>

            {/* Content Container */}
            <motion.div
                animate={{
                    y: isRefreshing ? pullThreshold : pullDistance
                }}
                transition={{ type: "spring", damping: 20, stiffness: 150 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
