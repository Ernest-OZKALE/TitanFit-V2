'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, LayoutDashboard, Zap, Activity, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
    title: string;
    description: string;
    targetId?: string; // ID to highlight
    position: 'center' | 'top' | 'bottom';
    icon: any;
}

const steps: Step[] = [
    {
        title: "Bienvenue sur le Cockpit",
        description: "Votre quartier général TitanFit V2. Ici, chaque donnée est une arme pour votre progression.",
        position: 'center',
        icon: Sparkles
    },
    {
        title: "1. Vos Signaux Vitaux",
        description: "Contrôlez votre métabolisme, récupération et dépense énergétique en un coup d'œil.",
        targetId: 'tour-stats-ribbon',
        position: 'bottom',
        icon: Activity
    },
    {
        title: "2. Actions Rapides",
        description: "Loggez vos repas, entraînements ou hydratation en moins de 3 secondes via ce panel.",
        targetId: 'tour-quick-actions',
        position: 'top',
        icon: Zap
    },
    {
        title: "3. Navigation Complète",
        description: "Accédez à votre Programme, Cycle Nutritionnel et Communauté via la barre latérale.",
        targetId: 'tour-navigation',
        position: 'center', // Sidebar allows center usually
        icon: LayoutDashboard
    }
];

export function DashboardOnboarding() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
    const prevStepRef = useRef(0);

    // --- REPLAY LISTENER ---
    useEffect(() => {
        const startTour = () => {
            setIsVisible(true);
            setCurrentStep(0);
        };
        window.addEventListener('titan-tour-start', startTour);

        // Init window size for SVG mask
        if (typeof window !== 'undefined') {
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('titan-tour-start', startTour);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    // --- AUTO-START ---
    useEffect(() => {
        const hasSeen = localStorage.getItem('titan_onboarding_completed');
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    // --- ROBUST SPOTLIGHT TRACKER (RAF) ---
    useEffect(() => {
        if (!isVisible) return;

        const step = steps[currentStep];
        if (!step.targetId) {
            setTargetRect(null);
            prevStepRef.current = currentStep;
            return;
        }

        let animationFrameId: number;

        const updateRect = () => {
            const el = document.getElementById(step.targetId!);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    setTargetRect(rect);
                }
            }
            animationFrameId = requestAnimationFrame(updateRect);
        };

        // Scroll into view on step change
        if (currentStep !== prevStepRef.current) {
            const el = document.getElementById(step.targetId);
            if (el) {
                // Inline 'center' helps with horizontal scrolling issues
                el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }

        updateRect();

        return () => {
            cancelAnimationFrame(animationFrameId);
            prevStepRef.current = currentStep;
        };
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('titan_onboarding_completed', 'true');
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    const isStepChange = currentStep !== prevStepRef.current;

    // Positioning logic for explanation popup
    const popupY = targetRect ? (step.position === 'top' ? -220 : 220) : 0;
    // Safety check: if popup goes off screen top/bottom, flip it?
    // For now, simple logic is fine for the requested scope.

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* SVG BACKDROP WITH HOLE */}
                    <div className="fixed inset-0 z-[9990] pointer-events-none w-full h-full">
                        <svg className="w-full h-full" width="100%" height="100%">
                            <defs>
                                <mask id="spotlight-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    {targetRect && (
                                        <rect
                                            x={targetRect.left - 10}
                                            y={targetRect.top - 10}
                                            width={targetRect.width + 20}
                                            height={targetRect.height + 20}
                                            rx="16"
                                            fill="black"
                                        />
                                    )}
                                </mask>
                            </defs>
                            {/* Dark Overlay using Mask */}
                            <motion.rect
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.85 }}
                                exit={{ opacity: 0 }}
                                x="0" y="0" width="100%" height="100%"
                                fill="#0f172a" // Slate-900 equivalent
                                mask="url(#spotlight-mask)"
                            />
                        </svg>
                    </div>

                    {/* SPOTLIGHT FRAME (BORDER) */}
                    {targetRect && (
                        <div
                            className="fixed z-[9991] pointer-events-none rounded-2xl border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.5)]"
                            style={{
                                top: targetRect.top - 10,
                                left: targetRect.left - 10,
                                width: targetRect.width + 20,
                                height: targetRect.height + 20,
                                // Smooth transition only when changing steps, instant when scrolling
                                transition: isStepChange ? 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                            }}
                        >
                            {/* Corner Accents */}
                            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-[3px] border-l-[3px] border-[#D4AF37] bg-transparent rounded-tl-xl" />
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-[3px] border-r-[3px] border-[#D4AF37] bg-transparent rounded-tr-xl" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-[3px] border-l-[3px] border-[#D4AF37] bg-transparent rounded-bl-xl" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-[3px] border-r-[3px] border-[#D4AF37] bg-transparent rounded-br-xl" />
                        </div>
                    )}

                    {/* EXPLANATION CARD - Floating Logic */}
                    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: targetRect ? popupY : 0,
                                // Logic: if target is centered (loading screen), keep popup centered. 
                                // Otherwise, let it float vertically relative to center.
                            }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                            className="pointer-events-auto bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-slate-100 relative overflow-hidden"
                        >
                            {/* Glossy Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

                            {/* Content */}
                            <div className="flex gap-4 relative z-10">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shadow-sm">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">{step.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex gap-1.5">
                                            {steps.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-[#D4AF37]' : 'w-1.5 bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex gap-3">
                                            {currentStep > 0 && (
                                                <Button size="sm" variant="ghost" onClick={() => setCurrentStep(c => c - 1)} className="text-slate-400 font-bold hover:text-slate-900">
                                                    Retour
                                                </Button>
                                            )}
                                            <Button size="sm" onClick={handleNext} className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold shadow-md shadow-[#D4AF37]/20">
                                                {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// Helper to trigger it from anywhere
export const triggerOnboarding = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('titan-tour-start'));
    }
};
