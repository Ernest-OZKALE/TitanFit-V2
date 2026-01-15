'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Droplets, Minus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function HydrationTracker() {
    const [level, setLevel] = useState(0); // Start at 0, will load from storage
    const target = 3000;
    const percentage = Math.min((level / target) * 100, 100);

    // Load hydration level from localStorage (daily reset)
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem('titan_hydration');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                setLevel(data.level);
            } else {
                // New day, reset to 0
                setLevel(0);
            }
        }
    }, []);

    // Save hydration level to localStorage
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('titan_hydration', JSON.stringify({ date: today, level }));
    }, [level]);

    const addWater = () => setLevel(l => Math.min(l + 250, target));
    const removeWater = () => setLevel(l => Math.max(l - 250, 0));

    return (
        <GlassCard className="relative overflow-hidden !p-0 h-32 flex items-center justify-between !bg-white border border-blue-100">
            {/* LIQUID BACKGROUND */}
            <div className="absolute inset-0 bg-blue-50 z-0">
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/10"
                    initial={{ height: '0%' }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                />
                {/* Wave effect could go here */}
            </div>

            <div className="relative z-10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-500">
                    <Droplets className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hydration</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">{level}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">/ {target}ml</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 pr-6 flex flex-col gap-2">
                <button
                    onClick={addWater}
                    className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </GlassCard>
    );
}
