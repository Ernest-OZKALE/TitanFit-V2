'use client';

import React from 'react';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
// import { useProfile } from '@/hooks/useProfile'; // Assuming this hook exists or we fetch from context

interface PremiumGateProps {
    children: React.ReactNode;
    fallback?: React.ReactNode; // Optional custom fallback
    blurAmount?: 'sm' | 'md' | 'lg';
}

export default function PremiumGate({ children, fallback, blurAmount = 'md' }: PremiumGateProps) {
    // Mock logic: In real app, check user.is_premium
    const isPremium = false; // Force FALSE to demo the gate

    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className="relative group overflow-hidden rounded-2xl">
            {/* Blurred Content */}
            <div className={`filter blur-${blurAmount} opacity-30 pointer-events-none select-none grayscale`}>
                {children}
            </div>

            {/* Gate Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20 p-6 text-center">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full mb-3 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Lock className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">
                    Titan Intelligence
                </h3>
                <p className="text-[10px] text-gray-300 max-w-[200px] mb-4">
                    Débloquez les analyses IA avancées et le coaching prédictif.
                </p>

                <button className="bg-[#D4AF37] text-black text-xs font-black uppercase px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                    <Crown className="w-3 h-3 text-black fill-black" />
                    Passer Pro
                </button>
            </div>
        </div>
    );
}
