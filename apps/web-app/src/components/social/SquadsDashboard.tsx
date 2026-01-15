"use client";

import { motion } from "framer-motion";
import { Users, Heart, Target, Shield, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_SQUAD = [
    { name: "Starwek", status: "online", avatar: "S", streak: 12, goal: "Force" },
    { name: "Marcus", status: "training", avatar: "M", streak: 8, goal: "Endurance" },
    { name: "Sarah", status: "offline", avatar: "S", streak: 15, goal: "Perte" },
    { name: "Alex", status: "offline", avatar: "A", streak: 3, goal: "Masse" },
];

export function SquadsDashboard() {
    const totalStreak = MOCK_SQUAD.reduce((acc, curr) => acc + curr.streak, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                    <Shield className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37]/20" /> Mon Groupe : "Iron Wolves"
                </h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                    <Users className="w-4 h-4" />
                    4 Membres
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: Group Progress */}
                <div className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Consistance Collective</span>
                        <div className="text-5xl font-black text-white mt-2 tracking-tighter">
                            {totalStreak} <span className="text-lg text-[#D4AF37]">jours cumulés</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Ensemble, vous avez maintenu votre engagement.</p>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Objectif de groupe cette semaine</span>
                                <span className="text-[#D4AF37]">3/4 actifs</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D4AF37] w-[75%] shadow-[0_0_10px_#D4AF37]" />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            {MOCK_SQUAD.map((member, i) => (
                                <div key={i} className="relative group/avatar cursor-pointer">
                                    <div className={cn(
                                        "w-11 h-11 rounded-full border-2 shadow-lg flex items-center justify-center font-black text-sm transition-all",
                                        member.status === 'online' ? 'bg-[#D4AF37] border-[#D4AF37] text-black' :
                                            member.status === 'training' ? 'bg-[#1a1a1a] border-[#D4AF37]/50 text-[#D4AF37]' :
                                                'bg-[#1a1a1a] border-white/10 text-gray-500'
                                    )}>
                                        {member.avatar}
                                    </div>
                                    {member.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0F0F0F] rounded-full" />}
                                    {member.status === 'training' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#D4AF37] border-2 border-[#0F0F0F] rounded-full animate-pulse" />}
                                </div>
                            ))}
                            <button className="w-11 h-11 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors text-xl">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Members & Their Goals */}
                <div className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 overflow-hidden">
                    <div className="p-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                        <span className="font-black text-white uppercase tracking-widest text-sm">Membres & Objectifs</span>
                        <Heart className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="divide-y divide-white/5">
                        {MOCK_SQUAD.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                                        member.status === 'online' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-400'
                                    )}>
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Objectif: {member.goal}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-sm">
                                        <Calendar className="w-3 h-3" />
                                        {member.streak}j
                                    </div>
                                    <p className="text-[10px] text-gray-600">Série</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
