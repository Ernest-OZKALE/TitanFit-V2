'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, SkipForward } from 'lucide-react';

interface RestOverlayProps {
    duration: number; // in seconds
    onComplete: () => void;
    isVisible: boolean;
}

export default function RestOverlay({ duration, onComplete, isVisible }: RestOverlayProps) {
    const [templateLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!isVisible) {
            setTimeLeft(duration);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible, duration, onComplete]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((duration - templateLeft) / duration) * 100;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80"
                >
                    {/* Progress Circle */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                        {/* SVG Circle Background */}
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/10"
                            />
                            {/* Animated Progress */}
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                className="text-[#D4AF37] transition-all duration-1000 ease-linear"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em] mb-2">Repos</span>
                            <span className="text-7xl font-black text-white tracking-tighter tabular-nums">
                                {formatTime(templateLeft)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 w-full max-w-xs px-6">
                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest transition-all"
                        >
                            <SkipForward className="w-5 h-5" />
                            Passer le repos
                        </button>
                        <p className="text-center text-xs text-gray-500 italic">
                            Astuce : Marchez pour accélérer la récupération.
                        </p>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
