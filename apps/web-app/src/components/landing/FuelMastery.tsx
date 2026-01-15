'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Cookie, ChefHat, ArrowRight, Zap, Play, Pause, Search, Filter } from 'lucide-react';
import { useState, useRef } from 'react';

// Floating Food Assets (Robust URLs - Pixabay/Source)
const floatingItems = [
    { src: "/assets/images/pancakes_protein.png", x: -20, y: -20, r: -15, scale: 0.8 }, // Pancakes (Generated)
    { src: "/assets/images/burger_ultime.png", x: 80, y: -10, r: 10, scale: 0.6 }, // Burger (Generated)
    { src: "/assets/images/pancakes_protein.png", x: -90, y: 30, r: 25, scale: 0.7 }, // (Duplicate for filling)
    { src: "/assets/images/salmon_bowl.png", x: 60, y: 50, r: -5, scale: 0.9 }, // Bowl (Generated)
];

export default function FuelMastery() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef as any, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section ref={containerRef} className="py-32 px-4 bg-white overflow-hidden relative min-h-[120vh] flex items-center">
            {/* Dynamic Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-orange-400/10 to-red-400/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

            {/* Zero-G Floating Particles */}
            {floatingItems.map((item, i) => (
                <FloatingItem key={i} item={item} progress={scrollYProgress} index={i} />
            ))}

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center relative z-20">

                {/* LEFT: COPYWRITING (Agitated) */}
                <motion.div style={{ y }} className="space-y-12">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-500 text-black font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        <Cookie className="w-4 h-4" />
                        <span>Carburant Séquencé</span>
                    </div>

                    <h2 className="text-6xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter leading-[0.8]">
                        Ingénierie <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500">Du Carburant.</span>
                    </h2>

                    <p className="text-2xl text-slate-500 leading-relaxed border-l-4 border-orange-500 pl-8 font-light max-w-xl">
                        Votre corps est une machine thermique. <strong className="text-slate-900 font-bold">Nous gérons l'input.</strong> <br />
                        Macros calculées au gramme près. Ajustement dynamique. <br />
                        Pas de régime. Une stratégie énergétique.
                    </p>

                    <div className="flex flex-col gap-6">
                        <FeatureRow text="Synthèse de Recettes (500+)" />
                        <FeatureRow text="Modulation Calorique Temps Réel" />
                        <FeatureRow text="Compatible Vie Sociale" />
                    </div>

                    <button className="group px-10 py-5 bg-slate-900 text-white font-black uppercase rounded-full flex items-center gap-4 hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95">
                        <span>Voir la Carte</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>

                {/* RIGHT: THE "LIVING" PHONE */}
                <div className="relative w-full flex justify-center perspective-1000">
                    <motion.div
                        initial={{ rotateY: -20, rotateX: 10 }}
                        whileInView={{ rotateY: -10, rotateX: 5 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                        className="relative z-20"
                    >
                        <PhoneInterface />
                    </motion.div>

                    {/* Background Circle behind phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-orange-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-slate-200 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                </div>

            </div>
        </section>
    );
}

function FloatingItem({ item, progress, index }: { item: any, progress: any, index: number }) {
    const y = useTransform(progress, [0, 1], [0, item.y * 5]);
    const rotate = useTransform(progress, [0, 1], [item.r, item.r * 2]);

    return (
        <motion.div
            style={{ top: `${50 + item.y}%`, left: `${50 + item.x}%`, y, rotate, scale: item.scale }}
            className="absolute w-32 h-32 z-10 pointer-events-none drop-shadow-2xl"
        >
            <img src={item.src} className="w-full h-full object-cover rounded-2xl opacity-40 grayscale-[50%] blur-[1px]" alt="food" referrerPolicy="no-referrer" />
        </motion.div>
    )
}

function FeatureRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xl font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{text}</span>
        </div>
    )
}

function PhoneInterface() {
    return (
        <div className="w-[400px] h-[800px] bg-white rounded-[4rem] border-[8px] border-slate-200 shadow-2xl overflow-hidden relative ring-1 ring-slate-200">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-200 rounded-b-2xl z-50" />

            {/* Header */}
            <div className="absolute top-0 w-full p-8 pt-12 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-3xl font-black text-slate-900 leading-none">Menu<br /><span className="text-orange-500">Titan</span></h3>
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50">
                        <ChefHat className="w-5 h-5 text-slate-900" />
                    </div>
                </div>
                {/* Visual Search Bar */}
                <div className="w-full h-10 bg-slate-50 rounded-xl flex items-center px-4 gap-3 mb-4 border border-slate-100">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rechercher une recette...</span>
                </div>

                {/* Categories Tabs (No Scrollbar via Global CSS) */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {['Tout', 'Plats', 'Snacks', 'Desserts'].map((cat, i) => (
                        <div key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border ${i === 0 ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* Infinite Scroll List */}
            <div className="absolute inset-0 pt-60 pb-20 mask-gradient-b bg-slate-50">
                <div className="animate-marquee-vertical space-y-4 px-6">
                    {/* Duplicated list for infinite scroll illusion */}
                    {[...menuItems, ...menuItems].map((item, i) => (
                        <MenuItem key={i} {...item} />
                    ))}
                </div>
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-8 left-6 right-6 z-40">
                <button className="w-full py-4 bg-orange-500 rounded-2xl font-black text-white uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-orange-500/20">
                    Générer mon Plan
                </button>
            </div>

            {/* Overlay Gradient at bottom */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-30" />
        </div>
    )
}

// French Items with PIXABAY (CDN) Images - High Reliability
const menuItems = [
    { title: "Burger Ultime", cal: 850, img: "/assets/images/burger_ultime.png" },
    { title: "Pancakes Protéinés", cal: 450, img: "/assets/images/pancakes_protein.png" },
    { title: "Bowl Saumon", cal: 600, img: "/assets/images/salmon_bowl.png" },
    { title: "Steak Frites", cal: 900, img: "/assets/images/steak_frites.jpg" },
    { title: "Yaourt Grec & Baies", cal: 300, img: "/assets/images/greek_yogurt.jpg" },
    { title: "Smoothie Vert", cal: 250, img: "/assets/images/green_smoothie.jpg" },
];

function MenuItem({ title, cal, img }: any) {
    return (
        <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 flex gap-4 items-center group shadow-sm">
            <img
                src={img}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                alt={title}
                loading="eager"
                referrerPolicy="no-referrer"
            />
            <div>
                <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                <div className="text-orange-500 text-xs font-bold">{cal} kcal</div>
            </div>
            <div className="ml-auto w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Play className="w-3 h-3 fill-current" />
            </div>
        </div>
    )
}
