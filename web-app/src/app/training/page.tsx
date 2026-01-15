'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, Trophy, Dumbbell, Play, Timer, Zap } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { GlassCard, StatCard } from '@/components/ui/premium-components';
import { Button } from '@/components/ui/button';

// Mock Data (will be replaced by Supabase)
const RECENT_SESSIONS = [
    { id: 1, name: "Push Day Elite", type: "Musculation", duration: "1h 15m", date: "Hier", intensity: "Haute", xp: 350 },
    { id: 2, name: "Titan Leg Destruction", type: "Musculation", duration: "1h 30m", date: "12 Jan", intensity: "Extrême", xp: 500 },
    { id: 3, name: "Cardio Zone 2", type: "Endurance", duration: "45m", date: "10 Jan", intensity: "Basse", xp: 150 }
];

export default function TrainingLogPage() {
    const router = useRouter();
    const [view, setView] = useState<'list' | 'create'>('list');

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            Journal <span className="text-[#D4AF37]">Titan</span>
                        </h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Historique & Planification
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/log-workout')}
                    className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black uppercase tracking-widest rounded-xl px-6 shadow-[0_0_20px_-5px_#D4AF37] hover:scale-105 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Log Session
                </Button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Col: Stats & Quick Actions (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <GlassCard className="p-6 space-y-4 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Volume Hebdo</h3>
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div className="text-4xl font-black text-white">4 <span className="text-lg text-gray-500 font-bold">Séances</span></div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4AF37] w-[65%]" />
                        </div>
                        <p className="text-xs text-gray-400">Objectif: 6 séances / semaine</p>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group">
                            <Trophy className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-400 uppercase">Records</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group">
                            <Zap className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-400 uppercase">Focus Mode</span>
                        </div>
                    </div>
                </div>

                {/* Right Col: History List (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-[#D4AF37]" />
                        Récent
                    </h2>

                    <div className="space-y-3">
                        {RECENT_SESSIONS.map((session) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all p-5 flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center">
                                        <span className="text-xl">💪</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{session.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {session.duration}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className="text-[#D4AF37]">{session.intensity}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-xl font-black text-white italic">+{session.xp} XP</div>
                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
                                        Détails
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
