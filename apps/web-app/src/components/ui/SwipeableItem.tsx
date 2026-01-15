'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Trash2, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableItemProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    leftColor?: string;
    rightColor?: string;
    className?: string;
}

export function SwipeableItem({
    children,
    onSwipeLeft,
    onSwipeRight,
    leftIcon = <Check size={20} />,
    rightIcon = <Trash2 size={20} />,
    leftColor = "bg-green-500",
    rightColor = "bg-red-500",
    className
}: SwipeableItemProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Transform values for background color and icon scale
    const background = useTransform(
        x,
        [-100, 0, 100],
        [rightColor, "rgba(0,0,0,0)", leftColor]
    );

    const iconScale = useTransform(
        x,
        [-100, -50, 0, 50, 100],
        [1.2, 1, 0, 1, 1.2]
    );

    const handleDragEnd = async (_: any, info: any) => {
        const threshold = 100;
        if (info.offset.x > threshold && onSwipeRight) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipeRight();
        } else if (info.offset.x < -threshold && onSwipeLeft) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipeLeft();
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={cn("relative overflow-hidden rounded-2xl group", className)}>
            {/* Background Actions Layer */}
            <motion.div
                style={{ background }}
                className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none"
            >
                <motion.div style={{ scale: iconScale }} className="text-white">
                    {leftIcon}
                </motion.div>
                <motion.div style={{ scale: iconScale }} className="text-white">
                    {rightIcon}
                </motion.div>
            </motion.div>

            {/* Content Layer (Draggable) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: onSwipeLeft ? -200 : 0, right: onSwipeRight ? 200 : 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                className="relative z-10 bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl cursor-grab active:cursor-grabbing shadow-xl"
            >
                {children}

                {/* Micro-Affordance (Swipe Hint) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
            </motion.div>
        </div>
    );
}
