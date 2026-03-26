'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Smartphone, MessageCircle, Heart, Flame, Bell } from 'lucide-react';

export default function MobileShowcase4D() {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'end start']
    });

    const yPhone = useTransform(scrollYProgress, [0, 1], [100, -100]);
    // Particles moving at different speeds (Parallax 4D effect)
    const yP1 = useTransform(scrollYProgress, [0, 1], [400, -400]);
    const yP2 = useTransform(scrollYProgress, [0, 1], [200, -600]);
    const yP3 = useTransform(scrollYProgress, [0, 1], [600, -200]);
    const yP4 = useTransform(scrollYProgress, [0, 1], [300, -500]);

    // Scale effect for cinematic entry
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
        <section ref={container} className="relative min-h-[150vh] flex items-center justify-center overflow-hidden bg-black py-20">
            {/* --- BACKDROP GLOW --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#D4AF37]/5 to-black pointer-events-none" />

            {/* --- FLOATING PARTICLES (4D DATA FIELD) --- */}

            {/* Particle 1: Notification */}
            <motion.div style={{ y: yP1, right: '10%' }} className="absolute top-[20%] z-20 bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/30 shadow-2xl max-w-[200px] hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center"><Bell className="w-4 h-4 text-black" /></div>
                    <span className="text-[#D4AF37] font-bold text-xs uppercase">Coach IA</span>
                </div>
                <p className="text-white text-sm font-medium">"Augmente le repos de 30s. Ton rythme cardiaque est encore haut."</p>
            </motion.div>

            {/* Particle 2: Heart Rate Bubble */}
            <motion.div style={{ y: yP2, left: '15%' }} className="absolute top-[40%] z-20 bg-black/80 backdrop-blur-md rounded-full w-32 h-32 border border-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)] flex flex-col items-center justify-center hidden md:flex">
                <Heart className="w-8 h-8 text-red-500 animate-pulse mb-1" />
                <span className="text-3xl font-black text-white">165</span>
                <span className="text-xs text-gray-500 uppercase">BPM</span>
            </motion.div>

            {/* Particle 3: Calorie Spark */}
            <motion.div style={{ y: yP3, right: '20%' }} className="absolute top-[60%] z-0 bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-orange-500/20 flex items-center gap-3 hidden md:flex opacity-60">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-white font-mono text-lg">850 kcal</span>
            </motion.div>

            {/* Particle 4: Workout Complete */}
            <motion.div style={{ y: yP4, left: '25%' }} className="absolute top-[80%] z-20 bg-[#D4AF37] text-black rounded-lg py-2 px-4 font-bold shadow-lg transform -rotate-6 hidden md:block">
                SÉANCE VALIDÉE
            </motion.div>


            {/* --- MAIN PHONE (CINEMATIC CENTER) --- */}
            <motion.div style={{ y: yPhone, scale }} className="relative z-10 w-[320px] md:w-[380px] h-[650px] md:h-[750px] bg-black border-[10px] border-[#1a1a1a] rounded-[50px] shadow-[0_0_100px_-20px_rgba(212,175,55,0.2)] overflow-hidden">
                {/* Reflective Glare */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-30" />

                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-8 bg-[#1a1a1a] w-1/2 mx-auto rounded-b-xl z-30" />

                {/* Screen */}
                <div className="w-full h-full bg-zinc-950 flex flex-col">
                    {/* Header */}
                    <div className="p-8 pt-16 flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase block mb-1">Live Tracking</span>
                            <span className="text-3xl font-black text-white">WORKOUT</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                    </div>

                    {/* Timeline Interaction */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-y-0 left-8 w-[2px] bg-white/10" />

                        <div className="p-6 pl-16 space-y-8 relative z-10">
                            {/* Item 1 */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-2 w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                                <h4 className="text-white font-bold text-lg">Bench Press</h4>
                                <p className="text-gray-500 text-sm">4 séries x 10 reps @ 100kg</p>
                            </div>

                            {/* Item 2 (Active) */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-2 w-4 h-4 rounded-full bg-white border-4 border-black" />
                                <h4 className="text-white font-bold text-lg opacity-50">Incline Dumbbell</h4>
                                <p className="text-gray-500 text-sm">3 séries x 12 reps @ 32kg</p>
                            </div>

                            {/* Item 3 */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-2 w-4 h-4 rounded-full bg-zinc-800" />
                                <h4 className="text-white font-bold text-lg opacity-30">Cable Flys</h4>
                                <p className="text-gray-600 text-sm">Finisher • Drop set</p>
                            </div>
                        </div>

                        {/* Faux Chat Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-20">
                            <div className="bg-[#1a1a1a]/90 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex-shrink-0 flex items-center justify-center font-bold text-black">AI</div>
                                <div>
                                    <p className="text-white text-sm font-medium">"Ton dernier set était explosif. Je monte la charge pour le prochain exercice. Prêt ?"</p>
                                    <div className="flex gap-2 mt-3">
                                        <button className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-lg hover:brightness-110">OUI, LET'S GO</button>
                                        <button className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20">NON, TROP LOURD</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
