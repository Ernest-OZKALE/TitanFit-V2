'use client';

import { motion } from 'framer-motion';
import { Brain, Flame, Shield, Zap, ArrowRight, Gauge, Lock, Activity } from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        id: 1,
        title: "Domination Neuronale",
        subtitle: "Coach IA Prédictif",
        desc: "L'IA analyse votre fatigue nerveuse en temps réel. Elle ajuste vos charges avant même que vous n'échouiez.",
        icon: Brain,
        stat: "99.8%",
        statLabel: "Précision",
        color: "text-blue-400",
        border: "group-hover:border-blue-500/50",
        bg: "group-hover:bg-blue-500/10"
    },
    {
        id: 2,
        title: "Feu Métabolique",
        subtitle: "Macro-Cycling",
        desc: "Ne mangez jamais la même chose. Vos calories s'adaptent à votre dépense du jour. Mangez plus les jours de jambes.",
        icon: Flame,
        stat: "+15%",
        statLabel: "Perte Gras",
        color: "text-orange-400",
        border: "group-hover:border-orange-500/50",
        bg: "group-hover:bg-orange-500/10"
    },
    {
        id: 3,
        title: "Sécurité Militaire",
        subtitle: "AES-256 Encryption",
        desc: "Vos données de santé valent de l'or. Nous les protégeons comme tel. Stockage local et cryptage de bout en bout.",
        icon: Lock,
        stat: "Zero",
        statLabel: "Fuite",
        color: "text-emerald-400",
        border: "group-hover:border-emerald-500/50",
        bg: "group-hover:bg-emerald-500/10"
    },
    {
        id: 4,
        title: "Vitesse Supersonique",
        subtitle: "0ms Latence",
        desc: "L'interface réagit à la vitesse de la pensée. Pas de chargement. Rien ne brise votre 'Flow State' à la salle.",
        icon: Zap,
        stat: "<50ms",
        statLabel: "Réponse",
        color: "text-yellow-400",
        border: "group-hover:border-yellow-500/50",
        bg: "group-hover:bg-yellow-500/10"
    }
];

export default function ArsenalGrid() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section className="py-32 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-24">
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter">L'Arsenal <span className="text-[#D4AF37]">Titan</span></h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Une suite d'outils de précision chirurgicale pour <span className="text-slate-900 font-bold">maximiser votre potentiel génétique.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((f) => (
                    <motion.div
                        key={f.id}
                        onMouseEnter={() => setHovered(f.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`
                            relative overflow-hidden rounded-3xl p-8 md:p-12 border transition-all duration-500 group cursor-default shadow-sm
                            ${hovered !== null && hovered !== f.id ? 'opacity-40 blur-[2px] scale-95 border-slate-100 bg-white/50' : 'opacity-100 scale-100 border-slate-200 bg-white'}
                            ${f.border}
                        `}
                    >
                        {/* Dynamic Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 transition-opacity duration-500 ${f.bg}`} />

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${f.color}`}>
                                    <f.icon className="w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <div className={`text-4xl font-black ${f.color} tracking-tighter`}>{f.stat}</div>
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{f.statLabel}</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-auto">
                                <div className={`inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold uppercase tracking-wider mb-4 ${f.color}`}>
                                    {f.subtitle}
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 uppercase mb-4 leading-none tracking-tight">
                                    {f.title}
                                </h3>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
