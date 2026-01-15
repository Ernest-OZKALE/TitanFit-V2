'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Zap, Camera, Mic, ChevronLeft, ScanLine } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import { ToyCard } from '@/components/dashboard/toy-ui/ToyCard';
import { HeroHeader } from '@/components/dashboard/toy-ui/HeroHeader';
import BarcodeScanner from '@/components/BarcodeScanner';
import { NutriScanner } from '@/components/vision/NutriScanner';
import { toast } from 'sonner';

export default function LogMealPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [showVision, setShowVision] = useState(false);
    const [scannedProducts, setScannedProducts] = useState<any[]>([]);
    const [recentMeals, setRecentMeals] = useState<any[]>([]);
    const [isLoadingMeals, setIsLoadingMeals] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch recent meals
    useEffect(() => {
        fetchRecentMeals();
    }, []);

    // Agent integration: listen for contextual commands
    useEffect(() => {
        const openScanner = () => setShowScanner(true);
        const focusSearch = () => {
            const input = document.getElementById('food-search-input');
            if (input) input.focus();
        };

        window.addEventListener('titan:open-scanner', openScanner);
        window.addEventListener('titan:focus-search', focusSearch);

        return () => {
            window.removeEventListener('titan:open-scanner', openScanner);
            window.removeEventListener('titan:focus-search', focusSearch);
        };
    }, []);

    const fetchRecentMeals = async () => {
        setIsLoadingMeals(true);
        try {
            const response = await fetch('/api/meals?limit=5');
            const data = await response.json();
            if (data.meals) {
                setRecentMeals(data.meals);
            }
        } catch (error) {
            console.error('Failed to fetch meals:', error);
        } finally {
            setIsLoadingMeals(false);
        }
    };

    const handleProductDetected = async (product: any) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: product.name,
                    calories: product.calories,
                    protein: product.protein,
                    carbs: product.carbs,
                    fat: product.fat,
                    meal_type: 'other', // Default
                    notes: `Scanné via code-barre (${product.brand || ''})`
                }),
            });

            if (!response.ok) throw new Error('Failed to save meal');

            const data = await response.json();
            setRecentMeals(prev => [data.meal, ...prev.slice(0, 4)]);
            setShowScanner(false);
            toast.success(`${product.name} ajouté !`);
        } catch (error) {
            console.error('Save meal error:', error);
            toast.error("Erreur lors de l'enregistrement du repas");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-hidden pb-32">

            {/* Scanner Modal */}
            <AnimatePresence>
                {showScanner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md"
                        >
                            <BarcodeScanner
                                onDetected={handleProductDetected}
                                onClose={() => setShowScanner(false)}
                                isSaving={isSaving}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vision Modal */}
            <AnimatePresence>
                {showVision && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
                    >
                        <div className="p-4 flex justify-between items-center border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">📸 Vision AI</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowVision(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕ Fermer
                            </Button>
                        </div>
                        <div className="flex-1 p-4">
                            <NutriScanner
                                onDetected={(product) => {
                                    handleProductDetected(product);
                                    setShowVision(false);
                                }}
                                onClose={() => setShowVision(false)}
                                isSaving={isSaving}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Header (Toy Style) */}
            <header className="p-4 pt-8 bg-gradient-to-b from-emerald-900/40 to-black">
                <div className="flex items-center gap-4">
                    <BackButton destination="/dashboard" />
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">
                        Carburant <span className="text-emerald-400">Station</span>
                    </h1>
                </div>
            </header>

            {/* 2. Chef's Tip */}
            <HeroHeader
                userName="Chef"
                message="Qu'est-ce qu'on mange ? Scanne un code-barre ou prends une photo !"
                mood="neutral"
            />

            <main className="px-4 space-y-4 max-w-md mx-auto">

                {/* 3. BIG ACTIONS (Toy Cards) */}
                <div className="grid grid-cols-2 gap-4">
                    <ToyCard
                        title="Scanner"
                        subtitle="Code-barre"
                        icon={ScanLine}
                        color="bg-purple-600"
                        delay={0}
                        onClick={() => setShowScanner(true)}
                    />
                    <ToyCard
                        title="Photo"
                        subtitle="Vision AI"
                        icon={Camera}
                        color="bg-blue-600"
                        delay={1}
                        onClick={() => setShowVision(true)}
                    />
                </div>

                {/* 4. SEARCH (Friendly Bubble) */}
                <div className="relative">
                    <Search className="absolute left-4 top-4 text-emerald-200" />
                    <input
                        id="food-search-input"
                        type="text"
                        placeholder="Ou tape le nom d'un aliment..."
                        className="w-full h-14 pl-12 bg-emerald-900/20 border-2 border-emerald-500/30 rounded-2xl text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 5. RECENT (Stack) */}
                <div className="pt-4">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 px-2">Derniers Repas</p>
                    <div className="space-y-3">
                        {isLoadingMeals ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-20 bg-zinc-900 animate-pulse rounded-2xl border border-white/5" />
                                ))}
                            </div>
                        ) : recentMeals.length > 0 ? (
                            recentMeals.map((meal, i) => (
                                <motion.div
                                    key={meal.id}
                                    whileTap={{ scale: 0.98 }}
                                    className="p-4 bg-zinc-900 rounded-2xl border border-white/5 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-bold text-white">{meal.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(meal.logged_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="text-emerald-400 font-black">{meal.calories} kcal</div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                Aucun repas récent
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}

