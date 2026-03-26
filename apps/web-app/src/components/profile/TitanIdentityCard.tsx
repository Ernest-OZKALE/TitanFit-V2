'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, Award, MapPin, Edit3 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface IdentityProps {
    user: any;
    profile: any;
}

export function TitanIdentityCard({ user, profile }: IdentityProps) {
    if (!profile) return <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />;

    return (
        <div className="relative">
            {/* Holographic Card Effect */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl shadow-slate-900/20 group"
            >
                {/* Background Art */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-slate-700 rounded-full blur-[100px] opacity-30" />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1">
                                <img
                                    src={profile.avatar_url || 'https://github.com/shadcn.png'}
                                    className="w-full h-full rounded-xl object-cover"
                                    alt="Avatar"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic tracking-wide">{profile.username || 'Titan Recruit'}</h2>
                                <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" /> {profile.location || 'Global'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Titan Tier</span>
                            <span className="text-xl font-black italic">ELITE I</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Volume</div>
                            <div className="text-xl font-mono font-bold">128<span className="text-[#D4AF37]">t</span></div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Streak</div>
                            <div className="text-xl font-mono font-bold">14<span className="text-slate-500 text-sm"> days</span></div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Workouts</div>
                            <div className="text-xl font-mono font-bold">42</div>
                        </div>
                    </div>
                </div>

                {/* Edit Button (Hover) */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100">
                    <Edit3 className="w-4 h-4" />
                </button>
            </motion.div>
        </div>
    );
}
