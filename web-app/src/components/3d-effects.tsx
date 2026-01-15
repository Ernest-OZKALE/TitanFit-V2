'use client';

import React, { useMemo, memo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
}

export const TiltCard = memo(function TiltCard({ children, className }: TiltCardProps) {
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = (y - centerY) / 10;
        const rotateYValue = (centerX - x) / 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={cn("relative perspective-1000", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {children}
        </motion.div>
    );
});

interface FloatingObject3DProps {
    className?: string;
    type?: 'sphere' | 'cube' | 'torus' | 'pyramid';
    size?: number;
    color?: string;
    animate?: boolean;
}

export const FloatingObject3D = memo(function FloatingObject3D({
    className,
    shape = 'sphere',
    size = 100,
    color = '#D4AF37',
    animate = true
}: FloatingObject3DProps & { shape?: string }) {
    const shapeStyles = {
        cube: (
            <div
                className="relative"
                style={{
                    width: size,
                    height: size,
                    transformStyle: 'preserve-3d',
                    animation: animate ? 'rotate-3d 20s linear infinite' : undefined
                }}
            >
                {/* Front */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                    border: `1px solid ${color}50`,
                    transform: `translateZ(${size / 2}px)`,
                    backdropFilter: 'blur(10px)',
                }} />
                {/* Back */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                    border: `1px solid ${color}40`,
                    transform: `translateZ(${-size / 2}px) rotateY(180deg)`,
                }} />
                {/* Left */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}35, ${color}15)`,
                    border: `1px solid ${color}45`,
                    transform: `translateX(${-size / 2}px) rotateY(-90deg)`,
                }} />
                {/* Right */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}45, ${color}25)`,
                    border: `1px solid ${color}55`,
                    transform: `translateX(${size / 2}px) rotateY(90deg)`,
                }} />
                {/* Top */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}50, ${color}30)`,
                    border: `1px solid ${color}60`,
                    transform: `translateY(${-size / 2}px) rotateX(90deg)`,
                }} />
                {/* Bottom */}
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${color}25, ${color}05)`,
                    border: `1px solid ${color}35`,
                    transform: `translateY(${size / 2}px) rotateX(-90deg)`,
                }} />
            </div>
        ),
        sphere: (
            <motion.div
                animate={animate ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0]
                } : undefined}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}20)`,
                    border: `1px solid ${color}40`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 40px ${color}20`,
                }}
            />
        ),
        torus: (
            <motion.div
                animate={animate ? {
                    rotateX: [45, 45],
                    rotateY: [0, 360],
                    rotateZ: [0, 180, 0]
                } : undefined}
                transition={{
                    rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
                    rotateZ: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative"
                style={{
                    width: size,
                    height: size,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: `${size / 8}px solid ${color}40`,
                    boxShadow: `0 0 30px ${color}30`,
                }} />
                <div style={{
                    position: 'absolute',
                    width: size * 0.7,
                    height: size * 0.7,
                    left: '15%',
                    top: '15%',
                    borderRadius: '50%',
                    border: `${size / 12}px solid ${color}30`,
                    transform: 'rotateX(45deg)',
                }} />
            </motion.div>
        ),
        pyramid: (
            <motion.div
                animate={animate ? { rotateY: [0, 360] } : undefined}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid ${color}50`,
                    filter: `drop-shadow(0 0 20px ${color}40)`,
                }}
            />
        ),
        // Aliases for shape names
        ring: (
            <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `2px solid ${color}40`,
                boxShadow: `inset 0 0 20px ${color}20, 0 0 20px ${color}20`,
                backdropFilter: 'blur(5px)',
            }} />
        )
    };

    return (
        <div className={cn("perspective-1000", className)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                {(shapeStyles as any)[shape] || shapeStyles.sphere}
            </motion.div>
        </div>
    );
});

export const RevealOnScroll = memo(function RevealOnScroll({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
});

export const MorphingBlob = memo(function MorphingBlob({ className, color = '#D4AF37', size = 300 }: { className?: string; color?: string; size?: number }) {
    return (
        <div className={cn("absolute", className)} style={{ width: size, height: size }}>
            <motion.div
                animate={{
                    borderRadius: [
                        '40% 60% 70% 30% / 40% 50% 60% 50%',
                        '60% 40% 30% 70% / 50% 60% 50% 40%',
                        '40% 60% 70% 30% / 40% 50% 60% 50%'
                    ],
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${color}20, ${color}05)`,
                    filter: 'blur(40px)',
                }}
            />
        </div>
    );
});

export const ScrollProgress = memo(function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] origin-left z-[100]"
            style={{ scaleX }}
        />
    );
});

export const TextSplit = memo(function TextSplit({ text, className }: { text: string; className?: string }) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em" }}
                    key={index}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
});

export const NumberCounter = memo(function NumberCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
    const [count, setCount] = React.useState(0);
    const [isInView, setIsInView] = React.useState(false);
    const nodeRef = React.useRef<HTMLSpanElement>(null);

    // Custom IntersectionObserver instead of framer-motion useInView
    React.useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (!isInView) return;

        let startProgress = 0;
        const endValue = value;
        const frames = 60;
        const increment = endValue / frames;

        const timer = setInterval(() => {
            startProgress += increment;
            if (startProgress >= endValue) {
                setCount(endValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(startProgress));
            }
        }, (duration * 1000) / frames);

        return () => clearInterval(timer);
    }, [isInView, value, duration]);

    return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
});

export const Marquee = memo(function Marquee({ items = [], children, speed = 20 }: { items?: string[]; children?: React.ReactNode; speed?: number }) {
    return (
        <div className="flex overflow-hidden select-none gap-10 py-10">
            <motion.div
                className="flex flex-nowrap gap-10 min-w-full shrink-0"
                animate={{ x: [0, -1000] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            >
                {children ? (
                    <>
                        {children}
                        {children}
                    </>
                ) : (
                    items.concat(items).map((item, i) => (
                        <span key={i} className="text-4xl md:text-6xl font-black text-slate-100 uppercase italic">
                            {item}
                        </span>
                    ))
                )}
            </motion.div>
        </div>
    );
});
