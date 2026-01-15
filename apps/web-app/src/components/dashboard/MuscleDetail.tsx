'use client';

import { motion } from 'framer-motion';
import { X, Dna, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MuscleInfo } from '@/lib/muscle-data';

interface MuscleDetailProps {
    muscle: MuscleInfo | null;
    onClose: () => void;
}

export default function MuscleDetail({ muscle, onClose }: MuscleDetailProps) {
    if (!muscle) return null;

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 p-8 overflow-y-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-[#D4AF37] rounded-full" />
                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{muscle.name}</h2>
                        <span className="text-xs text-[#D4AF37] font-mono">{muscle.latinName}</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                    <X className="w-5 h-5 text-gray-400" />
                </Button>
            </div>

            {/* Content */}
            <div className="space-y-8">

                {/* Visualizer Placeholder (could be a zoomed muscle image later) */}
                <div
                    className="w-full h-40 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ background: `linear-gradient(45deg, ${muscle.color}20, transparent)` }}
                >
                    <Dna className="w-12 h-12 opacity-50" style={{ color: muscle.color }} />
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4" /> Analyse
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        {muscle.description}
                    </p>
                </div>

                {/* Exercises */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4" /> Protocoles d'Activation
                    </h3>
                    <div className="space-y-3">
                        {muscle.exercises.map((exo, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/50 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <span className="text-sm font-medium text-white">{exo}</span>
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37]">
                                    <span className="text-[10px] text-gray-500 group-hover:text-[#D4AF37]">{i + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[#D4AF37] uppercase">État Actuel</span>
                        <span className="text-xs text-white">Prêt</span>
                    </div>
                    <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-[#D4AF37]" />
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
