'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelUpOverlayProps {
    onComplete: () => void;
    data?: {
        level?: number;
        title?: string;
    };
}

export function LevelUpOverlay({ onComplete, data }: LevelUpOverlayProps) {
    const level = data?.level || 2;
    const title = data?.title || "Titan-Grade Élite";

    useEffect(() => {
        // Sound effects could be triggered here if available
        const timer = setTimeout(onComplete, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                {/* Background Dim & Flash */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4] }}
                    transition={{ duration: 1, times: [0, 0.2, 1] }}
                    className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-auto"
                    onClick={onComplete}
                />

                {/* Central Animation Core */}
                <div className="relative flex flex-col items-center">
                    {/* Ring Glow */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.2] }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-64 h-64 rounded-full bg-titan-gold/30 blur-[80px]"
                    />

                    {/* The Badge Container */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20, y: 50, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 12,
                            delay: 0.2
                        }}
                        className={cn(
                            "relative w-48 h-48 rounded-[2.5rem] flex items-center justify-center",
                            "bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#996515]",
                            "border-4 border-white shadow-[0_30px_60px_-15px_rgba(212,175,55,0.4),inset_0_4px_10px_rgba(255,255,255,0.4)]",
                            "before:absolute before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-20 before:pointer-events-none"
                        )}
                    >
                        {/* 3D Inner Detail */}
                        <div className="absolute inset-2 rounded-[2rem] border border-white/20 flex flex-col items-center justify-center bg-black/5">
                            <Trophy className="w-20 h-20 text-white drop-shadow-xl" />
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-4xl font-black text-white font-mono mt-1"
                            >
                                Lvl {level}
                            </motion.span>
                        </div>

                        {/* Liquid Gold Shine Overlay */}
                        <motion.div
                            animate={{
                                x: ['-100%', '100%'],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                        />
                    </motion.div>

                    {/* Text Reveal */}
                    <div className="mt-12 text-center">
                        <motion.h2
                            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-5xl font-black uppercase tracking-tighter text-slate-900 drop-shadow-sm"
                        >
                            <span className="text-titan-gold">Level</span> Up
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="text-slate-500 font-black uppercase tracking-[0.3em] mt-2 flex items-center justify-center gap-2"
                        >
                            <Zap size={14} className="text-titan-gold fill-titan-gold" />
                            {title}
                            <Zap size={14} className="text-titan-gold fill-titan-gold" />
                        </motion.p>
                    </div>

                    {/* Sparkles / Particles (Simulated with few motion elements) */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0.5],
                                x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 150 + 50),
                                y: - (Math.random() * 150 + 50)
                            }}
                            transition={{
                                duration: 2,
                                delay: 0.4 + (i * 0.1),
                                ease: "easeOut"
                            }}
                            className="absolute"
                        >
                            <Sparkles className="text-titan-gold" size={24} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatePresence>
    );
}
