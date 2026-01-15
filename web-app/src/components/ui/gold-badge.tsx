'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GoldBadgeProps {
    children: ReactNode;
    icon?: LucideIcon;
    variant?: 'solid' | 'outline' | 'glow';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function GoldBadge({
    children,
    icon: Icon,
    variant = 'solid',
    size = 'md',
    className = '',
}: GoldBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5',
    };

    const variantClasses = {
        solid: 'bg-[#D4AF37]/20 text-[#D4AF37] border-transparent',
        outline: 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50',
        glow: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.3)]',
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 font-bold rounded-full border
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
        >
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}
