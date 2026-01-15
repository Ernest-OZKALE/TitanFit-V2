'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function FutureReality() {
    const containerRef = useRef<HTMLDivElement>(null!);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
    const xLeft = useTransform(scrollYProgress, [0.1, 0.5], [-100, 0]);
    const xRight = useTransform(scrollYProgress, [0.1, 0.5], [100, 0]);

    return (
        <section ref={containerRef} className="py-32 bg-white relative overflow-hidden flex items-center justify-center min-h-[80vh]">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.03),_transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none invert" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">

                    {/* LEFT COLUMN: The Hook */}
                    <motion.div style={{ x: xLeft, opacity }} className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-sm md:text-base text-[#D4AF37] font-bold tracking-[0.3em] uppercase">
                                Changement de Paradigme
                            </h3>
                            <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
                                Au-delà de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">La Fiction.</span>
                            </h2>
                        </div>

                        <div className="space-y-8 border-l-2 border-slate-200 pl-8">
                            <div className="group">
                                <h4 className="text-xl text-slate-700 font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">Oubliez les Exosquelettes.</h4>
                                <p className="text-slate-500 font-light">La véritable puissance ne se porte pas, elle se construit. Nous densifions votre <strong className="text-slate-900">architecture interne</strong> pour une résilience structurelle absolue.</p>
                            </div>
                            <div className="group">
                                <h4 className="text-xl text-slate-700 font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">L'Expertise Sur-Mesure.</h4>
                                <p className="text-slate-500 font-light">Plus besoin de coach. Vous disposez d'un système qui s'adapte à votre rythme biologique et anticipe vos besoins de récupération.</p>
                            </div>
                            <div className="group">
                                <h4 className="text-xl text-slate-700 font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">Votre Code Génétique.</h4>
                                <p className="text-slate-500 font-light">Votre biologie n'est pas une limite, c'est une fondation. Nous libérons la force brute qui sommeille en vous.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: The Reveal */}
                    <motion.div style={{ scale, opacity }} className="relative">
                        <div className="relative aspect-square rounded-[3rem] bg-white border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(212,175,55,0.05),_transparent_60%)] group-hover:opacity-100 transition-opacity opacity-50" />

                            <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8">
                                <motion.div
                                    animate={{
                                        boxShadow: ["0 0 20px rgba(212,175,55,0)", "0 0 50px rgba(212,175,55,0.3)", "0 0 20px rgba(212,175,55,0)"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-24 h-24 rounded-full bg-white border border-[#D4AF37] flex items-center justify-center mb-8 relative z-10 shadow-lg"
                                >
                                    <span className="text-4xl">🧬</span>
                                </motion.div>

                                <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">
                                    Méthode <span className="text-[#D4AF37]">Titan</span>
                                </h3>

                                <p className="text-lg text-slate-500 font-light leading-relaxed">
                                    "Ce n'est pas un film. <br />
                                    C'est la prochaine étape de votre évolution."
                                </p>

                                <div className="mt-8 px-6 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Système Actif
                                </div>
                            </div>

                            {/* Scanning Line Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent h-[10%] w-full animate-[scan_4s_linear_infinite]" />
                        </div>
                    </motion.div>

                </div>

                {/* Bottom Quote */}
                <motion.div
                    style={{ x: xRight, opacity }}
                    className="mt-32 text-center"
                >
                    <p className="text-2xl md:text-4xl font-light text-slate-900 leading-normal italic font-serif opacity-80">
                        "Ne cherchez plus la limite.<br />
                        <span className="text-[#D4AF37] not-italic font-sans font-bold">Incarnez l'élite avec TitanFit.</span>"
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
