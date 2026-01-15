'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

const items = [
    {
        id: 1,
        title: "Centre de Commandement",
        subtitle: "Vue Panoramique",
        description: "Vos métriques vitales, centralisées. Une clarté absolue sur votre progression.",
        color: "from-slate-900 to-slate-800",
        img: "/bento-biometrics.png"
    },
    {
        id: 2,
        title: "Intelligence Titan",
        subtitle: "Oracle Personnel",
        description: "Posez n'importe quelle question. Obtenez une stratégie digne d'un champion olympique.",
        color: "from-[#D4AF37] to-[#B8860B]",
        img: "/bento-coach.png"
    },
    {
        id: 3,
        title: "Nutrition Moléculaire",
        subtitle: "Scan Rétinien",
        description: "Analyse instantanée de vos repas. Macro-nutriments calculés à la molécule près.",
        color: "from-slate-800 to-slate-900",
        img: "/food-mock.png"
    },
    {
        id: 4,
        title: "Le Cercle Élite",
        subtitle: "Hiérarchie",
        description: "Rejoignez les 1%. Battez-vous pour votre place au sommet.",
        color: "from-slate-100 to-white",
        textColor: "text-slate-900",
        img: "/bento-leaderboard.png"
    },
];

export function HorizontalScrollSection() {
    const targetRef = useRef<any>(null);
    const scrollRef = useRef<any>(null);
    const [scrollRange, setScrollRange] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (scrollRef.current) {
                const isDesktopView = window.innerWidth >= 768;
                setIsDesktop(isDesktopView);

                if (isDesktopView) {
                    const scrollWidth = scrollRef.current.scrollWidth;
                    const clientWidth = window.innerWidth;
                    // Calculate exact travel distance needed
                    setScrollRange(scrollWidth - clientWidth + 100); // +100 buffer for safe edge
                } else {
                    setScrollRange(0);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef as React.RefObject<HTMLElement>,
    });

    // Precisely map vertical scroll to horizontal scroll
    const x = useTransform(scrollYProgress, [0.15, 0.85], ["100px", `-${scrollRange}px`]);

    return (
        <section ref={targetRef} className="relative bg-[#FAFAFA] min-h-[350vh]">
            <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden relative z-10 w-full overflow-hidden">
                <motion.div
                    ref={scrollRef}
                    style={{ x: isDesktop ? x : 0 }}
                    className="flex gap-8 px-4 md:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-10 md:py-0 w-full md:w-max scrollbar-hide ps-4 md:ps-[10vw]"
                >
                    <div className="flex flex-col justify-center min-w-[85vw] md:min-w-[30vw] md:pr-20 shrink-0 snap-center px-4 md:px-0">
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                            L'Avant-Garde<br />
                            <span className="text-[#D4AF37]">Absolue.</span>
                        </h2>
                        <p className="text-xl text-slate-500 max-w-md leading-relaxed">
                            Une interface fluide comme l'eau, puissante comme le roc. Conçue pour l'élite.
                        </p>
                    </div>

                    {items.map((item) => (
                        <Card
                            key={item.id}
                            className="relative h-[65vh] w-[85vw] md:w-[65vh] md:aspect-[3/4] overflow-hidden rounded-[2.5rem] border-0 shadow-2xl flex-shrink-0 group snap-center bg-white transform transition-transform duration-500 hover:scale-[1.02]"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0`} />

                            {/* Text Content */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20 pointer-events-none">
                                <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3 ${item.textColor ? 'text-slate-800' : 'text-[#D4AF37]'}`}>
                                    {item.subtitle}
                                </p>
                                <h3 className={`text-3xl md:text-5xl font-black mb-4 md:mb-6 ${item.textColor ? 'text-slate-900' : 'text-white'} drop-shadow-sm`}>
                                    {item.title}
                                </h3>
                                <p className={`text-base md:text-lg font-medium leading-relaxed ${item.textColor ? 'text-slate-600' : 'text-slate-200'}`}>
                                    {item.description}
                                </p>
                            </div>

                            {/* Image Background */}
                            <div className="absolute inset-0 z-0 bg-slate-100">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Gradient Overlay for text readability */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${item.textColor ? 'from-white/90 via-white/40' : 'from-slate-900/90 via-slate-900/20'} to-transparent opacity-100`} />
                            </div>
                        </Card>
                    ))}

                    {/* Extra flexible spacer at the end to ensure the last card can be centered */}
                    <div className="w-[5vw] md:w-[15vw] shrink-0" />
                </motion.div>
            </div>
        </section>
    );
}
