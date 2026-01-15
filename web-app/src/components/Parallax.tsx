'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ParallaxSection({ children }: { children: React.ReactNode }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className="will-change-transform"
        >
            {children}
        </motion.div>
    );
}

export function ParallaxHero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative overflow-hidden">
            {/* Background layers */}
            <motion.div
                className="absolute inset-0 -z-10"
                style={{
                    y: y1,
                    x: mousePosition.x,
                }}
            >
                <div className="absolute top-20 right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
                className="absolute inset-0 -z-20"
                style={{
                    y: y2,
                    x: -mousePosition.x,
                }}
            >
                <div className="absolute top-40 left-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />
                <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-indigo-300/20 rounded-full blur-2xl" />
            </motion.div>
        </div>
    );
}

export function FloatingCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
                y: [0, -10, 0],
                opacity: 1
            }}
            transition={{
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay
                },
                opacity: {
                    duration: 0.5
                }
            }}
            className="will-change-transform"
        >
            {children}
        </motion.div>
    );
}

export function ParallaxText({ children }: { children: React.ReactNode }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className="will-change-transform"
        >
            {children}
        </motion.div>
    );
}
