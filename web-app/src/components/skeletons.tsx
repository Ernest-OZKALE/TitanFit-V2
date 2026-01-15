'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

// ================================================================
// LOADING SKELETONS
// Optimized skeleton components for Suspense fallbacks
// ================================================================

// Base shimmer animation
const shimmerVariants = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
    },
};

// Skeleton Base Component
export const Skeleton = memo(function Skeleton({
    className = "",
    height = "h-4",
    width = "w-full"
}: {
    className?: string;
    height?: string;
    width?: string;
}) {
    return (
        <motion.div
            className={`${height} ${width} ${className} rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]`}
            variants={shimmerVariants}
            animate="animate"
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
    );
});

// Stats Card Skeleton
export const StatsSkeleton = memo(function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton height="h-10" width="w-10" className="rounded-xl" />
                        <Skeleton height="h-4" width="w-20" />
                    </div>
                    <Skeleton height="h-8" width="w-24" className="mb-2" />
                    <Skeleton height="h-2" className="mt-3" />
                </div>
            ))}
        </div>
    );
});

// Quick Actions Skeleton
export const QuickActionsSkeleton = memo(function QuickActionsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                    <Skeleton height="h-14" width="w-14" className="mx-auto mb-3 rounded-2xl" />
                    <Skeleton height="h-4" width="w-20" className="mx-auto mb-2" />
                    <Skeleton height="h-3" width="w-16" className="mx-auto" />
                </div>
            ))}
        </div>
    );
});

// Chart Skeleton
export const ChartSkeleton = memo(function ChartSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton height="h-6" width="w-32" />
            </div>
            <div className="flex items-end gap-2 h-[250px] pt-4">
                {[...Array(12)].map((_, i) => {
                    // Use a deterministic height based on index to avoid hydration mismatch
                    const heightPercent = 40 + ((i * 13) % 60);
                    return (
                        <div
                            key={i}
                            style={{ height: `${heightPercent}%` }}
                            className="w-full rounded-t-lg bg-slate-100 animate-pulse opacity-60"
                        />
                    );
                })}
            </div>
        </div>
    );
});

// Feed Item Skeleton
export const FeedSkeleton = memo(function FeedSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton height="h-12" width="w-12" className="rounded-2xl" />
                        <div className="flex-1">
                            <Skeleton height="h-4" width="w-32" className="mb-2" />
                            <Skeleton height="h-3" width="w-20" />
                        </div>
                    </div>
                    <Skeleton height="h-4" className="mb-2" />
                    <Skeleton height="h-4" width="w-4/5" />
                </div>
            ))}
        </div>
    );
});

// Profile Form Skeleton
export const FormSkeleton = memo(function FormSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <div className="text-center mb-6">
                <Skeleton height="h-24" width="w-24" className="mx-auto rounded-full" />
            </div>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton height="h-3" width="w-20" />
                    <Skeleton height="h-12" className="rounded-xl" />
                </div>
            ))}
        </div>
    );
});
