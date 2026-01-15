'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ToyCardProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    color?: string; // Tailwind bg color class
    delay?: number;
    children?: ReactNode;
    className?: string;
}

export function ToyCard({
    title,
    subtitle,
    icon: Icon,
    onClick,
    color = "bg-zinc-800",
    delay = 0,
    children,
    className = ""
}: ToyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: delay * 0.1 }}
            whileHover={{ scale: 1.02, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative p-6 rounded-[2rem] cursor-pointer 
                ${color} border-b-8 border-black/20
                flex flex-col gap-4 overflow-hidden
                ${className}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                    {subtitle && <p className="text-white/60 font-medium mt-1 text-lg">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="p-3 bg-white/10 rounded-2xl text-white">
                        <Icon size={32} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            {/* Content Slot */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Shine Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        </motion.div>
    );
}
