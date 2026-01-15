'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Page transition variants inspired by Framer/Multi
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Slide variants for more dramatic transitions
const slideVariants = {
    initial: {
        opacity: 0,
        x: 60,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: -60,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Fade variants for subtle transitions
const fadeVariants = {
    initial: {
        opacity: 0,
    },
    enter: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

// Scale variants for modern feel
const scaleVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        transition: {
            duration: 0.25,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
};

interface PageTransitionProps {
    children: ReactNode;
    variant?: 'default' | 'slide' | 'fade' | 'scale';
}

export function PageTransition({ children, variant = 'default' }: PageTransitionProps) {
    const pathname = usePathname();

    const variants = {
        default: pageVariants,
        slide: slideVariants,
        fade: fadeVariants,
        scale: scaleVariants,
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants[variant]}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Stagger children animation wrapper
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function StaggerContainer({ children, className = "", delay = 0 }: StaggerContainerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: 0.08,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Individual stagger item
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.21, 0.47, 0.32, 0.98],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Animate on mount wrapper
interface AnimateOnMountProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimateOnMount({
    children,
    delay = 0,
    className = "",
    direction = 'up'
}: AnimateOnMountProps) {
    const directionMap = {
        up: { y: 30 },
        down: { y: -30 },
        left: { x: 30 },
        right: { x: -30 },
    };

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...directionMap[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
        >
            {children}
        </motion.div>
    );
}

// Page loading overlay
export function PageLoadingOverlay({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Content reveal animation
interface ContentRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function ContentReveal({ children, delay = 0, className = "" }: ContentRevealProps) {
    return (
        <motion.div
            className={`overflow-hidden ${className}`}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delay,
                    },
                },
            }}
        >
            <motion.div
                variants={{
                    hidden: { y: '100%', opacity: 0 },
                    visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.6,
                            ease: [0.21, 0.47, 0.32, 0.98],
                        },
                    },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
