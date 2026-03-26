'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Watch, PlayCircle, Moon, Lock, Zap, Target, Activity } from 'lucide-react';

export default function VisualArsenal() {
    return (
        <section className="py-24 px-4 bg-white/0">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                    L'Écosystème <span className="text-[#D4AF37]">Complet</span>
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Le coaching n'est que le début. Voici les armes qui feront de votre transformation une certitude mathématique.
                </p>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
                className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]"
            >
                {/* CARD 1: PERFORMANCE TRACKING (Replaces Gamification) */}
                <motion.div
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } } }}
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-8 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] cursor-default"
                >
                    <div className="absolute inset-0 bg-slate-50/50 opacity-20" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-[80px] rounded-full group-hover:bg-[#D4AF37]/20 transition-all" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
                                <Activity className="w-3 h-3" />
                                <span>Suivi Métabolique</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 uppercase mb-2">Ne devinez plus.<br />Mesurez.</h3>
                            <p className="text-slate-500 max-w-md">
                                Chaque répétition, chaque calorie, chaque heure de sommeil est une donnée. TitanFit transforme ces données en plan d'action précis.
                            </p>
                        </div>

                        {/* Visual: Pro Dashboard Card */}
                        <div className="mt-8 flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-1 shadow-sm transform group-hover:scale-105 transition-transform border border-slate-200">
                                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-slate-100">
                                    <TrendingUp className="w-10 h-10 text-[#D4AF37]" />
                                </div>
                            </div>
                            <div className="space-y-3 flex-1 max-w-xs">
                                <div className="flex justify-between text-xs font-bold text-slate-900 uppercase">
                                    <span>Adhérence Plan</span>
                                    <span className="text-[#D4AF37]">98.4%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#D4AF37] w-[98.4%]" />
                                </div>
                                <div className="text-[10px] text-slate-500">Projection : Objectif atteint dans 4 semaines.</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CARD 2: BIO-SYNC (Tall) */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
                    whileHover={{ y: -5 }}
                    className="md:row-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] cursor-default"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all" />

                    <div className="relative z-10 flex flex-col h-full items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                            <Watch className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase mb-4">Bio-Sync™</h3>
                        <p className="text-sm text-slate-500 mb-8">
                            Compatible Apple Health, Google Fit & Garmin. Vos calories actives ajustent votre nutrition en temps réel.
                        </p>

                        {/* Animated Rings */}
                        <div className="relative w-40 h-40 mt-auto group-hover:scale-110 transition-transform duration-700">
                            {/* Ring 1 */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#1c1c1c" strokeWidth="12" fill="none" />
                                <circle cx="80" cy="80" r="70" stroke="#ef4444" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="100" strokeLinecap="round" />
                            </svg>
                            {/* Ring 2 */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-75">
                                <circle cx="80" cy="80" r="70" stroke="#1c1c1c" strokeWidth="12" fill="none" />
                                <circle cx="80" cy="80" r="70" stroke="#22c55e" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="150" strokeLinecap="round" />
                            </svg>
                            {/* Ring 3 */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-50">
                                <circle cx="80" cy="80" r="70" stroke="#1c1c1c" strokeWidth="12" fill="none" />
                                <circle cx="80" cy="80" r="70" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="40" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* CARD 3: ACADEMY (Medium) */}
                <motion.div
                    variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } }}
                    whileHover={{ y: -5 }}
                    className="rounded-[2.5rem] bg-white border border-slate-200 p-8 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] cursor-default"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                    {/* Fake Video Thumb */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-20 h-full flex flex-col justify-end">
                        <div className="w-12 h-12 rounded-full bg-white backdrop-blur-md flex items-center justify-center mb-4 border border-slate-200 group-hover:bg-red-600 group-hover:border-red-600 transition-colors shadow-lg">
                            <PlayCircle className="w-6 h-6 text-slate-900 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 uppercase">Académie Titan</h3>
                        <p className="text-xs text-slate-500">100+ Masterclasses Techniques sur l'exécution parfaite.</p>
                    </div>
                </motion.div>

                {/* CARD 4: ZEN MODE (Medium) */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
                    whileHover={{ y: -5 }}
                    className="rounded-[2.5rem] bg-white border border-slate-200 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] cursor-default"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-slate-900 uppercase">Focus Absolu</h3>
                            <Moon className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Interface sombre, zéro distraction. Juste vous et la fonte.
                        </p>

                        {/* Toggle Visual */}
                        <div className="mt-4 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                            <div className="w-10 h-6 bg-purple-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                            <span className="text-xs font-bold text-slate-900">Focus Mode: ON</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
