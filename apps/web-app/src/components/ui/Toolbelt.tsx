'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Zap,
    Utensils,
    Dumbbell,
    Users,
    User,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOLBELT_ITEMS = [
    { name: 'Nexus', href: '/dashboard', icon: Home, color: '#D4AF37' },
    { name: 'Bio', href: '/dashboard/body', icon: Activity, color: '#10B981' },
    { name: 'Fuel', href: '/nutrition', icon: Utensils, color: '#F59E0B' },
    { name: 'Protocol', href: '/training', icon: Dumbbell, color: '#D4AF37' },
    { name: 'Tribe', href: '/social', icon: Users, color: '#3B82F6' },
];

/**
 * Toolbelt Navigation Component
 * A tactile, high-fidelity dock for the "Toy World" UX.
 */
export function Toolbelt() {
    const pathname = usePathname();
    const mouseX = useMotionValue(Infinity);

    // Don't show on admin pages, auth pages, or landing page
    if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup' || pathname === '/') {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg md:max-w-xl md:hidden">
            {/* The Outer Shell */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className={cn(
                    "relative flex items-end justify-around gap-2 p-2 rounded-[2.5rem]",
                    "bg-white/80 backdrop-blur-2xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
                    "before:absolute before:inset-0 before:rounded-[2.5rem] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none"
                )}
            >
                {TOOLBELT_ITEMS.map((item) => (
                    <ToolbeltItem
                        key={item.href}
                        item={item}
                        mouseX={mouseX}
                        isActive={pathname === item.href}
                    />
                ))}
            </motion.nav>
        </div>
    );
}

function ToolbeltItem({
    item,
    mouseX,
    isActive
}: {
    item: typeof TOOLBELT_ITEMS[0];
    mouseX: any;
    isActive: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Semantic sizing based on distance (Magnetic Effect)
    const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
    const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={item.href}
            className="group relative flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Label Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute text-[10px] font-black uppercase tracking-widest text-titan-gold bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-titan-gold/30 whitespace-nowrap shadow-xl pointer-events-none"
                    >
                        {item.name}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Tactile Icon Container */}
            <motion.div
                ref={ref}
                style={{ scale }}
                className={cn(
                    "relative w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                    "border border-slate-100 overflow-hidden",
                    isActive
                        ? "bg-gradient-to-b from-white to-titan-gold/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_10px_20px_-5px_#D4AF3744]"
                        : "bg-white/40 hover:bg-white/80 shadow-sm"
                )}
            >
                {/* 3D Depth Inner Shadow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" />

                {/* Active Indicator Glow */}
                {isActive && (
                    <motion.div
                        layoutId="active-glow"
                        className="absolute inset-0 bg-titan-gold/10 blur-xl rounded-full"
                    />
                )}

                <item.icon
                    className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isActive ? "text-titan-gold drop-shadow-[0_0_8px_#D4AF37]" : "text-gray-500 group-hover:text-white"
                    )}
                />

                {/* Glass High-Light Overlay */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Active Dot */}
            {isActive && (
                <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1 w-1 h-1 bg-titan-gold rounded-full shadow-[0_0_8px_#D4AF37]"
                />
            )}
        </Link>
    );
}
