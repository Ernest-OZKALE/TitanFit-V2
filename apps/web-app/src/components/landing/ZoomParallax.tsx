'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function ZoomParallax({ children }: { children: React.ReactNode }) {
    const container = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: container as any,
        offset: ['start start', 'end end']
    });

    // Scale from normal (1) to massive (40) to simulate entering the text
    const scale = useTransform(scrollYProgress, [0, 1], [1, 50]);
    // Fade out as it gets too big
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

    return (
        <div ref={container} className="relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                <motion.div style={{ scale, opacity }} className="relative z-10">
                    {children}
                </motion.div>

                {/* Optional: Add a subtle overlay that darkens as you 'enter' */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0.6, 1], [0, 1]) }}
                    className="absolute inset-0 bg-black pointer-events-none z-0"
                />
            </div>
        </div>
    )
}
