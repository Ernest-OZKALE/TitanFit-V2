'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TactileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    maxHeight?: string;
}

export function TactileBottomSheet({
    isOpen,
    onClose,
    children,
    className,
    maxHeight = "90vh"
}: TactileBottomSheetProps) {
    const controls = useDragControls();

    // Prevent scrolling on body when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        drag="y"
                        dragControls={controls}
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        style={{ maxHeight }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-3xl border-t border-slate-200/60 rounded-t-[2.5rem] shadow-[0_-15px_50px_rgba(0,0,0,0.1)] md:hidden overflow-hidden",
                            className
                        )}
                    >
                        {/* Tactile Handle Bar */}
                        <div
                            className="flex justify-center p-4 cursor-grab active:cursor-grabbing touch-none"
                            onPointerDown={(e) => controls.start(e)}
                        >
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full shadow-sm" />
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="overflow-y-auto px-6 pb-12 max-h-[80vh] scrollbar-none text-slate-900">
                            {children}
                        </div>

                        {/* Premium Bottom Glow (Light) */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                    </motion.div>

                </>
            )}
        </AnimatePresence>
    );
}
