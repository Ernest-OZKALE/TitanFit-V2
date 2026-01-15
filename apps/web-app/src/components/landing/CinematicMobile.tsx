'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Activity, Battery, Calendar, BarChart3, Clock, TrendingUp, Zap } from 'lucide-react';

export default function CinematicMobile() {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'end start']
    });

    const rotateX = useTransform(scrollYProgress, [0.2, 0.8], [20, 0]);
    const rotateY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [-15, 0, 15]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.9, 1.1, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={container} className="relative h-[150vh] flex items-center justify-center overflow-hidden bg-white perspective-1000">
            {/* --- NEBULA GLOW (LIGHT) --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            {/* --- FLOATING LABEL --- */}
            <motion.div style={{ opacity }} className="absolute top-24 text-center z-20">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-md mb-6 shadow-sm">
                    <Activity className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-bold text-sm tracking-[0.2em] uppercase">Titan Analytics // Intégrale</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter">
                    Votre Biologie <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">Quantifiée</span>
                </h2>
            </motion.div>

            {/* --- THE ARTIFACT (PHONE) - SILVER EDITION --- */}
            <motion.div
                style={{ rotateX, rotateY, scale, opacity }}
                className="relative z-10 w-[380px] h-[780px] bg-white border-[12px] border-slate-200 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-visible ring-1 ring-slate-300"
            >
                {/* FLOATING INSIGHT (Realistic Notification) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: -100, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-48 right-full w-64 p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.2)] z-50 flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                        <div className="text-[#D4AF37] font-bold text-xs uppercase">Adaptation Confirmée</div>
                        <div className="text-slate-900 font-bold text-sm">+2.5kg (Surcharge Progressive)</div>
                        <div className="text-slate-500 text-[10px]">Cycle Hypertrophie #4</div>
                    </div>
                </motion.div>

                {/* Metal Frame Reflection */}
                <div className="absolute inset-0 rounded-[48px] border border-white/50 pointer-events-none z-40" />

                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-7 bg-slate-200 w-[140px] mx-auto rounded-b-2xl z-50 shadow-sm" />

                {/* --- SCREEN CONTENT: DASHBOARD V2 (Light) --- */}
                <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden rounded-[46px]">
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                    {/* Header */}
                    <div className="p-6 pt-12 flex justify-between items-center relative z-10">
                        <div>
                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Temps Réel</div>
                            <h3 className="text-slate-900 font-black text-2xl">Mardi 24 Oct.</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                            <img src="/assets/images/sarah_after.png?v=2" className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    </div>

                    {/* READINESS CARD (The "Morning Check") */}
                    <div className="px-6 relative z-10 mb-6">
                        <div className="p-5 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-20 h-20 text-slate-900" /></div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Potentiel Nerveux</div>
                                    <div className="text-5xl font-black text-slate-900">92<span className="text-base text-slate-400 font-bold">%</span></div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase border border-emerald-100">
                                    Optimal
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                                <div className="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-emerald-400" />
                            </div>

                            <div className="flex gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1"><Brain className="w-3 h-3 text-purple-500" /> SNC: 98%</div>
                                <div className="flex items-center gap-1"><Battery className="w-3 h-3 text-amber-500" /> Récup: 7h45</div>
                            </div>
                        </div>
                    </div>

                    {/* TODAY'S PLAN (The "Action") */}
                    <div className="px-6 relative z-10 flex-1">
                        <div className="flex justify-between items-end mb-4">
                            <h4 className="text-slate-900 font-bold text-lg">Programme du jour</h4>
                            <span className="text-[#D4AF37] text-xs font-bold uppercase">Optimisé par Algo</span>
                        </div>

                        <div className="p-5 rounded-3xl bg-[#D4AF37] text-black relative group overflow-hidden shadow-[0_10px_30px_-10px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 className="w-24 h-24 text-black" /></div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-black/60 text-xs font-black uppercase tracking-widest mb-1">Push Day</div>
                                    <div className="text-3xl font-black leading-none">Pecs &<br />Triceps</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-black" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-bold border-b border-black/10 pb-2">
                                    <span>Développé Couché</span>
                                    <span>4 x 8 @ 100kg</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold border-b border-black/10 pb-2">
                                    <span>Dips Lestés</span>
                                    <span>3 x 10 @ BW+20</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold">
                                    <span>Extensions Poulie</span>
                                    <span>3 x 15 (Drop Set)</span>
                                </div>
                            </div>
                        </div>

                        {/* NUTRITION SNAPSHOT */}
                        <div className="mt-6 flex gap-3">
                            <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                <div className="text-slate-400 text-[10px] uppercase font-bold">Calories</div>
                                <div className="text-slate-900 font-black text-xl">1,240 <span className="text-xs text-slate-400">restantes</span></div>
                            </div>
                            <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                <div className="text-slate-400 text-[10px] uppercase font-bold">Protéines</div>
                                <div className="text-slate-900 font-black text-xl">180g <span className="text-xs text-[#D4AF37]">Cible</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 mt-auto">
                        <div className="flex justify-center">
                            <div className="w-1/3 h-1 bg-slate-300 rounded-full" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
