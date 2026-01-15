'use client';

import { motion } from 'framer-motion';
import { Scan, Brain, Zap } from 'lucide-react';

const steps = [
    {
        title: "Scan Biométrique",
        desc: "Nous importons vos données de santé (Apple Health, Garmin) pour établir votre profil métabolique complet.",
        icon: Scan,
    },
    {
        title: "Traitement Neural",
        desc: "La Méthode Titan croise 50 variables (sommeil, stress, nutrition) pour générer le plan optimal.",
        icon: Brain,
    },
    {
        title: "Adaptation Live",
        desc: "Chaque séance est ajustée en temps réel. Si vous êtes fatigué, Titan réduit la charge.",
        icon: Zap,
    }
];

export default function Protocol() {
    return (
        <section className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-bold">La Méthode</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 mb-8">COMMENT ÇA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-500">MARCHE</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.2, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ y: -10 }}
                        className="relative z-10 flex flex-col items-center text-center group cursor-default"
                    >
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.8 }}
                            className="w-24 h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_-5px_rgba(212,175,55,0.2)] transition-shadow duration-300"
                        >
                            <step.icon className="w-10 h-10 text-[#D4AF37]" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#D4AF37] transition-colors">{step.title}</h3>
                        <p className="text-slate-500 leading-relaxed max-w-xs">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
