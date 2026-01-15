'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Flame, TrendingUp, Settings, Crown, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function ProfilePage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        level: 1,
        xp: 0,
        workouts: 0,
        streak: 0,
        tier: 'Novice'
    });

    useEffect(() => {
        // DATA READING (Real LocalStorage Logic)
        const workoutDate = localStorage.getItem('titan_last_workout');
        const logs = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');

        // Mock calculations based on "Active" usage
        // In a real app, we'd count actual workout entries. 
        // Here we simulate XP based on data presence.
        let xp = 0;
        let workouts = 0;

        if (workoutDate) {
            workouts = 1; // At least one known
            xp += 500;
        }

        if (logs.length > 0) {
            xp += logs.length * 50;
        }

        const level = Math.floor(xp / 1000) + 1;
        const tier = level >= 10 ? 'Titan' : level >= 5 ? 'Elite' : 'Rookie';

        setStats({ level, xp, workouts, streak: workouts > 0 ? 1 : 0, tier });
    }, []);

    return (
        <div className="pb-32 max-w-4xl mx-auto">
            {/* HEADER: IDENTITY CARD */}
            <div className="relative mb-12 pt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] transform skew-y-1 shadow-2xl" />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-white">
                    {/* AVATAR RING */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] p-1 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                            <div className="w-full h-full rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                                <User className="w-16 h-16 text-slate-400" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-slate-900 font-black text-xs uppercase tracking-widest shadow-lg">
                            Lvl {stats.level}
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-black uppercase italic tracking-tight">
                                {user?.email?.split('@')[0] || 'Athlète'}
                            </h1>
                            {stats.tier === 'Titan' && <Crown className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />}
                        </div>

                        <p className="text-slate-400 font-medium mb-6">Membre {stats.tier} • Rejoins depuis 2024</p>

                        {/* XP BAR */}
                        <div className="w-full max-w-sm bg-slate-700/50 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.xp % 1000) / 10}%` }}
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7CE]"
                            />
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                            <span>{stats.xp} XP</span>
                            <span>{1000 - (stats.xp % 1000)} XP pour next Lvl</span>
                        </div>
                    </div>

                    {/* SETTINGS BTN */}
                    <Link href="/settings" className="absolute top-8 right-8 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <Settings className="w-5 h-5 text-slate-400" />
                    </Link>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatBox label="Entraînements" value={stats.workouts} icon={Trophy} />
                <StatBox label="Série (Jours)" value={stats.streak} icon={Flame} color="text-orange-500" />
                <StatBox label="Volume (kg)" value="0" icon={TrendingUp} />
                <StatBox label="Réputation" value="100%" icon={Crown} color="text-[#D4AF37]" />
            </div>

            {/* ACHIEVEMENTS */}
            <h2 className="text-xl font-black text-slate-900 uppercase italic mb-6">Trophées & Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 uppercase">Premier Pas</h3>
                        <p className="text-xs text-slate-500 mt-1">Compléter 1 séance d'entraînement complète.</p>
                        <div className={`mt-2 text-[10px] font-bold uppercase px-2 py-1 rounded w-fit ${stats.workouts > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            {stats.workouts > 0 ? 'Débloqué' : 'Verrouillé'}
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-6 opacity-60 grayscale">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Crown className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 uppercase">Titan Élite</h3>
                        <p className="text-xs text-slate-500 mt-1">Atteindre le niveau 10.</p>
                        <div className="mt-2 text-[10px] font-bold uppercase px-2 py-1 rounded w-fit bg-slate-100 text-slate-400">
                            Verrouillé
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon: Icon, color = "text-slate-900" }: any) {
    return (
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
            </div>
        </div>
    )
}
