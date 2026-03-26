'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

// Luxury Monochromatic Palette
const images = [
    "bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5", // Matte Black
    "bg-gradient-to-br from-[#D4AF37] to-[#8a6e1e] border border-[#D4AF37]/20", // Pure Gold
    "bg-gradient-to-br from-[#333] to-black border border-white/10", // Dark Steel
    "bg-gradient-to-br from-black to-[#111] border border-[#D4AF37]/10", // Deep Void
    "bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] border border-white/20", // Champaign Gold
    "bg-gradient-to-br from-neutral-900 to-black border border-white/5", // Carbon
    "bg-gradient-to-br from-[#222] to-[#111] border border-[#D4AF37]/5", // Onyx
    "bg-gradient-to-br from-[#D4AF37]/80 to-[#D4AF37]/40 border border-[#D4AF37]/20", // Translucent Gold
    "bg-gradient-to-br from-white/10 to-transparent border border-white/10", // Glass
];

export default function ParallaxGrid() {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'end start']
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, 150]);

    return (
        <div ref={container} className="h-[150vh] overflow-hidden bg-black relative flex gap-[2vw] p-[2vw] box-border">
            <Column y={y1} images={[images[0], images[1], images[2]]} />
            <Column y={y2} images={[images[3], images[4], images[5]]} top="-45%" />
            <Column y={y3} images={[images[6], images[7], images[8]]} />
            <Column y={y4} images={[images[2], images[0], images[5]]} top="-45%" />
        </div>
    )
}

const Column = ({ y, images, top = "0%" }: { y: any, images: string[], top?: string }) => {
    return (
        <motion.div style={{ y, top }} className="relative w-[25%] h-full flex flex-col gap-[2vw] min-w-[250px]">
            {images.map((src, i) => (
                <div key={i} className={`w-full h-full relative rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-500 ${src}`}>
                    {/* Placeholder for actual image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 font-black text-4xl">TITAN</span>
                    </div>
                </div>
            ))}
        </motion.div>
    )
}
