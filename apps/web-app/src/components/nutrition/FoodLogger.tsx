'use client';

import React, { useState } from 'react';
import { Search, Plus, Leaf, AlertCircle, Droplet, Candy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateAHEI, getFoodImpactColor, FoodItem } from '@/services/nutrition';

// Mock Data for Demo (since DB might be empty)
const MOCK_FOODS: FoodItem[] = [
    { id: '1', name: 'Spinach Salad', quality_tags: ['green_leafy', 'nuts_legumes'], calories: 150, protein: 5, carbs: 10, fats: 8 },
    { id: '2', name: 'Double Bacon Burger', quality_tags: ['processed_meat', 'sodium', 'trans_fat'], calories: 850, protein: 40, carbs: 50, fats: 55 },
    { id: '3', name: 'Grilled Salmon', quality_tags: ['omega_3'], calories: 400, protein: 35, carbs: 0, fats: 20 },
    { id: '4', name: 'Soda (Cola)', quality_tags: ['added_sugar'], calories: 140, protein: 0, carbs: 39, fats: 0 },
];

export default function FoodLogger() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

    const filteredFoods = MOCK_FOODS.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const impactScore = selectedFood ? calculateAHEI(selectedFood.quality_tags) : 0;
    const impactColor = getFoodImpactColor(impactScore);

    return (
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-full">
                    <Leaf className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <h3 className="text-white font-bold">Nutrition 2.0</h3>
                    <p className="text-xs text-gray-400">Quality over Calories</p>
                </div>
            </div>

            {/* SEARCH */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search food (e.g. Salmon, Burger)..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* RESULTS LIST */}
            <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto">
                {searchTerm && filteredFoods.map(food => (
                    <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${selectedFood?.id === food.id ? 'bg-white/10 border-[#D4AF37]/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                        <span className="text-sm text-gray-300">{food.name}</span>
                        <span className="text-xs text-gray-500">{food.calories} kcal</span>
                    </div>
                ))}
            </div>

            {/* IMPACT PREVIEW (The "Killer Feature") */}
            <AnimatePresence>
                {selectedFood && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="rounded-2xl p-4 border border-white/5 relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{ background: `linear-gradient(to right, ${impactColor}, transparent)` }}
                        />

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Impact Score Analysis</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-black" style={{ color: impactColor }}>
                                        {impactScore > 0 ? '+' : ''}{impactScore}
                                    </span>
                                    <span className="text-xs text-gray-400">pts</span>
                                </div>
                            </div>

                            {/* QUALITY TAGS */}
                            <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                                {selectedFood.quality_tags.map(tag => (
                                    <span key={tag} className="text-[9px] uppercase px-2 py-1 rounded-full bg-black/40 border border-white/10 text-gray-400">
                                        {tag.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <div className="text-xs text-gray-400">
                                {impactScore > 0 ? 'Excellent Choice' : 'Metabolic Tax High'}
                            </div>
                            <button
                                onClick={() => {
                                    import('@/lib/haptics').then(({ vibrate }) => vibrate('success'));
                                }}
                                className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Plus className="w-3 h-3" /> LOG MEAL
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
