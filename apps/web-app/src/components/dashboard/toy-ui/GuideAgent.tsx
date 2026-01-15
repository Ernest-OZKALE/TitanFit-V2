'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgentBrain } from '@/hooks/useAgentBrain';

export function GuideAgent() {
    const { message, actions, mood } = useAgentBrain();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastInteraction, setLastInteraction] = useState(Date.now());

    // 1. Auto-open on route change
    useEffect(() => {
        setIsExpanded(true);
    }, [pathname]);

    // 2. Idle Detection: Open automatically after 10s of inactivity
    useEffect(() => {
        const interval = setInterval(() => {
            const idleTime = Date.now() - lastInteraction;
            if (idleTime > 10000 && !isExpanded) {
                setIsExpanded(true);
            }
        }, 5000);

        const resetInteraction = () => setLastInteraction(Date.now());
        window.addEventListener('mousemove', resetInteraction);
        window.addEventListener('keydown', resetInteraction);
        window.addEventListener('touchstart', resetInteraction);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', resetInteraction);
            window.removeEventListener('keydown', resetInteraction);
            window.removeEventListener('touchstart', resetInteraction);
        };
    }, [lastInteraction, isExpanded]);

    // 3. First Visit Recognition
    useEffect(() => {
        const hasVisited = localStorage.getItem('titan_guide_visited');
        if (!hasVisited) {
            setIsExpanded(true);
            localStorage.setItem('titan_guide_visited', 'true');
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-4 z-[9999] flex flex-col items-end gap-2 pointer-events-none">

            {/* COMMAND CENTER (Expandable) */}
            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-xl border border-slate-200 p-5 rounded-2xl shadow-2xl w-80 pointer-events-auto relative overflow-hidden"
                    >
                        {/* Background Glint */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex gap-4 mb-4">
                            <div className="text-3xl animate-bounce pt-1">
                                {mood === 'happy' ? '🤖' : '🧐'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                    "{message}"
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS GRID */}
                        <div className="space-y-2">
                            {actions.map((action, idx) => (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    className={`w-full justify-start h-12 px-4 rounded-xl border ${action.highlight
                                        ? 'bg-[#D4AF37] text-white border-[#D4AF37] hover:bg-[#B8860B] hover:text-white font-bold shadow-md'
                                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:text-slate-900'
                                        } transition-all group`}
                                    onClick={() => {
                                        action.onClick();
                                    }}
                                >
                                    <action.icon className={`w-5 h-5 mr-3 ${action.highlight ? 'text-white' : 'text-[#D4AF37]'}`} />
                                    <span className="flex-1 text-left">{action.label}</span>
                                    {action.highlight && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                                </Button>
                            ))}
                        </div>

                        {/* Footer Tip */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest">
                            <span>Titan OS v2.1</span>
                            <span className="flex items-center gap-1 text-[#D4AF37]">
                                <Sparkles className="w-3 h-3" /> Guide
                            </span>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* AVATAR FLOTTANT (Always Visible) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-14 h-14 bg-white rounded-full shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-200 flex items-center justify-center pointer-events-auto relative overflow-hidden group transition-all duration-500 hover:shadow-xl`}
            >
                <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 transition-opacity" />
                <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />

                {!isExpanded && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
                    </span>
                )}
            </motion.button>

        </div>
    );
}
