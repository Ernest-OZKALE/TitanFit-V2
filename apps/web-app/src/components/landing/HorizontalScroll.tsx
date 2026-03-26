'use client';

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const cards = [
    {
        url: "/assets/workout_1.jpg", // Placeholder - Needs valid Images, will use colors/mockup for now if missing
        title: "INITIATION",
        id: 1,
        desc: "Le point de départ. L'analyse de vos faiblesses."
    },
    {
        url: "/assets/workout_2.jpg",
        title: "TRANSFORMATION",
        id: 2,
        desc: "L'adaptation métabolique par l'IA."
    },
    {
        url: "/assets/workout_3.jpg",
        title: "DOMINATION",
        id: 3,
        desc: "La maîtrise totale de votre potentiel."
    },
    {
        url: "/assets/workout_4.jpg",
        title: "HÉRITAGE",
        id: 4,
        desc: "Vous ne suivez plus le chemin. Vous le tracez."
    },
];

export default function HorizontalScroll() {
    const targetRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef as any,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 border-t border-white/10">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4">
                    {/* Title Card */}
                    <div className="group relative h-[450px] w-[450px] overflow-hidden bg-transparent flex items-center justify-center p-12">
                        <h2 className="text-6xl font-black text-white leading-tight">
                            L'ÉVOLUTION <br /><span className="text-[#D4AF37]">TITAN</span>
                        </h2>
                    </div>

                    {cards.map((card) => {
                        return (
                            <div key={card.id} className="group relative h-[450px] w-[450px] overflow-hidden rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent transition-transform duration-500 group-hover:scale-110"></div>
                                {/* Replace with actual Images if available, using abstract gradient for now */}
                                <div className={`absolute inset-0 z-0 opacity-50 bg-gradient-to-br transition-opacity duration-500 group-hover:opacity-70
                        ${card.id === 1 ? 'from-blue-900/40' :
                                        card.id === 2 ? 'from-purple-900/40' :
                                            card.id === 3 ? 'from-red-900/40' : 'from-[#D4AF37]/40'} 
                        to-black`}
                                />

                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
                                    <span className="text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors">0{card.id}</span>
                                    <div>
                                        <h3 className="text-3xl font-bold text-white uppercase mb-2">{card.title}</h3>
                                        <p className="text-gray-400">{card.desc}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
