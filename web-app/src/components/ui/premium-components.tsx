'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/* ================================================================
   STAT CARD - Premium stats display with gold accents
   ================================================================ */

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className = '' }: StatCardProps) {
    return (
        <div className={`stat-card group ${className}`}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="stat-label">{title}</p>
                    <p className="stat-value">{value}</p>
                    {subtitle && (
                        <p className="text-gray-400 text-sm font-medium">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-gray-400">vs last week</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="icon-gold group-hover:shadow-gold transition-all duration-300">
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ================================================================
   GLASS CARD - Glassmorphism container
   ================================================================ */

interface GlassCardProps {
    children: ReactNode;
    variant?: 'default' | 'light' | 'gold';
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, variant = 'default', className = '', hover = true }: GlassCardProps) {
    const variants = {
        default: 'glass-card',
        light: 'glass-card-light',
        gold: 'glass-card-gold'
    };

    return (
        <div className={`${variants[variant]} ${hover ? 'hover:border-[#D4AF37]/40 hover:shadow-gold transition-all duration-300' : ''} p-6 ${className}`}>
            {children}
        </div>
    );
}

/* ================================================================
   PREMIUM CARD - Elevated card with animations
   ================================================================ */

interface PremiumCardProps {
    children: ReactNode;
    className?: string;
    animate?: boolean;
}

export function PremiumCard({ children, className = '', animate = true }: PremiumCardProps) {
    return (
        <div className={`premium-card p-6 ${animate ? 'animate-fade-in' : ''} ${className}`}>
            {children}
        </div>
    );
}

/* ================================================================
   GOLD BUTTON - Primary action button
   ================================================================ */

interface GoldButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'solid' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    icon?: LucideIcon;
}

export function GoldButton({
    children,
    onClick,
    variant = 'solid',
    size = 'md',
    disabled = false,
    className = '',
    icon: Icon
}: GoldButtonProps) {
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                ${variant === 'solid' ? 'btn-gold' : 'btn-gold-outline'}
                ${sizes[size]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                flex items-center justify-center gap-2
                ${className}
            `}
        >
            {Icon && <Icon className="h-5 w-5" />}
            {children}
        </button>
    );
}

/* ================================================================
   PROGRESS BAR - Animated gold progress
   ================================================================ */

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    className?: string;
}

export function PremiumProgressBar({ value, max = 100, label, showValue = true, className = '' }: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={`space-y-2 ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center">
                    {label && <span className="text-gray-400 text-sm">{label}</span>}
                    {showValue && <span className="text-[#D4AF37] font-semibold">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="progress-bar-gold h-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

/* ================================================================
   BADGE - Tags and labels
   ================================================================ */

interface BadgeProps {
    children: ReactNode;
    variant?: 'gold' | 'success' | 'warning' | 'default';
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variants = {
        gold: 'badge-gold',
        success: 'badge-success',
        warning: 'badge-warning',
        default: 'bg-white/5 text-gray-300 border border-white/10'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

/* ================================================================
   ICON BOX - Highlighted icon container
   ================================================================ */

interface IconBoxProps {
    icon: LucideIcon;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'gold' | 'success' | 'warning' | 'info';
    className?: string;
}

export function IconBox({ icon: Icon, size = 'md', variant = 'gold', className = '' }: IconBoxProps) {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const iconSizes = {
        sm: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    const variants = {
        gold: 'bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37]',
        success: 'bg-emerald-500/20 text-emerald-400',
        warning: 'bg-amber-500/20 text-amber-400',
        info: 'bg-blue-500/20 text-blue-400'
    };

    return (
        <div className={`${sizes[size]} rounded-xl flex items-center justify-center ${variants[variant]} ${className}`}>
            <Icon className={iconSizes[size]} />
        </div>
    );
}

/* ================================================================
   DIVIDER - Gold-accented separators
   ================================================================ */

interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
    return (
        <div className={`${orientation === 'horizontal' ? 'divider-gold' : 'divider-vertical-gold'} ${className}`} />
    );
}

/* ================================================================
   SECTION HEADER - Consistent section titles
   ================================================================ */

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-6 ${className}`}>
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
                {subtitle && <p className="text-gray-400 mt-1 font-medium">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
