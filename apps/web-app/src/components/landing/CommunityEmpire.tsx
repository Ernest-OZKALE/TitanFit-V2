'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Swords, Crown, Target, Zap } from 'lucide-react';

export default function CommunityEmpire() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Chaos */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Left: Content */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-8">
                            <Users className="w-4 h-4" />
                            <span>Rejoignez l'Élite</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-[0.9]">
                            Ne Vous Entraînez <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-600">Plus Jamais Seul</span>
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl">
                            La salle peut être solitaire. Pas ici. Rejoignez un Clan, affrontez d'autres Titans dans des batailles hebdomadaires, et gravissez les échelons de la gloire.
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center group hover:bg-slate-50 transition-colors shadow-sm">
                                <Trophy className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-slate-900 font-bold text-lg">Leaderboards</div>
                                <div className="text-xs text-slate-500">Mondial & Local</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center group hover:bg-slate-50 transition-colors shadow-sm">
                                <Swords className="w-8 h-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-slate-900 font-bold text-lg">Batailles</div>
                                <div className="text-xs text-slate-500">1v1 & Clan Wars</div>
                            </div>
                        </div>

                        <button className="mt-10 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:scale-105 transition-all shadow-lg">
                            Rejoindre le Discord
                        </button>
                    </div>

                    {/* Right: Visual Rank System (The "Hype" Part) */}
                    <div className="flex-1 relative w-full aspect-square md:aspect-auto h-[600px] flex items-center justify-center perspective-1000">
                        {/* Glowing Portal */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent rounded-full blur-[80px]" />

                        {/* Card Stack */}
                        <div className="relative z-10 w-full max-w-sm">
                            {/* Titanium Card (Top) */}
                            <motion.div
                                initial={{ y: 20, rotateX: 10 }}
                                whileInView={{ y: 0, rotateX: 0 }}
                                transition={{ duration: 0.8 }}
                                className="h-64 bg-slate-50 rounded-3xl border border-[#D4AF37] shadow-[0_20px_50px_-10px_rgba(212,175,55,0.2)] p-6 flex flex-col justify-between transform -translate-y-24 z-30 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-[#D4AF37]/10 opacity-50" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <Crown className="w-10 h-10 text-[#D4AF37] fill-[#D4AF37]/20" />
                                    <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">TOP 1%</div>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1">Rang Actuel</div>
                                    <div className="text-4xl font-black text-slate-900 tracking-widest uppercase text-shadow-glow">Titan</div>
                                    <div className="w-full h-1 bg-slate-700 rounded-full mt-4 overflow-hidden">
                                        <div className="w-full h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Gold Card (Middle) */}
                            <motion.div
                                initial={{ scale: 0.9, y: 0 }}
                                whileInView={{ scale: 0.9, y: 60 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="absolute top-10 inset-x-4 h-64 bg-gradient-to-br from-white to-slate-100 rounded-3xl border border-yellow-500/30 p-6 flex flex-col justify-between z-20 opacity-80 shadow-xl"
                            >
                                <div className="flex justify-between items-start">
                                    <Target className="w-10 h-10 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Rang Suivant</div>
                                    <div className="text-4xl font-black text-slate-400 tracking-widest uppercase">Gold</div>
                                </div>
                            </motion.div>

                            {/* Silver Card (Bottom) */}
                            <motion.div
                                initial={{ scale: 0.8, y: 0 }}
                                whileInView={{ scale: 0.8, y: 120 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="absolute top-20 inset-x-8 h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border border-slate-300 p-6 flex flex-col justify-between z-10 opacity-60 shadow-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <Zap className="w-10 h-10 text-slate-400" />
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Débutant</div>
                                    <div className="text-4xl font-black text-slate-400 tracking-widest uppercase">Iron</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
