'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: 'gold' | 'purple' | 'green' | 'orange' | 'blue';
    label?: string;
    value?: string;
    className?: string;
}

const ringColors = {
    gold: '#D4AF37',
    purple: '#8B5CF6',
    green: '#22C55E',
    orange: '#F97316',
    blue: '#3B82F6',
};

export function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 12,
    color = 'gold',
    label,
    value,
    className = '',
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    const ringColor = ringColors[color];

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${ringColor})`,
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {value && (
                    <span className="text-2xl font-black text-white">{value}</span>
                )}
                {label && (
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
                )}
            </div>
        </div>
    );
}
