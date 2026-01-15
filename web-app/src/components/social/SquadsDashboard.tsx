"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Crown, Zap, Shield } from "lucide-react";
import { GlassCard, PremiumProgressBar } from "@/components/ui/premium-components";

const MOCK_SQUAD = [
    { name: "Starwek", rank: "Titan", score: 12500, status: "online", avatar: "S" },
    { name: "Marcus", rank: "Elite", score: 11200, status: "training", avatar: "M" },
    { name: "Sarah", rank: "Elite", score: 10800, status: "offline", avatar: "S" },
    { name: "Alex", rank: "Rookie", score: 8500, status: "offline", avatar: "A" },
];

export function SquadsDashboard() {
    const totalScore = MOCK_SQUAD.reduce((acc, curr) => acc + curr.score, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]/20" /> My Squad: "Iron Wolves"
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full text-white text-xs font-bold uppercase">
                    <Trophy className="w-4 h-4 text-[#D4AF37]" />
                    Rank #42
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: Squad Stats */}
                <GlassCard className="flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Squad Score</span>
                        <div className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">
                            {totalScore.toLocaleString()} <span className="text-lg text-[#D4AF37]">XP</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Weekly Objective</span>
                                <span>85%</span>
                            </div>
                            <PremiumProgressBar value={85} showValue={false} className="h-3" />
                        </div>
                        <div className="flex gap-2">
                            {MOCK_SQUAD.map((member, i) => (
                                <div key={i} className="relative group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                                        {member.avatar}
                                    </div>
                                    {member.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                                    {member.status === 'training' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#D4AF37] border-2 border-white rounded-full animate-pulse" />}
                                </div>
                            ))}
                            <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                                +
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* RIGHT: Leaderboard */}
                <GlassCard className="p-0 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-900">Internal Ranking</span>
                        <Crown className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="divide-y divide-slate-100">
                        {MOCK_SQUAD.map((member, i) => (
                            <div key={member.name} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`text-lg font-black w-6 ${i === 0 ? 'text-[#D4AF37]' : 'text-slate-300'}`}>0{i + 1}</span>
                                    <div>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            {member.name}
                                            {member.rank === 'Titan' && <Zap className="w-3 h-3 text-[#D4AF37] fill-current" />}
                                        </p>
                                        <p className="text-xs text-slate-400 capitalize">{member.rank}</p>
                                    </div>
                                </div>
                                <div className="font-mono font-bold text-slate-600">
                                    {member.score.toLocaleString()} XP
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
