'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'; // Added useAnimation
import { Dumbbell, Utensils, Brain, Activity, Zap, Users, ArrowUpRight, Lock, Moon, Sun, Heart } from 'lucide-react';
import { variants, transitions } from '@/lib/animation-utils';
import { Switch } from '@/components/ui/switch';

// --- VISUAL COMPONENTS ---

const ActivityRings = () => (
    <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Ring (Red) - Moving */}
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
            <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="rgba(0,0,0,0.08)" strokeWidth="8" fill="none" />
                <motion.circle
                    cx="64" cy="64" r="58"
                    stroke="#EF4444" strokeWidth="8" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.75 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="drop-shadow-sm"
                />
            </svg>
        </div>

        {/* Middle Ring (Green) - Static but pulsing */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-75">
            <circle cx="64" cy="64" r="58" stroke="rgba(0,0,0,0.08)" strokeWidth="10" fill="none" />
            <motion.circle
                cx="64" cy="64" r="58"
                stroke="#22C55E" strokeWidth="10" fill="none" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 0.6 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                // @ts-ignore
                transition={{ duration: 3, repeat: Infinity }}
                className="drop-shadow-sm"
            />
        </svg>

        {/* Inner Ring (Blue) - Reverse Spin */}
        <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse] scale-50">
            <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="rgba(0,0,0,0.08)" strokeWidth="14" fill="none" />
                <motion.circle
                    cx="64" cy="64" r="58"
                    stroke="#3B82F6" strokeWidth="14" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.85 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                    className="drop-shadow-sm"
                />
            </svg>
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#D4AF37] animate-pulse" />
        </div>
    </div>
);

const MetabolicGraph = () => (
    <div className="w-full h-24 flex items-end justify-between gap-1 px-2">
        {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90].map((h, i) => (
            <motion.div
                key={i}
                className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F5C518] rounded-t-sm"
                initial={{ height: 0, opacity: 0.5 }}
                whileInView={{ height: `${h}%`, opacity: 1 }}
                whileHover={{ height: `${h + 10}%`, filter: "brightness(1.1)" }}
                viewport={{ once: false }} // Re-animate on scroll
                transition={{ duration: 0.8, delay: i * 0.05, type: "spring" }}
            />
        ))}
    </div>
);

const FocusToggle = () => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setIsOn(p => !p), 4000); // Slower toggle
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative p-4 rounded-xl border transition-all duration-500 overflow-hidden ${isOn ? 'bg-white border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-slate-50 border-slate-200'}`}>
            {/* Background Glow when ON */}
            {/* Removed motion.div for background glow */}

            <div className="relative flex items-center justify-between mb-2">
                <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${isOn ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                    {isOn ? 'Focus Mode' : 'Standard'}
                </span>
                <motion.div
                    animate={{ rotate: isOn ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isOn ? <Moon className="w-4 h-4 text-[#D4AF37]" /> : <Sun className="w-4 h-4 text-slate-300" />}
                </motion.div>
            </div>
            <div className="h-6 w-10 bg-slate-100 rounded-full p-1 relative transition-colors duration-300 ml-auto border border-slate-200" style={{ borderColor: isOn ? '#D4AF37' : '#e2e8f0', backgroundColor: isOn ? '#FFF' : '#f1f5f9' }}>
                <motion.div
                    className="h-3.5 w-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: isOn ? '#D4AF37' : '#cbd5e1' }}
                    animate={{ x: isOn ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};

const CountUp = ({ to, suffix = 'g' }: { to: number, suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const controls = {
            value: 0
        };
        // Simple manual implementation since we don't have anime.js
        // In a real app we'd use useInView to trigger
        const interval = setInterval(() => {
            setCount(prev => {
                if (prev >= to) {
                    clearInterval(interval);
                    return to;
                }
                return prev + Math.ceil(to / 20);
            });
        }, 50);

        return () => clearInterval(interval);
    }, [to]);

    return <span>{count}{suffix}</span>;
}


// --- DATA & MAIN COMPONENT ---

const features = [
    {
        title: 'Suivi Métabolique',
        subtitle: 'NE DEVINEZ PLUS. MESUREZ.',
        description: "TitanFit transforme chaque calorie et chaque répétition en donnée exploitable.",
        icon: Activity,
        colSpan: 'md:col-span-2',
        bg: 'bg-white border-slate-200 hover:border-[#D4AF37]/50',
        text: 'text-slate-900',
        visual: <div className="mt-8 relative">
            <div className="flex items-end justify-between mb-2">
                <span className="text-xs font-black tracking-widest text-[#D4AF37]">ADHÉRENCE PLAN</span>
                <span className="text-xl font-black text-slate-900">
                    <CountUp to={98} suffix=".4%" />
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: 0 }}
                    whileInView={{ width: '98.4%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </div>
            <MetabolicGraph />
        </div>
    },
    {
        title: 'Bio-Sync™',
        subtitle: 'TEMPS RÉEL',
        description: "Compatible Apple Health, Google Fit & Garmin.",
        icon: Zap,
        colSpan: 'md:col-span-1',
        bg: 'bg-white border-slate-200 hover:border-[#D4AF37]/50',
        text: 'text-slate-900',
        visual: <div className="mt-6 flex justify-center scale-110">
            <ActivityRings />
        </div>
    },
    {
        title: 'Focus Absolu',
        subtitle: 'ZÉRO DISTRACTION',
        description: "Interface adaptative qui élimine le bruit mental.",
        icon: Moon,
        colSpan: 'md:col-span-1',
        bg: 'bg-white border-slate-200 hover:border-[#D4AF37]/50',
        text: 'text-slate-900',
        visual: <div className="mt-6">
            <FocusToggle />
        </div>
    },
    {
        title: 'Nutrition de Précision',
        subtitle: 'CALCUL DYNAMIQUE',
        description: "Vos macros s'ajustent automatiquement selon votre dépense journalière.",
        icon: Utensils,
        colSpan: 'md:col-span-2',
        bg: 'bg-white border-slate-200 hover:border-[#D4AF37]/50',
        text: 'text-slate-900',
        visual: <div className="mt-6 grid grid-cols-3 gap-2">
            {['Proteines', 'Glucides', 'Lipides'].map((macro, i) => (
                <motion.div
                    key={i}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center shadow-sm"
                    whileHover={{ scale: 1.05, backgroundColor: "#FFF", borderColor: "#D4AF37" }}
                >
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">{macro}</div>
                    <div className="text-lg font-black text-slate-900 leading-none">
                        <CountUp to={[180, 240, 65][i]} />
                    </div>
                </motion.div>
            ))}
        </div>
    },
];

const BentoCard = ({ feature, index }: { feature: any; index: number }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            variants={variants.slideUp}
            className={`relative overflow-hidden rounded-[2rem] p-8 border shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)] transition-all duration-500 ${feature.colSpan} ${feature.bg} ${feature.text} group`}
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(212,175,55,0.05), transparent 40%)`,
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-slate-50 text-slate-500 border border-slate-100 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5 group-hover:text-[#D4AF37] transition-colors duration-300`}>
                        <feature.icon className="w-3 h-3" />
                        {feature.title}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight leading-tight text-slate-900 group-hover:text-black transition-colors">{feature.subtitle}</h3>
                    <p className="text-sm md:text-base leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
                        {feature.description}
                    </p>
                </div>

                {feature.visual}
            </div>

            {/* Decorative Texture for Dark Cards */}
            {/* Removed decorative texture as cards are now light */}
        </motion.div>
    );
};

export default function BentoFeatures() {
    return (
        <section className="py-24 px-4 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={variants.staggerContainer}
                    className="mb-16 text-center"
                >
                    <motion.h2 variants={variants.slideUp} className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        L'ÉCOSYSTÈME <span className="text-[#D4AF37]">COMPLET</span>
                    </motion.h2>
                    <motion.p variants={variants.slideUp} className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Le coaching n'est que le début. Voici les armes qui feront de votre transformation une certitude mathématique.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={variants.staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, i) => (
                        <BentoCard key={i} feature={feature} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
