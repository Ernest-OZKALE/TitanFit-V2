'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0, direction = "up", className = "" }: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const getDirectionOffset = () => {
        switch (direction) {
            case "up": return { y: 75, x: 0 };
            case "down": return { y: -75, x: 0 };
            case "left": return { x: 75, y: 0 };
            case "right": return { x: -75, y: 0 };
            default: return { y: 75, x: 0 };
        }
    };

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, ...getDirectionOffset() },
                    visible: { opacity: 1, y: 0, x: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }} // "Prestige" easing
            >
                {children}
            </motion.div>
        </div>
    );
};
