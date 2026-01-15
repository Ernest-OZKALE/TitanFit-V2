'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Database, Lock, ArrowRight, Network, Zap, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: "NEURAL ENGINE",
        subtitle: "L'Intelligence Pure",
        desc: "Notre modèle propriétaire analyse 50+ biomarqueurs pour prédire vos besoins avant même que vous ne les ressentiez. Fatigue, récupération, pic d'énergie : Titan sait tout.",
        color: "from-blue-600 to-cyan-400",
        accent: "text-blue-400"
    },
    {
        icon: Zap,
        title: "ADAPTIVE FUEL",
        subtitle: "Nutrition Cyclique",
        desc: "Fini les régimes statiques. Titan ajuste vos macros jour par jour. Carb-cycling les jours de jambes, Jeûne métabolique les jours de repos. La précision au gramme près.",
        color: "from-[#D4AF37] to-amber-500",
        accent: "text-[#D4AF37]"
    },
    {
        icon: ShieldCheck,
        title: "IRON SHIELD",
        subtitle: "Zero-Knowledge",
        desc: "Vos données de santé sont les plus précieuses. Cryptées localement sur votre appareil. Même nous ne pouvons pas voir vos statistiques brutes. Vie privée absolue.",
        color: "from-emerald-500 to-green-400",
        accent: "text-emerald-400"
    }
];

export default function CinematicFeatures() {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'end start']
    });

    const x = useTransform(scrollYProgress, [0, 1], ['20%', '-50%']);
    const springX = useSpring(x, { stiffness: 100, damping: 30, mass: 0.5 });

    return (
        <section ref={container} className="relative py-48 overflow-hidden bg-white flex flex-col justify-center">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="text-center mb-32 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
                >
                    <Network className="w-3 h-3 text-slate-900" />
                    <span>Deep Tech</span>
                </motion.div>
                <h2 className="text-6xl md:text-9xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-[0.8]">
                    Technologie <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-800">Profonde</span>
                </h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="absolute top-0 left-0 w-[15vw] h-full bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[15vw] h-full bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

                <motion.div style={{ x: springX }} className="flex gap-12 pl-[20vw] pr-[20vw] cursor-grab active:cursor-grabbing">
                    {features.map((f, i) => (
                        <div key={i} className={`relative flex-shrink-0 w-[85vw] md:w-[700px] h-[500px] rounded-[3rem] overflow-hidden border border-slate-200 group shadow-lg hover:shadow-xl transition-all duration-500`}>
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-white" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-5 group-hover:opacity-10 transition-opacity duration-700`} />

                            {/* Inner Glow */}
                            <div
                                className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br ${f.color} blur-[100px] opacity-20 group-hover:scale-150 transition-transform duration-700`}
                            />

                            <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}>
                                        <f.icon className={`w-10 h-10 ${f.accent}`} />
                                    </div>
                                    <div className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50/50 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                        V13.0 System
                                    </div>
                                </div>

                                <div>
                                    <div className="overflow-hidden mb-2">
                                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter transform translate-y-0 transition-transform duration-500">
                                            {f.title}
                                        </h3>
                                    </div>
                                    <p className={`text-xl font-bold ${f.accent} uppercase tracking-wide mb-8`}>{f.subtitle}</p>

                                    <div className="relative">
                                        <p className="text-xl text-slate-500 leading-relaxed font-light max-w-lg group-hover:text-slate-900 transition-colors duration-500">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
