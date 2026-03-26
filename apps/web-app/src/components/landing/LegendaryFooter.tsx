
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Github, Twitter, Instagram } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { cn } from "@/lib/utils";

export default function LegendaryFooter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef as any,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

    return (
        <div
            ref={containerRef}
            className="relative h-[600px] bg-white clip-path-footer"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-slate-100" />

            <div className="relative h-full flex flex-col justify-center items-center p-8 md:p-20">
                {/* Background Text Parallax */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <motion.div style={{ y }} className="text-[20vw] font-black leading-[0.8] text-slate-900 whitespace-nowrap">
                        TITAN FIT
                    </motion.div>
                </div>

                {/* Main CTA */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] mb-8 text-sm md:text-base">
                            La Médiocrité est un choix
                        </p>
                        <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                            ALORS ?
                        </h2>
                        <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900 tracking-tighter mb-12 leading-none">
                            PRÊT ?
                        </h2>

                        <div className="flex justify-center relative group/btn">
                            {/* Star Dust Particles */}
                            <div className="absolute inset-0 pointer-events-none">
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D4AF37]/20 blur-[50px] rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                                <span className="absolute top-0 left-1/4 w-2 h-2 bg-[#D4AF37] rounded-full blur-[1px] opacity-0 group-hover/btn:opacity-100 animate-[float_3s_ease-in-out_infinite]" />
                                <span className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-[#FFF] rounded-full blur-[1px] opacity-0 group-hover/btn:opacity-100 animate-[float_4s_ease-in-out_infinite_0.5s]" />
                                <span className="absolute top-1/2 right-0 w-1 h-1 bg-[#D4AF37] rounded-full blur-[0px] opacity-0 group-hover/btn:opacity-100 animate-[float_2s_ease-in-out_infinite_1s]" />
                            </div>

                            <MagneticButton>
                                <Link
                                    href="/signup"
                                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-[#D4AF37] text-white rounded-full font-black text-xl uppercase tracking-widest overflow-hidden transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)]"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                                    <span className="relative z-10">Rejoindre l'Élite</span>
                                    <ArrowUpRight className="relative z-10 w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
                                </Link>
                            </MagneticButton>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
            </div>
        </div>
    );
}
