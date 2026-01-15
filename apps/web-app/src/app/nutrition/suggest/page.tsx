'use client';

import { motion } from 'framer-motion';
import { MealSwiper } from '@/components/nutrition/MealSwiper';
import { MealContext } from '@/types/nutrition';
import { ArrowLeft, ChefHat, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { MorphingBlob } from '@/components/3d-effects';

export default function SuggestPage() {

    // In a real app, this comes from the daily log calculations
    const context: MealContext = {
        mealType: 'lunch',
        remainingCalories: 850,
        remainingProtein: 45,
        timeAvailable: 30
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col">
            {/* Background */}
            <MorphingBlob className="fixed -top-40 -right-40 opacity-20" color="#D4AF37" size={600} />
            <MorphingBlob className="fixed -bottom-40 -left-40 opacity-10" color="#0EA5E9" size={500} />

            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between relative z-10">
                <Link href="/dashboard">
                    <button className="p-3 bg-white rounded-full shadow-sm text-slate-400 hover:text-[#D4AF37] transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                        <ChefHat className="h-5 w-5 text-[#D4AF37]" />
                        Chef IA
                    </h1>
                    <p className="text-xs font-medium text-slate-500">Suggestions du midi</p>
                </div>
                <div className="w-12" /> {/* Spacer for centering */}
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md text-center mb-6"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Qu'est-ce qu'on mange ?</h2>
                    <p className="text-slate-500">
                        Basé sur vos <span className="text-[#D4AF37] font-bold">{context.remainingCalories} kcal</span> restantes.
                    </p>
                </motion.div>

                <div className="w-full">
                    <MealSwiper context={context} />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex items-center gap-4 text-sm text-slate-400 font-medium"
                >
                    <span>← Non merci</span>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Miam ! →</span>
                </motion.div>
            </div>
        </div>
    );
}
