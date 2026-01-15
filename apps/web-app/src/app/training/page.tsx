'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, Trophy, Dumbbell, Timer, Zap, Activity, Flame } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { GlassCard } from '@/components/ui/premium-components';
import FocusModeOverlay from '@/components/dashboard/FocusModeOverlay';
import BodyMapSelector from '@/components/dashboard/BodyMapSelector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock Data
const RECENT_SESSIONS = [
    { id: 1, name: "Push Day Elite", type: "Musculation", duration: "1h 15m", date: "Hier", intensity: "Haute", xp: 350, muscles: ["Pectoraux", "Triceps"] },
    { id: 2, name: "Titan Leg Destruction", type: "Musculation", duration: "1h 30m", date: "12 Jan", intensity: "Extrême", xp: 500, muscles: ["Quadriceps", "Ischios"] },
    { id: 3, name: "Cardio Zone 2", type: "Endurance", duration: "45m", date: "10 Jan", intensity: "Basse", xp: 150, muscles: ["Cœur"] },
    { id: 4, name: "Pull Power", type: "Musculation", duration: "1h 05m", date: "08 Jan", intensity: "Haute", xp: 320, muscles: ["Dos", "Biceps"] }
];

const WEEK_ACTIVITY = [true, true, false, true, true, false, true]; // Mon-Sun

export default function TrainingLogPage() {
    const router = useRouter();
    const [showFocusMode, setShowFocusMode] = useState(false);

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <FocusModeOverlay isActive={showFocusMode} onClose={() => setShowFocusMode(false)} />
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-white/10 text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            Journal <span className="text-[#D4AF37]">Titan</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Historique & Planification
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => router.push('/workout/active')}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded-xl px-4 border border-white/10 transition-all"
                    >
                        <Zap className="w-4 h-4 mr-2 text-[#D4AF37]" /> Titan Field
                    </Button>
                    <Button
                        onClick={() => router.push('/log-workout')}
                        className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black uppercase tracking-widest rounded-xl px-6 shadow-[0_0_20px_-5px_#D4AF37] transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Log Session
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Col: Overview & Heatmap (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6 space-y-6 bg-[#0F0F0F] border border-white/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Visualisation Hebdo</h3>
                            <Activity className="w-4 h-4 text-[#D4AF37]" />
                        </div>

                        {/* Weekly Heatmap */}
                        <div className="flex justify-between items-end h-20 gap-2">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                    <div className={cn(
                                        "w-full rounded-md transition-all duration-500",
                                        WEEK_ACTIVITY[i]
                                            ? "bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
                                            : "bg-white/5"
                                    )} style={{ height: WEEK_ACTIVITY[i] ? `${Math.random() * 50 + 30}%` : '10%' }} />
                                    <span className="text-[10px] text-gray-500 font-bold">{day}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="text-3xl font-black text-white">4 <span className="text-sm text-gray-500 font-bold">Sessions</span></div>
                            <p className="text-[10px] text-gray-400 mt-1">Vous êtes dans le top 5% cette semaine.</p>
                        </div>
                    </GlassCard>

                    <div onClick={() => setShowFocusMode(true)} className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 cursor-pointer group hover:border-[#D4AF37]/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <Zap className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-black text-white uppercase italic">Focus Mode</h3>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">Activez l'interface d'entraînement immersive pour zéro distraction.</p>
                    </div>
                </div>

                {/* Middle Col: History Stream (6 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-[#D4AF37]" />
                            Journal d'Activité
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {RECENT_SESSIONS.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-3xl bg-[#0F0F0F] border border-white/5 hover:border-[#D4AF37]/30 transition-all p-6 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/[0.02] group-hover:via-white/[0.05] transition-all" />

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#151515] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                                            <span className="text-2xl">{session.type === 'Musculation' ? '🏋️' : '🏃'}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors uppercase italic">{session.name}</h3>
                                            <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                                {session.muscles.map(m => (
                                                    <span key={m} className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">{m}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mt-2">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#D4AF37]" /> {session.date}</span>
                                                <span className="flex items-center gap-1.5"><Timer className="w-3 h-3 text-[#D4AF37]" /> {session.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className="px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-2">
                                            {session.intensity}
                                        </div>
                                        <div className="text-xl font-black text-white italic">+{session.xp} XP</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Recovery & BodyMap (3 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="h-[500px]">
                        <BodyMapSelector />
                    </div>

                    <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <Flame className="w-5 h-5 text-red-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Récupération</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-400">Système Nerveux</span>
                                    <span className="text-emerald-500">92%</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-400">Musculaire Gl.</span>
                                    <span className="text-yellow-500">75%</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[75%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
