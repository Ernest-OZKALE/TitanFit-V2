'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
    i: number;
    title: string;
    description: string;
    icon: LucideIcon;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

const Card = ({ i, title, description, icon: Icon, progress, range, targetScale }: CardProps) => {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className={`relative flex flex-col items-center justify-center w-[90vw] md:w-[1000px] h-[500px] rounded-[30px] border border-white/10 bg-black/80 backdrop-blur-3xl origin-top transition-all duration-500 hover:border-[#D4AF37]/50 shadow-2xl`}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[30px]" />
                <div className="flex flex-col items-center gap-8 text-center p-12 relative z-10">
                    <div className="p-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_30px_-10px_#D4AF37]">
                        <Icon className="w-16 h-16" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{title}</h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light">{description}</p>
                </div>
            </motion.div>
        </div>
    )
}

interface Item {
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function CardStack({ items }: { items: Item[] }) {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={container} className="relative mt-[20vh] pb-[50vh]">
            {items.map((item, i) => {
                const targetScale = 1 - ((items.length - i) * 0.05);
                return <Card key={i} i={i} {...item} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} />
            })}
        </div>
    );
}
