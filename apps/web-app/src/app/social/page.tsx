'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Flame, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';

const leaderboard = [
    { rank: 1, name: 'Ernest O.', xp: 12500, tier: 'Titan' },
    { rank: 2, name: 'Sarah Conner', xp: 11200, tier: 'Elite' },
    { rank: 3, name: 'Marcus F.', xp: 9800, tier: 'Elite' },
    { rank: 4, name: 'David G.', xp: 8500, tier: 'Pro' },
    { rank: 5, name: 'You', xp: 450, tier: 'Rookie', isMe: true }, // Dynamic insertion in real app
];

const feed = [
    { id: 1, user: 'Sarah Conner', action: 'a terminé', target: 'Titan Push Protocol', time: '2 min', likes: 12 },
    { id: 2, user: 'Ernest O.', action: 'a atteint', target: 'Niveau 40', time: '15 min', likes: 45 },
    { id: 3, user: 'Marcus F.', action: 'a loggé', target: '3200 kcal', time: '1h', likes: 5 },
];

export default function SocialPage() {
    return (
        <div className="pb-32 max-w-4xl mx-auto">
            <header className="mb-12 text-center pt-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">La Tribu</h1>
                <p className="text-slate-500 text-sm font-medium">Classement & Actualités</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: LEADERBOARD */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Trophy className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Top Classement</h3>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-900/5">
                        {leaderboard.map((user, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 ${user.isMe ? 'bg-[#D4AF37]/10' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-[#D4AF37] text-white' :
                                            i === 1 ? 'bg-slate-300 text-white' :
                                                i === 2 ? 'bg-[#CD7F32] text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {user.rank}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${user.isMe ? 'text-[#D4AF37]' : 'text-slate-900'}`}>{user.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{user.tier}</div>
                                    </div>
                                </div>
                                <div className="font-mono text-xs font-bold text-slate-500">{user.xp} XP</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: FEED */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Users className="w-5 h-5 text-slate-400" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Flux Live</h3>
                    </div>

                    <div className="space-y-4">
                        {feed.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900">
                                            <span className="font-bold">{post.user}</span>
                                            <span className="text-slate-500"> {post.action} </span>
                                            <span className="font-bold text-[#D4AF37]">{post.target}</span>
                                        </p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-xs text-slate-400 font-medium">{post.time}</span>
                                            <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                                                <Heart className="w-4 h-4" /> {post.likes}
                                            </button>
                                            <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                                <MessageCircle className="w-4 h-4" /> Commenter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
