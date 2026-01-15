'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BioSparklineProps {
    data: number[]; // Array of last 7 values
    color?: string;
    className?: string;
    height?: number;
}

export function BioSparkline({ data, color = "#D4AF37", className, height = 40 }: BioSparklineProps) {
    if (!data || data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // SVG Dimensions
    const width = 140;
    const padding = 5;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className={cn("relative group", className)}>
            <svg width={width} height={height} className="overflow-visible">
                {/* Neon Glow Layer */}
                <motion.polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="opacity-50 blur-[2px]"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Main Line Layer */}
                <motion.polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Point Highlight (Current Value) */}
                <motion.circle
                    cx={(data.length - 1) / (data.length - 1) * (width - padding * 2) + padding}
                    cy={height - ((data[data.length - 1] - min) / range) * (height - padding * 2) - padding}
                    r="3"
                    fill={color}
                    className="shadow-[0_0_10px_currentColor]"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                />
            </svg>

            {/* Pulsing Scan Line Indicator */}
            <motion.div
                animate={{ x: [0, width, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-[1px] bg-white/20 blur-[1px] pointer-events-none"
            />
        </div>
    );
}
