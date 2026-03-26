'use client';

import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Activity, Zap, Brain, Send, Lock, Verified, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AppShowcase() {
    const containerRef = useRef<HTMLDivElement>(null!);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), { stiffness: 100, damping: 30 });
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Mouse Spotlight Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section ref={containerRef} className="py-32 min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">

            {/* === AMBIENT LIQUID GOLD BACKGROUND - LIGHT === */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08),transparent_70%)] animate-pulse" />
                <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[#D4AF37]/5 blur-[120px] animate-[bounce_10s_infinite]" />
                <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-slate-200/40 blur-[150px] animate-[pulse_8s_infinite]" />
            </div>

            <div className="container relative z-10 max-w-7xl px-6">

                {/* === CINEMATIC HEADER === */}
                <div className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-md cursor-default transition-colors"
                    >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Performance Absolue</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                        L'ÉVOLUTION <br />
                        <span className="text-[#D4AF37] drop-shadow-sm">BIOLOGIQUE.</span>
                    </h2>

                    <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed font-light">
                        Plus qu'une méthode. Une extension de votre volonté qui transforme vos efforts en <span className="text-slate-900 font-medium bg-[#D4AF37]/10 px-1 rounded">résultats concrets</span>.
                    </p>
                </div>

                {/* === THE MONOLITH (Main Interface) === */}
                <div
                    className="relative max-w-5xl mx-auto group"
                    onMouseMove={handleMouseMove}
                >
                    {/* Glowing Spotlight Border */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    650px circle at ${mouseX}px ${mouseY}px,
                                    rgba(212, 175, 55, 0.4),
                                    transparent 80%
                                )
                            `,
                        }}
                    />

                    {/* Glass Slab Container - LIGHT MODE */}
                    <div className="relative rounded-[2.5rem] bg-white border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 h-[800px] flex">

                        {/* --- LEFT PANEL: NAVIGATION & STATS --- */}
                        <div className="hidden md:flex w-80 border-r border-slate-100 flex-col bg-slate-50/50 backdrop-blur-sm p-8 justify-between relative">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] invert" />

                            <div className="space-y-8 relative z-10">
                                {/* User Profile */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] p-[2px] shadow-lg shadow-[#D4AF37]/20">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-slate-100">
                                            <span className="text-[#D4AF37] font-black">E</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-900 font-bold">Ernest</div>
                                        <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Verified className="w-3 h-3" /> Membre Titan
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-2">
                                    <MenuItem icon={Activity} label="Performances" active />
                                    <MenuItem icon={Brain} label="Focus Mental" />
                                    <MenuItem icon={Zap} label="Énergie" />
                                </div>
                            </div>

                            {/* Live Biometrics */}
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Activity className="w-12 h-12 text-[#D4AF37]" />
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider font-bold">
                                    <span>État Actuel</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <BiometricRow label="Pouls" value="42 bpm" />
                                    <BiometricRow label="VFC" value="128 ms" />
                                    <BiometricRow label="Forme" value="98%" highlight />
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT PANEL: THE CHAT INTERFACE --- */}
                        <div className="flex-1 flex flex-col bg-white relative">

                            {/* Header */}
                            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                                    <span className="text-sm font-bold text-slate-900 tracking-wide uppercase">L'Esprit Titan <span className="opacity-50 font-normal ml-2 normal-case tracking-normal text-slate-400">Connecté</span></span>
                                </div>
                                <Lock className="w-4 h-4 text-slate-300" />
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8 custom-scrollbar">

                                <AIMessage
                                    delay={0.2}
                                    content={
                                        <>
                                            <span className="text-[#D4AF37] font-bold mb-2 block text-xs tracking-widest uppercase flex items-center gap-2">
                                                <Activity className="w-3 h-3" /> Bilan de Forme
                                            </span>
                                            J'ai analysé tes ressentis et ta charge d'entraînement. <br /><br />
                                            Ton énergie vitale est à son comble. C'est le moment idéal pour te surpasser au Bench Press.
                                        </>
                                    }
                                />

                                <UserMessage delay={0.8} content="Ok, quel protocole pour préparer mon corps ?" />

                                <AIMessage
                                    delay={1.5}
                                    content={
                                        <>
                                            <span className="text-[#D4AF37] font-bold mb-2 block text-xs tracking-widest uppercase flex items-center gap-2">
                                                <Zap className="w-3 h-3" /> Activation Musculaire
                                            </span>
                                            Voici comment réveiller tes muscles :
                                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> 5min mobilité articulaire</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> 3x Pompes Explosives</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Montée en charge progressive</li>
                                            </ul>
                                        </>
                                    }
                                />

                                {/* Typing Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 3, repeat: Infinity, repeatType: "reverse" }}
                                    className="text-xs text-[#D4AF37] font-medium flex items-center gap-1 pl-4 uppercase tracking-widest"
                                >
                                    Calcul en cours<span className="animate-pulse">...</span>
                                </motion.div>
                            </div>

                            {/* Input Area */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/20 to-slate-200/50 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                                    <div className="relative flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all">
                                        <input
                                            type="text"
                                            placeholder="Interrogez votre potentiel..."
                                            className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                                            disabled
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-lg bg-[#D4AF37] text-white hover:bg-[#b8952b] transition-colors shadow-lg shadow-[#D4AF37]/20"
                                        >
                                            <Send className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === FLOATING FEATURES (Below) === */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto"
                >
                    <FeatureCard
                        icon={Brain}
                        title="Focus Mental"
                        desc="Le système comprend votre fatigue et ajuste l'intensité pour vous préserver."
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Vision Globale"
                        desc="Centralise votre santé, votre sommeil et votre nutrition en une seule vérité."
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Sur-Mesure"
                        desc="Pas de programmes génériques. Chaque conseil est taillé pour votre corps."
                    />
                </motion.div>

            </div>
        </section>
    );
}

// --- SUBCOMPONENTS ---

function MenuItem({ icon: Icon, label, active }: any) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group",
                active ? "bg-[#D4AF37]/10 text-slate-900 border border-[#D4AF37]/20 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}>
            <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-[#D4AF37]" : "text-slate-400 group-hover:text-slate-600")} />
            <span className="text-sm font-bold">{label}</span>
            {active && <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />}
        </motion.div>
    )
}

function BiometricRow({ label, value, highlight }: any) {
    return (
        <div className="flex justify-between items-center text-sm group cursor-default">
            <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">{label}</span>
            <span className={cn("font-mono font-bold", highlight ? "text-[#D4AF37]" : "text-slate-900")}>{value}</span>
        </div>
    )
}

function AIMessage({ content, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="flex gap-4 max-w-lg"
        >
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <Brain className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="p-6 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 text-slate-600 shadow-sm text-sm leading-relaxed relative overflow-hidden group">
                {/* Shiny border effect */}
                <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/20 rounded-2xl transition-colors pointer-events-none" />
                {content}
            </div>
        </motion.div>
    )
}

function UserMessage({ content, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="flex gap-4 max-w-md ml-auto flex-row-reverse"
        >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                <span className="text-xs font-bold text-white">E</span>
            </div>
            <div className="p-4 rounded-2xl rounded-tr-sm bg-[#D4AF37] text-black font-medium text-sm shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]">
                {content}
            </div>
        </motion.div>
    )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -10 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#D4AF37]/30 transition-all group cursor-default shadow-sm hover:shadow-lg hover:shadow-[#D4AF37]/10"
        >
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-[#D4AF37]/20">
                <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-slate-900 font-bold mb-2 text-lg">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </motion.div>
    )
}
