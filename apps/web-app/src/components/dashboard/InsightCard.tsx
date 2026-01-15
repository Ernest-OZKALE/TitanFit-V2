'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';
import { analyzeCorrelations, Insight } from '@/lib/intelligence';

export default function InsightCard() {
    const [insights, setInsights] = useState<Insight[]>([]);

    useEffect(() => {
        // Determine User ID (Mock for now, normally from Auth Context)
        analyzeCorrelations('user-uuid').then(setInsights);
    }, []);

    const topInsight = insights[0];

    if (!topInsight) return null;

    return (
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-black/60 border border-indigo-500/20 p-5">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <Brain className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Titan Intelligence</span>
                </div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/20">
                    {topInsight.confidence}% Confiance
                </span>
            </div>

            <div className="relative z-10">
                <h3 className="text-white font-medium text-sm mb-1">
                    {topInsight.message}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-400">
                        {topInsight.impact_percentage}%
                    </span>
                    <span className="text-xs text-gray-500 uppercase">Impact estimé</span>
                </div>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex gap-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            {topInsight.actionable_tip}
                        </p>
                    </div>
                </div>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-indigo-300 hover:text-white transition-colors group/btn">
                Voir toute l'analyse <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
