'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function MaskText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<any>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: "100%" }}
                animate={isInView ? { y: "0%" } : { y: "100%" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="inline-block"
            >
                {children}
            </motion.div>
        </div>
    );
}
