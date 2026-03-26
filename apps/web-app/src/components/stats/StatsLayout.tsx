'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { TimeRange, TIME_RANGES } from '@/lib/mock-stats-data';

interface StatsLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    timeRange: TimeRange;
    onTimeRangeChange: (range: TimeRange) => void;
}

export function StatsLayout({
    children,
    title = "Ma Progression",
    subtitle = "Analyse détaillée de vos performances",
    timeRange,
    onTimeRangeChange
}: StatsLayoutProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] relative">
            {/* Decorative Background */}
            <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-slate-50 to-transparent -z-10" />
            <div className="fixed top-20 right-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />

            {/* Header Sticky */}
            <motion.div
                className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <motion.button
                                    className="p-2.5 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-[#D4AF37] transition-all border border-transparent hover:border-slate-100"
                                    whileHover={{ x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </motion.button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                                    {title}
                                </h1>
                                <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>
                            </div>
                        </div>

                        {/* Time Range Selector */}
                        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                            {TIME_RANGES.map((range) => {
                                const isActive = timeRange === range;
                                return (
                                    <motion.button
                                        key={range}
                                        onClick={() => onTimeRangeChange(range)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                                            ${isActive
                                                ? 'bg-white text-[#D4AF37] shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                                        `}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {range}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
