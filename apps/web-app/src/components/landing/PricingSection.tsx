
"use client";

import React from "react";
import { Check, Crown, Zap, Shield } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";
import { motion } from "framer-motion";

const TIERS = [
    {
        name: "INITIATE",
        price: "Gratuit",
        description: "L'accès au programme standard.",
        features: ["Accès Dashboard V2", "Suivi Hebdomadaire", "Bibliothèque d'Exercices", "Mode Sombre"],
        cta: "Commencer",
        href: "/signup",
        popular: false,
        theme: "gray"
    },
    {
        name: "TITAN PRO",
        price: "29€",
        period: "/mois",
        description: "La puissance de l'IA débloquée.",
        features: ["Tout du plan Initiate", "IA Nutrition & Training", "Générateur de Repas Illimité", "Focus Mode (Zen)", "Analyses Bio-Métriques"],
        cta: "Devenir Titan",
        href: "/signup?plan=pro",
        popular: true,
        theme: "gold"
    },
    {
        name: "ELITE VISION",
        price: "99€",
        period: "/mois",
        description: "Coaching hybride & Accès VIP.",
        features: ["Tout du plan Pro", "Check-in Humain Mensuel", "Accès Beta Features", "Support Prioritaire 24/7", "Badge Holographique"],
        cta: "Postuler",
        href: "/signup?plan=elite",
        popular: false,
        theme: "black"
    }
];

export default function PricingSection() {
    return (
        <section className="relative py-20 md:py-32 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
                    Investissez en <span className="text-[#D4AF37]">Vous</span>
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Choisissez votre niveau d'engagement. La méthode s'adapte à votre ambition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {TIERS.map((tier, index) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-8 rounded-[2rem] border flex flex-col h-full min-h-[500px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] ${tier.popular
                            ? "bg-white border-[#D4AF37] shadow-[0_20px_60px_-10px_rgba(212,175,55,0.2)] scale-105 z-10"
                            : "bg-white border-slate-200 hover:border-slate-300 transition-colors"
                            }`}
                    >
                        {tier.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-full shadow-lg">
                                Recommandé
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${tier.popular ? 'text-[#D4AF37]' : 'text-slate-900'}`}>
                                {tier.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className={`text-4xl font-black ${tier.popular ? 'text-slate-900' : 'text-slate-700'}`}>{tier.price}</span>
                                {tier.period && <span className="text-slate-400 font-bold text-sm">{tier.period}</span>}
                            </div>
                            <p className="text-slate-500 text-sm font-medium border-b border-slate-100 pb-6">
                                {tier.description}
                            </p>
                        </div>

                        <ul className="space-y-4 flex-1 mb-8">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <Check className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            {tier.popular ? (
                                <MagneticButton>
                                    <Link href={tier.href} className="flex items-center justify-center w-full py-4 rounded-xl bg-[#D4AF37] text-white font-black uppercase tracking-widest hover:bg-[#B8860B] transition-colors shadow-lg">
                                        {tier.cta}
                                    </Link>
                                </MagneticButton>
                            ) : (
                                <Link href={tier.href} className="flex items-center justify-center w-full py-4 rounded-xl border border-slate-200 text-slate-900 font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                                    {tier.cta}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
