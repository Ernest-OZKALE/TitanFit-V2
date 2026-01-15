
"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, User, TrendingUp, Activity, Wine, Camera, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Optimized Unsplash URLs (using source.unsplash.com pattern or reliable IDs)
const profiles = [
    {
        id: 'thomas',
        name: "Thomas R.",
        age: "24 ans",
        type: "Ectomorphe",
        problem: "Mange 'énormément' mais reste bloqué à 65kg.",
        solution: "Surplus calorique liquide + Haute Fréquence.",
        result: "+8kg Masse Totale",
        duration: "8 Mois",
        icon: User,
        image: "/assets/images/thomas_after.png",
        before: "/assets/images/thomas_before.png",
        after: "/assets/images/thomas_after.png",
        stats: { label: "Poids", start: "65kg", end: "73kg" }
    },
    {
        id: 'sarah',
        name: "Sarah M.",
        age: "32 ans",
        type: "Mésomorphe",
        problem: "Stress élevé, stockage abdominal, peu de temps.",
        solution: "Séances 45min intenses + Carb Cycling.",
        result: "-8% Gras Corporel",
        duration: "6 Mois",
        icon: Activity,
        image: "/assets/images/sarah_after.png",
        before: "/assets/images/sarah_before.png",
        after: "/assets/images/sarah_after.png",
        stats: { label: "Body Fat", start: "24%", end: "16%" }
    },
    {
        id: 'karim',
        name: "Karim B.",
        age: "29 ans",
        type: "Hybride",
        problem: "Pratique le MMA et la muscu. Épuisé le vendredi.",
        solution: "Gestion de la fatigue nerveuse + Periprotéine.",
        result: "Explosivité +25%",
        duration: "4 Mois",
        icon: TrendingUp,
        image: "/assets/images/karim_after.png",
        before: "/assets/images/karim_before.png",
        after: "/assets/images/karim_after.png",
        stats: { label: "Energie", start: "Low", end: "Max" }
    },
    {
        id: 'julie',
        name: "Julie L.",
        age: "35 ans",
        type: "Lifestyle",
        problem: "Aime les restos et le vin. Veut sécher sans frustration.",
        solution: "Flexibilité métabolique + Banques de calories.",
        result: "Abdos Visibles",
        duration: "5 Mois",
        icon: Wine,
        image: "/assets/images/julie_after.png",
        before: "/assets/images/julie_before.png",
        after: "/assets/images/julie_after.png",
        stats: { label: "Taille", start: "78cm", end: "70cm" }
    }
];

export default function IdentitySelector() {
    const [active, setActive] = useState(0);

    return (
        <section className="py-32 px-4 bg-white relative overflow-hidden">
            {/* Subtle Textured Background - Light */}
            <div className="absolute inset-0 bg-[#f8f9fa] opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.4]" />
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Résultats Certifiés</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
                        Preuves <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">Visuelles.</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        On ne vend pas du rêve. On fabrique des résultats. <br />
                        <span className="font-medium text-slate-900">Sélectionnez un profil pour voir l'évolution.</span>
                    </p>
                </div>

                {/* THE GRID */}
                <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[800px]">
                    {profiles.map((profile, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setActive(i)}
                            className={cn(
                                "relative rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group border",
                                active === i
                                    ? "lg:flex-[3] min-h-[600px] lg:min-h-0 border-[#D4AF37]/30 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/10"
                                    : "lg:flex-1 min-h-[100px] lg:min-h-0 border-slate-200 hover:border-slate-300 grayscale-[100%] hover:grayscale-0 card-3d"
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={profile.image}
                                    className={cn("w-full h-full object-cover transition-transform duration-1000", active === i ? "scale-105" : "scale-100 opacity-90")}
                                    alt={profile.name}
                                    referrerPolicy="no-referrer"
                                />
                                {/* Gradient Overlay - Light Mode Adaptation */}
                                <div className={cn("absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500", active === i ? "opacity-90" : "opacity-60")} />

                                {/* White Flash on Hover */}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
                            </div>

                            {/* Content Container */}
                            <div className="relative h-full flex flex-col p-6 pt-32 md:p-10 md:pt-32 z-20">

                                {/* Top Label */}
                                <div className={cn("absolute top-8 left-8 transition-all duration-500", active === i ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 md:opacity-0")}>
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-lg`}>
                                        <profile.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                                        <span>{profile.type}</span>
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div className="space-y-4 mt-auto">
                                    <div className="overflow-visible transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <motion.h3
                                            className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none break-words drop-shadow-md"
                                        >
                                            {profile.name}
                                        </motion.h3>
                                        <div className="flex items-center gap-3 text-white/80 font-medium text-lg mt-3">
                                            <span>{profile.age}</span>
                                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                                            <span>{profile.type}</span>
                                        </div>
                                    </div>

                                    {/* Expanded Info - Reveals on Active */}
                                    <div className={cn("space-y-6 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]", active === i ? "max-h-[1000px] opacity-100 mt-6 pb-2" : "max-h-0 opacity-0")}>

                                        {/* Problem / Solution Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest text-red-200 font-bold mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Problème
                                                </div>
                                                <div className="text-white text-sm leading-relaxed font-medium opacity-90">{profile.problem}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Solution
                                                </div>
                                                <div className="text-white text-sm font-bold">{profile.solution}</div>
                                            </div>
                                        </div>

                                        {/* Key Result Metric */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Résultat Final</div>
                                                <div className="text-3xl font-black text-white uppercase italic tracking-tight">{profile.result}</div>
                                                <div className="text-xs text-[#D4AF37] font-mono mt-1 flex items-center gap-2 font-bold">
                                                    <TrendingUp className="w-3 h-3" /> {profile.stats.start} ➔ {profile.stats.end}
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                                                <ArrowRight className="w-6 h-6" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
