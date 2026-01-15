'use client';

import { useState, useEffect } from 'react';
import { Plus, Utensils, ChefHat, ScanBarcode, CalendarRange, Refrigerator, Search, ShoppingCart, Apple } from 'lucide-react';
import { ProgressRing } from '@/components/ui/progress-ring';
import { QuickLogMeal } from '@/components/nutrition/QuickLogMeal';
import { FoodDiary } from '@/components/nutrition/FoodDiary';
import { HydrationTracker } from '@/components/nutrition/HydrationTracker';
import { RecipeLibrary } from '@/components/nutrition/RecipeLibrary';
import { FridgeEngine } from '@/components/nutrition/FridgeEngine';
import { ProductScanner } from '@/components/nutrition/ProductScanner';
import { MealPlanner } from '@/components/nutrition/MealPlanner';
import { ShoppingList } from '@/components/nutrition/ShoppingList';
import { AppleHealthSync } from '@/components/nutrition/AppleHealthSync';
import { motion, AnimatePresence } from 'framer-motion';

import { NutritionOnboarding } from '@/components/nutrition/NutritionOnboarding';
import { NutritionPlan, UserStats } from '@/lib/nutrition-calculations';

type Tab = 'tracker' | 'recipes' | 'fridge' | 'scanner' | 'planner' | 'shopping' | 'health';

export default function NutritionPage() {
    const [activeTab, setActiveTab] = useState<Tab>('tracker');
    const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
    const [totalCals, setTotalCals] = useState(0);

    // Personalization State
    const [plan, setPlan] = useState<NutritionPlan | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Initial Load & Listeners
    useEffect(() => {
        // Load Plan
        const savedPlan = localStorage.getItem('titan_nutrition_plan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
        } else {
            setShowOnboarding(true);
        }

        calculateTotals();
        window.addEventListener('storage', calculateTotals);
        return () => window.removeEventListener('storage', calculateTotals);
    }, []);

    // Recalculer le total quand le storage change
    const calculateTotals = () => {
        const stored = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = stored.filter((l: any) => l.date === today);
        const total = todayLogs.reduce((acc: number, curr: any) => acc + curr.cals, 0);
        setTotalCals(total);
    };

    const handleOnboardingComplete = (newPlan: NutritionPlan, stats: UserStats) => {
        setPlan(newPlan);
        setShowOnboarding(false);
        localStorage.setItem('titan_nutrition_plan', JSON.stringify(newPlan));
        localStorage.setItem('titan_user_stats', JSON.stringify(stats));
    };

    const dailyTarget = plan?.calories || 2000; // Fallback safe
    const progress = Math.min((totalCals / dailyTarget) * 100, 100);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-48 relative max-w-2xl mx-auto">
            {/* ONBOARDING FLOW */}
            {showOnboarding && <NutritionOnboarding onComplete={handleOnboardingComplete} />}

            {/* TITAN HEADER */}
            <header className="px-6 py-8 text-center bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-1">
                    INGÉNIERIE <br /> <span className="text-[#FF4D00]">DU CARBURANT.</span>
                </h1>
                <div onClick={() => setShowOnboarding(true)} className="inline-block cursor-pointer hover:bg-slate-50 px-3 py-1 rounded-full transition-colors">
                    <p className="text-slate-500 text-sm font-medium">Objectif: {plan?.calories || '...'} kcal <span className="text-xs opacity-50 ml-1">(Modifier)</span></p>
                </div>

                {/* NAVIGATION TABS */}
                {/* NAVIGATION TABS */}
                <div className="flex flex-wrap justify-center gap-2 mt-6 bg-slate-100 p-2 rounded-2xl">
                    {[
                        { id: 'tracker', icon: Utensils, label: 'Tracker' },
                        { id: 'recipes', icon: ChefHat, label: 'Cuisine' },
                        { id: 'fridge', icon: Refrigerator, label: 'Frigo' },
                        { id: 'scanner', icon: ScanBarcode, label: 'Scan' },
                        { id: 'planner', icon: CalendarRange, label: 'Plan' },
                        { id: 'shopping', icon: ShoppingCart, label: 'Courses' },
                        { id: 'health', icon: Apple, label: 'Santé' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex flex-col items-center justify-center min-w-[4rem] flex-1 py-2 px-1 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-md scale-100 font-bold'
                                : 'text-slate-400 hover:text-slate-600 scale-95 font-medium'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 mb-1 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-[10px] uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className="px-4 mt-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'tracker' && (
                        <motion.div
                            key="tracker"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* MAIN GAUGE */}
                            <div className="flex flex-col items-center justify-center relative py-4">
                                <div className="relative z-10 transition-all duration-500 ease-out">
                                    <ProgressRing
                                        progress={progress}
                                        strokeWidth={18}
                                        color="orange"
                                        className="drop-shadow-2xl"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Utensils className="w-6 h-6 text-slate-300 mb-2" />
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{totalCals}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Consommées</span>
                                            <span className="text-[10px] font-medium text-slate-300">Sur {dailyTarget} kcal</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Glow behind */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-[#FF4D00]/10 rounded-full blur-[50px]" />
                            </div>

                            {/* QUICK ACTION BAR */}
                            <div className="bg-white rounded-[2rem] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-2">
                                <div
                                    onClick={() => setIsQuickLogOpen(true)}
                                    className="flex-1 h-12 pl-6 flex items-center text-slate-400 cursor-text select-none text-sm font-medium group"
                                >
                                    <Search className="w-4 h-4 mr-3 text-slate-300 group-hover:text-[#FF4D00] transition-colors" />
                                    Ajouter un aliment (ex: Poulet...)
                                </div>
                                <button
                                    onClick={() => setIsQuickLogOpen(true)}
                                    className="w-12 h-12 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-slate-900/20"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid gap-6">
                                <HydrationTracker />
                                <FoodDiary />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'recipes' && (
                        <motion.div
                            key="recipes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <RecipeLibrary />
                        </motion.div>
                    )}

                    {activeTab === 'fridge' && (
                        <motion.div
                            key="fridge"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <FridgeEngine />
                        </motion.div>
                    )}

                    {activeTab === 'scanner' && (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <ProductScanner />
                        </motion.div>
                    )}

                    {activeTab === 'planner' && (
                        <motion.div
                            key="planner"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <MealPlanner />
                        </motion.div>
                    )}

                    {activeTab === 'shopping' && (
                        <motion.div
                            key="shopping"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ShoppingList />
                        </motion.div>
                    )}

                    {activeTab === 'health' && (
                        <motion.div
                            key="health"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <AppleHealthSync />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <QuickLogMeal
                isOpen={isQuickLogOpen}
                onClose={() => setIsQuickLogOpen(false)}
                onLogSuccess={calculateTotals}
            />
        </div>
    );
}
