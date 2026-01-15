'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dumbbell, Timer, Flame, CheckCircle, Search, ChevronLeft, Zap } from 'lucide-react';
import WorkoutTimer from '@/components/WorkoutTimer';
import PageLoader from '@/components/PageLoader';
import TitaniumBackground from '@/components/TitaniumBackground';
import { GlassCard } from '@/components/ui/premium-components';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LogWorkoutPage() {
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const addSet = (exerciseId: string) => {
        // Logic to add set
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden pb-24">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black pointer-events-none" />

            {loading && <PageLoader />}

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 group">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-[#D4AF37]">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black uppercase tracking-tighter text-white leading-none">
                            Training <span className="text-[#D4AF37]">Mode</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Session Active</p>
                    </div>
                </div>
                <div className="scale-90 origin-right">
                    <WorkoutTimer />
                </div>
            </header>

            <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-8">
                {/* Current Session Card */}
                <GlassCard className="border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />

                    <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                                    <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                                        <Dumbbell className="h-6 w-6" />
                                    </div>
                                    Séance Push A
                                </h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Hypertrophie • Focus Pecs</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-green-500">Live</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all group/stat">
                                <div className="mb-2 flex justify-center">
                                    <Dumbbell className="h-5 w-5 text-gray-500 group-hover/stat:text-[#D4AF37] transition-colors" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Volume</p>
                                <p className="text-xl font-black text-white">0 <span className="text-[10px] text-gray-600">KG</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all group/stat">
                                <div className="mb-2 flex justify-center">
                                    <Flame className="h-5 w-5 text-gray-500 group-hover/stat:text-[#D4AF37] transition-colors" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Burn</p>
                                <p className="text-xl font-black text-white">0 <span className="text-[10px] text-gray-600">KC</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all group/stat">
                                <div className="mb-2 flex justify-center">
                                    <CheckCircle className="h-5 w-5 text-gray-500 group-hover/stat:text-[#D4AF37] transition-colors" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Séries</p>
                                <p className="text-xl font-black text-white">0</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Add Exercise Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-[#D4AF37]/50 rounded-2xl flex items-center justify-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-all group"
                >
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                        <PlusIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Ajouter un Exercice</span>
                </motion.button>

                {/* Exercise List (Empty State) */}
                {exercises.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center opacity-40">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Dumbbell className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-gray-500 font-medium italic">"La douleur de l'effort pèse quelques grammes. <br />Celle du regret pèse des tonnes."</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
