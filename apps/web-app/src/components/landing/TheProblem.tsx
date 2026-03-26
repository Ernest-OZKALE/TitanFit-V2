'use client';

import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { AlertTriangle, TrendingDown, XCircle, Ban, Skull, AlertOctagon } from 'lucide-react';
import { useRef } from 'react';

// Random float animation helper
const FloatingCard = ({ children, delay = 0, speed = 1, rotateRange = 5 }: any) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay }}
            animate={{
                y: [0, -20 * speed, 0],
                rotate: [0, rotateRange, -rotateRange, 0]
            }}
            // @ts-ignore
            transition={{
                y: { duration: 4 / speed, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6 / speed, repeat: Infinity, ease: "easeInOut" }
            }}
            className="h-full"
        >
            {children}
        </motion.div>
    )
}

export default function TheProblem() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef as any, offset: ["start end", "end start"] });

    // Parallax transforms
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [100, -150]);

    return (
        <section ref={containerRef} className="relative py-32 px-4 overflow-hidden">
            {/* Background Chaos Noise - Light Mode */}
            <div className="absolute inset-0 bg-slate-50/50 opacity-20" />

            {/* Red Fog - Softer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-20 max-w-[1400px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs mb-8 animate-pulse">
                        <AlertOctagon className="w-4 h-4" />
                        <span>Réalité Statistique</span>
                    </div>
                    {/* NEW CLEAR HEADLINE */}
                    <h2 className="text-5xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-[0.8]">
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="block"
                        >
                            L'Approximation
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 block"
                        >
                            Est Un Choix.
                        </motion.span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mt-8 font-light">
                        Votre corps n'est pas une loterie. C'est un système biologique régis par des lois.
                        <br />
                        Ignorer ces lois, c'est choisir la <span className="text-red-500 font-bold">stagnation</span>.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
                    {/* Card 1 */}
                    <motion.div style={{ y: y1 }}>
                        <FloatingCard delay={0} speed={1.2} rotateRange={2}>
                            <div className="p-10 h-full rounded-[2.5rem] bg-white backdrop-blur-md border border-slate-100 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.15)]">
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500 group-hover:rotate-12 transform">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>
                                <div className="text-left">
                                    <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">🛑</div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase leading-none group-hover:text-red-600 transition-colors">Effort<br />Aveugle</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        Sans surcharge progressive mathématique, l'effort est du gaspillage. Soulever "au feeling" est la méthode la plus efficace pour ne jamais évoluer.
                                    </p>
                                </div>
                            </div>
                        </FloatingCard>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div style={{ y: y2 }} className="md:mt-24">
                        <FloatingCard delay={0.2} speed={0.8} rotateRange={-2}>
                            <div className="p-10 h-full rounded-[2.5rem] bg-white backdrop-blur-md border border-slate-100 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.15)]">
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500 group-hover:rotate-12 transform">
                                    <Ban className="w-16 h-16 text-red-500" />
                                </div>
                                <div className="text-left">
                                    <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">🎲</div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase leading-none group-hover:text-red-600 transition-colors">Nutrition<br />Aléatoire</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        Manger "sain" ne suffit pas. Si vous n'adaptez pas vos macros à votre dépense énergétique du jour même, vous naviguez à vue.
                                    </p>
                                </div>
                            </div>
                        </FloatingCard>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div style={{ y: y3 }}>
                        <FloatingCard delay={0.4} speed={1.1} rotateRange={3}>
                            <div className="p-10 h-full rounded-[2.5rem] bg-white backdrop-blur-md border border-slate-100 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.15)]">
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500 group-hover:rotate-12 transform">
                                    <Skull className="w-16 h-16 text-red-500" />
                                </div>
                                <div className="text-left">
                                    <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">📉</div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase leading-none group-hover:text-red-600 transition-colors">Surcharge<br />Systémique</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        Un système nerveux épuisé ne construit rien. Sans gestion précise de la fatigue, chaque rep de trop est un pas vers la régression.
                                    </p>
                                </div>
                            </div>
                        </FloatingCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
