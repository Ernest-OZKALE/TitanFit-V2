'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["INITIALIZING", "LOADING ASSETS", "VERIFYING BIOMETRICS", "ACCESS GRANTED"];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index === WORDS.length - 1) {
            setTimeout(onComplete, 1000); // Hold final message slightly
            return;
        }

        const timeout = setTimeout(() => {
            setIndex(prev => prev + 1);
        }, 1500 / WORDS.length); // Quick cycle

        return () => clearTimeout(timeout);
    }, [index, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-[#D4AF37] font-mono text-xl md:text-3xl font-bold tracking-widest uppercase overflow-hidden"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#D4AF37] animate-pulse" />
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {WORDS[index]}
                </motion.span>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('/assets/scanlines.png')] opacity-10" />

            {/* Progress Bar */}
            <div className="absolute bottom-10 left-10 right-10 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
}
