'use client';

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { Recipe } from '@/types/nutrition';
import { Card } from '@/components/ui/card';
import { Flame, Clock, ChefHat, Check, X } from 'lucide-react';

interface SwipeableCardProps {
    recipe: Recipe;
    onSwipe: (direction: 'left' | 'right') => void;
    active: boolean;
}

export function SwipeableCard({ recipe, onSwipe, active }: SwipeableCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Transform logic for rotation an opacity indicators
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacityLike = useTransform(x, [50, 150], [0, 1]);
    const opacityNope = useTransform(x, [-50, -150], [0, 1]);
    const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe('left');
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
    };

    if (!active) return null;

    return (
        <motion.div
            style={{ x, rotate, scale, position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileTap={{ cursor: 'grabbing' }}
            className="cursor-grab touch-none"
        >
            <Card className="h-full w-full overflow-hidden border-0 shadow-2xl relative rounded-3xl bg-white select-none">
                {/* Image Full Height */}
                <div className="absolute inset-0 z-0">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" draggable={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                </div>

                {/* Overlays Indicators */}
                <motion.div style={{ opacity: opacityLike }} className="absolute top-8 left-8 z-20 border-4 border-emerald-400 text-emerald-400 rounded-lg px-4 py-2 transform -rotate-12 font-black text-4xl uppercase tracking-widest bg-black/20 backdrop-blur-sm">
                    MIAM
                </motion.div>
                <motion.div style={{ opacity: opacityNope }} className="absolute top-8 right-8 z-20 border-4 border-rose-500 text-rose-500 rounded-lg px-4 py-2 transform rotate-12 font-black text-4xl uppercase tracking-widest bg-black/20 backdrop-blur-sm">
                    BOF
                </motion.div>

                {/* Content Content Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        {recipe.matchScore && recipe.matchScore > 80 && (
                            <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-gold">
                                <Flame className="h-3 w-3" /> Top Match {recipe.matchScore}%
                            </span>
                        )}
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {recipe.prepTime + recipe.cookTime} min
                        </span>
                    </div>

                    <h2 className="text-3xl font-black mb-2 leading-tight shadow-sm stroke-black">{recipe.title}</h2>
                    <p className="text-gray-200 line-clamp-2 mb-4 text-sm font-medium">{recipe.description}</p>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-4 gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-center">
                            <span className="block text-xs text-gray-300">Cal</span>
                            <span className="block font-bold text-lg">{recipe.macros.calories}</span>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <span className="block text-xs text-emerald-300">Prot</span>
                            <span className="block font-bold text-lg">{recipe.macros.protein}g</span>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <span className="block text-xs text-amber-300">Carb</span>
                            <span className="block font-bold text-lg">{recipe.macros.carbs}g</span>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <span className="block text-xs text-rose-300">Fat</span>
                            <span className="block font-bold text-lg">{recipe.macros.fats}g</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// Helper specific to formatting
