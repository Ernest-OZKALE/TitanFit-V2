'use client';

import { motion } from 'framer-motion';

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="relative">
                {/* Animated circles */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full" />
                </motion.div>

                <motion.div
                    className="absolute inset-0"
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="w-24 h-24 border-4 border-blue-200 border-b-blue-600 rounded-full" />
                </motion.div>

                {/* Logo pulsing */}
                <motion.div
                    className="w-24 h-24 flex items-center justify-center"
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        TF
                    </span>
                </motion.div>
            </div>

            {/* Loading text */}
            <motion.p
                className="absolute bottom-1/3 text-gray-600 font-medium"
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                Chargement...
            </motion.p>
        </div>
    );
}

export function SkeletonLoader() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-shimmer" />
            <div className="flex space-x-4">
                <div className="h-32 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6" />
                </div>
            </div>
        </div>
    );
}

export function ContentLoader({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ width: `${100 - i * 10}%` }}
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );
}
