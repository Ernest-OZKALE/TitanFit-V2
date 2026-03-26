'use client';

import { motion } from 'framer-motion';
import { Home, Activity, Utensils, Dumbbell, Users, User, Command, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { GlobalCommand } from './GlobalCommand';

const navItems = [
    { name: 'Accueil', path: '/dashboard', icon: Home },
    { name: 'Sport', path: '/dashboard/training', icon: Dumbbell },
    { name: 'Nutrition', path: '/dashboard/nutrition', icon: Utensils },
    { name: 'Corps', path: '/dashboard/body', icon: Activity },
    { name: 'Profil', path: '/dashboard/profile', icon: User },
    // ADMIN LINK (Temporarily visible to all for dev)
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
];

export function FloatingDock() {
    const pathname = usePathname();
    const [isCmdOpen, setIsCmdOpen] = useState(false);

    return (
        <>
            {/* Conteneur Flottant - Largeur ajustée pour le texte */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[5000] flex items-center gap-1 p-2 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-[#D4AF37] text-slate-900 font-bold shadow-lg shadow-[#D4AF37]/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />

                            {/* Label Explicite - Visible si Actif ou sur Desktop large */}
                            <span className={cn(
                                "text-sm font-medium hidden md:inline-block", // Toujours visible sur Desktop
                                isActive && "inline-block" // Visible sur Mobile seulement si actif (Smart expansion)
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />

                <button
                    onClick={() => setIsCmdOpen(true)}
                    className="relative items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:bg-white/10 hover:text-[#D4AF37] transition-all hidden md:flex"
                    title="Command Palette (Cmd+K)"
                >
                    <Command className="w-5 h-5" />
                </button>
            </div>

            <GlobalCommand isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
        </>
    );
}
