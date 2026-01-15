'use client';

import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// --- DATA: FEATURES & ATMOSPHERES ---
const features = [
    {
        id: "01",
        title: "Architecture Unique.",
        subtitle: "Biomécanique",
        desc: "Votre structure est spécifique. Oubliez les méthodes génériques, visez une performance authentique.",
        color: "#ffffff",
        accent: "#0ea5e9", // Sky Blue 500
        env: "genetic",
        bg: "#e0f2fe" // Sky 100
    },
    {
        id: "02",
        title: "Flux Vital.",
        subtitle: "Adaptation",
        desc: "Votre énergie est capitale. L'entraînement s'ajuste pour une forme optimale.",
        color: "#ffffff",
        accent: "#d97706", // Amber 600
        env: "liquid",
        bg: "#fef3c7" // Amber 100
    },
    {
        id: "03",
        title: "Croissance Pure.",
        subtitle: "Évolution",
        desc: "Bâtissez une musculature qui dure. Une progression solide, réelle et sûre.",
        color: "#ffffff",
        accent: "#059669", // Emerald 600
        env: "kinetic",
        bg: "#d1fae5" // Emerald 100
    },
    {
        id: "04",
        title: "Cercle d'Élite.",
        subtitle: "Communauté",
        desc: "Ne cherchez plus la limite. Rejoignez ceux qui incarnent l'élite.",
        color: "#ffffff",
        accent: "#7c3aed", // Violet 600
        env: "elite",
        bg: "#ede9fe" // Violet 100
    }
];

export default function TechDeepDive() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section ref={container} className="bg-white relative h-[500vh]">
            {/* --- GLOBAL NOISE - LIGHT --- */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] invert" />

            {/* --- MOUSE SPOTLIGHT (Global) --- */}
            <div
                className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 mix-blend-overlay"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08), transparent 50%)`
                }}
            />

            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden perspective-1000">

                {/* --- PARALLAX BACKGROUND SYSTEM --- */}
                <BackgroundSystem progress={smoothProgress} />

                {/* --- CONTENT SLIDES (Z-Axis) --- */}
                {features.map((feature, i) => {
                    const range = [i / features.length, (i + 1) / features.length];
                    return (
                        <DepthSlide
                            key={i}
                            feature={feature}
                            progress={scrollYProgress}
                            range={range}
                        />
                    );
                })}
            </div>
        </section>
    );
}

// --- BACKGROUND SYSTEM COMPONENT ---
function BackgroundSystem({ progress }: { progress: any }) {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            {/* ENV 01: GENETIC (Sky Blue light) */}
            <EnvLayer progress={progress} range={[0, 0.25]} color={features[0].bg} accent={features[0].accent}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--tw-gradient-stops))] from-sky-200/40 to-transparent" />
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-[100px]"
                />
            </EnvLayer>

            {/* ENV 02: LIQUID (Gold/Amber Light) */}
            <EnvLayer progress={progress} range={[0.25, 0.5]} color={features[1].bg} accent={features[1].accent}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-amber-200/40 to-transparent" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-amber-300/30 rounded-full blur-[120px]"
                />
            </EnvLayer>

            {/* ENV 03: KINETIC (Emerald Light) */}
            <EnvLayer progress={progress} range={[0.5, 0.75]} color={features[2].bg} accent={features[2].accent}>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,_var(--tw-gradient-stops))] from-emerald-200/30 to-transparent" />
                <motion.div
                    animate={{ width: ["0%", "100%"], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-0 h-[1px] bg-emerald-500/50 blur-[2px]"
                />
            </EnvLayer>

            {/* ENV 04: ELITE (Violet Light) */}
            <EnvLayer progress={progress} range={[0.75, 1]} color={features[3].bg} accent={features[3].accent}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-violet-200/30 to-transparent" />
                <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-violet-300/30 rounded-full blur-[150px]"
                />
            </EnvLayer>
        </div>
    )
}

function EnvLayer({ progress, range, children, color, accent }: any) {
    const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);
    // Parallax movement for the background layer itself (moves slower)
    const y = useTransform(progress, [range[0], range[1]], [50, -50]);

    return (
        <motion.div
            style={{ opacity, y }}
            className="absolute inset-0 w-full h-full will-change-transform"
        >
            {/* Deep Base Color Blend - increased opacity for better visibility */}
            <div className="absolute inset-0 transition-colors duration-1000 opacity-90" style={{ backgroundColor: color }} />
            {/* Accent Border for better separation */}
            <div className="absolute top-0 left-0 w-full h-[1px] opacity-20" style={{ backgroundColor: accent }} />
            {children}
        </motion.div>
    )
}

// --- CONTENT SLIDE COMPONENT (Unchanged mostly, just copy updates) ---
function DepthSlide({ feature, progress, range }: any) {
    const start = range[0];
    const end = range[1];

    const opacity = useTransform(progress, [start, start + 0.05, end - 0.1, end], [0, 1, 1, 0]);
    const scale = useTransform(progress, [start, end], [0.8, 1.2]);
    const blur = useTransform(progress, [start, start + 0.1, end - 0.1, end], [20, 0, 0, 20]);

    const titleY = useTransform(progress, [start, end], [50, -50]);
    const descY = useTransform(progress, [start, end], [100, -100]);

    return (
        <motion.div
            style={{ opacity, scale, filter: useMotionTemplate`blur(${blur}px)` }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20"
        >
            <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
                <motion.div
                    className="text-sm font-bold uppercase tracking-[0.4em] mb-12 text-slate-500"
                    style={{ color: feature.accent }}
                >
                    {feature.id} — {feature.subtitle}
                </motion.div>

                <div className="overflow-hidden mb-12">
                    <motion.h2
                        style={{ y: titleY }}
                        className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.85] drop-shadow-sm"
                    >
                        {feature.title}
                    </motion.h2>
                </div>

                <motion.div
                    style={{ y: descY }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-slate-200/0 via-slate-400/50 to-slate-200/0" />
                    <p className="text-xl md:text-3xl text-slate-600 font-light max-w-2xl text-center leading-relaxed">
                        {feature.desc}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}
