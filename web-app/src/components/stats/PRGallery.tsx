'use client';

import { GlassCard } from '@/components/ui/premium-components';
import { MOCK_PR_HISTORY } from '@/lib/mock-stats-data';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function PRGallery() {
    const data = MOCK_PR_HISTORY;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-[#D4AF37]" />
                Wall of Fame (PRs)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((pr, index) => (
                    <motion.div
                        key={pr.exercise}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard className="relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                            {/* Gold Glow Background Effect */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl group-hover:bg-[#D4AF37]/20 transition-all" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-700">{pr.exercise}</h4>
                                    <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" /> +{pr.improvement}kg
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-black text-slate-900">{pr.weight}</span>
                                    <span className="text-sm font-medium text-slate-400">kg</span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(pr.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
