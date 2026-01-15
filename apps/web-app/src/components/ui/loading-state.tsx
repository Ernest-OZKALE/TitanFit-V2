'use client';

import { motion } from 'framer-motion';

interface LoadingStateProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

/**
 * Premium Loading State Component
 * Liquid Titanium inspired spinner
 */
export function LoadingState({
    text = 'Chargement...',
    size = 'md',
    fullScreen = false,
}: LoadingStateProps) {
    const sizeMap = {
        sm: { spinner: 'w-8 h-8', text: 'text-sm' },
        md: { spinner: 'w-12 h-12', text: 'text-base' },
        lg: { spinner: 'w-16 h-16', text: 'text-lg' },
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    className={`${sizeMap[size].spinner} rounded-full border-2 border-white/10`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Gold accent spinner */}
                <motion.div
                    className={`absolute inset-0 ${sizeMap[size].spinner} rounded-full`}
                    style={{
                        border: '2px solid transparent',
                        borderTopColor: '#D4AF37',
                        borderRightColor: '#D4AF37',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner glow */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent" />
            </div>

            {text && (
                <motion.p
                    className={`${sizeMap[size].text} text-gray-400 font-medium`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[200px]">
            {content}
        </div>
    );
}

/**
 * Skeleton Loader Component
 */
export function Skeleton({
    className = '',
    variant = 'rectangular',
}: {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
}) {
    const baseClass = 'animate-pulse bg-white/5';

    const variantClass = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
    };

    return <div className={`${baseClass} ${variantClass[variant]} ${className}`} />;
}

/**
 * Card Skeleton for loading states
 */
export function CardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-4 w-1/2" variant="text" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
            </div>
        </div>
    );
}

/**
 * List Skeleton
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Skeleton className="w-10 h-10" variant="circular" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" variant="text" />
                        <Skeleton className="h-3 w-1/2" variant="text" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Stats Grid Skeleton
 */
export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Skeleton className="h-8 w-1/2 mb-2" variant="text" />
                    <Skeleton className="h-4 w-3/4" variant="text" />
                </div>
            ))}
        </div>
    );
}

export default LoadingState;
