'use client';

import { useRouter } from 'next/navigation';
import { SleepArchitect } from '@/components/biohacking/SleepArchitect';
import { NeuroPriming } from '@/components/biohacking/NeuroPriming';
import { ArrowLeft, Brain, Moon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

export default function BioPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                            Bio<span className="text-[#D4AF37]">Hacking.</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Optimisation Système Nerveux</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-12">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                >
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Optimisez votre récupération, votre sommeil et vos performances cognitives.
                    </p>
                </motion.div>

                {/* Sleep Architect */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <Moon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Sleep Architect</h2>
                            <p className="text-xs text-gray-500">Optimisation du sommeil</p>
                        </div>
                    </div>
                    <SleepArchitect />
                </motion.section>

                {/* Neuro Priming */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                            <Brain className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Neuro Priming</h2>
                            <p className="text-xs text-gray-500">Préparation mentale</p>
                        </div>
                    </div>
                    <NeuroPriming />
                </motion.section>

            </div>
        </div>
    );
}
