'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string;
        positive: boolean;
    };
    period?: string;
    accent?: 'gold' | 'purple' | 'green' | 'orange' | 'blue';
    className?: string;
}

const accentColors = {
    gold: {
        bg: 'bg-[#D4AF37]/10',
        text: 'text-[#D4AF37]',
        border: 'border-[#D4AF37]/30',
        icon: 'text-[#D4AF37]',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        icon: 'text-purple-400',
    },
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        icon: 'text-green-400',
    },
    orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        icon: 'text-orange-400',
    },
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
    },
};

export function StatCard({
    title,
    value,
    icon,
    trend,
    period = '30 jours',
    accent = 'gold',
    className = '',
}: StatCardProps) {
    const colors = accentColors[accent];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                bg-[#1E293B] border border-white/10 rounded-2xl p-5
                hover:border-[#D4AF37]/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]
                transition-all duration-300
                ${className}
            `}
        >
            <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {title}
                </span>
                {period && (
                    <span className="text-xs text-gray-500">{period} &gt;</span>
                )}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-3xl font-black text-white">
                        {value}
                    </div>
                    {trend && (
                        <div className={`text-xs mt-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                        {icon}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
