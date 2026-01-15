'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Smartphone, CheckCircle } from 'lucide-react';

export default function MobileShowcase() {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'end start']
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [200, -200]);

    return (
        <section ref={container} className="py-32 px-4 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-20">
                {/* --- TEXT CONTENT --- */}
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-8">
                        <Smartphone className="w-4 h-4" />
                        <span>Titan Pocket</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase leading-tight">
                        L'Élite <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Dans Votre Poche</span>
                    </h2>
                    <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto md:mx-0">
                        Que vous soyez à la salle ou en déplacement, TitanFit synchronise vos données en temps réel. Accédez à votre coach IA 24/7.
                    </p>
                    <ul className="space-y-4 text-left max-w-xs mx-auto md:mx-0">
                        <li className="flex items-center gap-4 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                            <span>Mode Hors-Ligne</span>
                        </li>
                        <li className="flex items-center gap-4 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                            <span>Synchro Apple Health</span>
                        </li>
                        <li className="flex items-center gap-4 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                            <span>Notifications Intelligentes</span>
                        </li>
                    </ul>
                </div>

                {/* --- PHONES --- */}
                <div className="flex-1 relative h-[600px] w-full flex justify-center md:justify-end">
                    {/* Phone 1 (Back) */}
                    <motion.div style={{ y: yRight }} className="absolute right-0 md:right-20 top-0 w-[280px] h-[550px] bg-white border-[8px] border-slate-200 rounded-[40px] shadow-2xl z-0 overflow-hidden hidden md:block opacity-50 scale-90 blur-[2px]">
                        <div className="absolute inset-x-0 top-0 h-6 bg-slate-200 z-20 rounded-b-xl" />
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                            <span className="text-slate-200 font-black text-4xl -rotate-90">TITAN</span>
                        </div>
                    </motion.div>

                    {/* Phone 2 (Front) */}
                    <motion.div style={{ y: yLeft }} className="relative w-[300px] h-[600px] bg-white border-[8px] border-slate-200 rounded-[45px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 inset-x-0 h-7 bg-slate-200 w-1/2 mx-auto rounded-b-xl z-20" />

                        {/* Screen Content */}
                        <div className="w-full h-full bg-white flex flex-col relative">
                            {/* App Header */}
                            <div className="p-6 pt-12 flex justify-between items-center border-b border-slate-100">
                                <span className="font-bold text-slate-900">Bonjour Atlas</span>
                                <div className="w-8 h-8 rounded-full bg-slate-100" />
                            </div>

                            {/* App Body */}
                            <div className="flex-1 p-6 flex flex-col gap-4">
                                <div className="bg-[#D4AF37] rounded-2xl p-6 text-black shadow-lg">
                                    <h4 className="font-bold text-sm opacity-80 uppercase mb-1">Séance du Jour</h4>
                                    <div className="text-3xl font-black mb-2">PUSH POWER</div>
                                    <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                                        <span>45 min</span>
                                        <span>•</span>
                                        <span>Haute Intensité</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 aspect-square flex flex-col justify-center items-center gap-2">
                                        <div className="text-2xl font-bold text-slate-900">1,200</div>
                                        <div className="text-xs text-slate-500 uppercase">Kcal</div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 aspect-square flex flex-col justify-center items-center gap-2">
                                        <div className="text-2xl font-bold text-slate-900">142</div>
                                        <div className="text-xs text-slate-500 uppercase">BPM</div>
                                    </div>
                                </div>
                            </div>

                            {/* App Tab Bar */}
                            <div className="h-20 border-t border-slate-100 flex justify-around items-center px-6 pb-4">
                                <div className="w-6 h-6 rounded-full bg-[#D4AF37]" />
                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
