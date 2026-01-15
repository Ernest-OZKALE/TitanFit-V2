'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Heart, Play } from 'lucide-react';
import Link from 'next/link';
import { RECIPE_DATABASE } from '@/lib/chef-ia-engine';
import { RecipeContent } from '@/components/nutrition/RecipeContent';
import { CookingMode } from '@/components/nutrition/CookingMode';
import { Button } from '@/components/ui/button';

export default function RecipeDetailPage() {
    const params = useParams();
    const [cookingMode, setCookingMode] = useState(false);

    // In real app, fetch by ID. Here we just find it.
    const recipe = RECIPE_DATABASE.find(r => r.id === params.recipeId) || RECIPE_DATABASE[0];

    return (
        <div className="min-h-screen bg-white pb-24">
            <AnimatePresence>
                {cookingMode && <CookingMode recipe={recipe} onClose={() => setCookingMode(false)} />}
            </AnimatePresence>

            {/* Hero Image Header */}
            <div className="relative h-[40vh] w-full">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />

                {/* Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                    <Link href="/nutrition/suggest">
                        <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg mb-4 inline-block">
                            Match 98%
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
                            {recipe.title}
                        </h1>
                        <p className="text-slate-600 font-medium line-clamp-2">
                            {recipe.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 relative z-10">
                <RecipeContent recipe={recipe} />
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none md:hidden">
                <Button
                    onClick={() => setCookingMode(true)}
                    className="w-full h-14 rounded-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-black text-lg shadow-gold pointer-events-auto flex items-center justify-center gap-2"
                >
                    <Play className="h-5 w-5 fill-current" /> Cuisiner
                </Button>
            </div>

            {/* Desktop FAB equiv */}
            <div className="fixed bottom-8 right-8 hidden md:block z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCookingMode(true)}
                    className="h-16 px-8 rounded-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-black text-lg shadow-gold flex items-center justify-center gap-3 transition-colors"
                >
                    <Play className="h-6 w-6 fill-current" /> Mode Cuisine
                </motion.button>
            </div>
        </div>
    );
}
