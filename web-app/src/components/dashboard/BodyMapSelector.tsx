'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Dumbbell, Zap, Target, ArrowRight } from 'lucide-react';

const BODY_PARTS = [
    { id: 'chest', label: 'Pectoraux', x: 50, y: 25 },
    { id: 'abs', label: 'Abdominaux', x: 50, y: 45 },
    { id: 'arms', label: 'Bras', x: 20, y: 30 },
    { id: 'legs', label: 'Jambes', x: 50, y: 70 },
    { id: 'back', label: 'Dos', x: 80, y: 30 },
];

const WORKOUT_SUGGESTIONS = {
    chest: { name: 'Titan Chest Explosion', focus: 'Force & Volume', duration: '45 min', intensity: 'Haute' },
    abs: { name: 'Core Crusher 3000', focus: 'Définition', duration: '20 min', intensity: 'Moyenne' },
    arms: { name: 'Biceps/Triceps Supersets', focus: 'Hypertrophie', duration: '40 min', intensity: 'Haute' },
    legs: { name: 'Leg Day from Hell', focus: 'Force', duration: '60 min', intensity: 'Extrême' },
    back: { name: 'V-Taper Builder', focus: 'Largeur', duration: '50 min', intensity: 'Haute' },
};

export default function BodyMapSelector() {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    return (
        <Card className="border border-white/10 bg-black/40 backdrop-blur-2xl text-white overflow-hidden relative shadow-2xl group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-20 -mt-20 blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

            <CardHeader className="border-b border-white/5 bg-white/5 relative z-10">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                    <Activity className="h-8 w-8 text-blue-500" />
                    Neural<span className="text-blue-500">Scan</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 relative z-10 flex-1 flex">
                {/* Visual Body Svg */}
                <div className="w-1/2 relative flex items-center justify-center p-6 border-r border-white/5">
                    <div className="relative w-full h-full max-w-[200px] aspect-[1/2]">
                        {/* Schematic Body Placeholder - Replaced by CSS Points for robustness */}
                        <div className="absolute inset-0 bg-white/5 rounded-3xl animate-pulse" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }} />

                        {/* Interactive Points */}
                        {BODY_PARTS.map((part) => (
                            <motion.button
                                key={part.id}
                                onClick={() => setSelectedPart(part.id)}
                                className={`absolute w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${selectedPart === part.id
                                        ? 'bg-blue-500 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-125'
                                        : 'bg-black/50 border-white/30 hover:bg-blue-500/50 hover:border-blue-500'
                                    }`}
                                style={{ top: `${part.y}%`, left: `${part.x}%`, transform: 'translate(-50%, -50%)' }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedPart === part.id ? 'bg-white' : 'bg-transparent'}`} />
                            </motion.button>
                        ))}

                        {/* Scanner Effect */}
                        <motion.div
                            className="absolute left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_10px_#3b82f6] z-10"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Info Panel */}
                <div className="w-1/2 p-6 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {selectedPart ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Cible Détectée</h3>
                                    <h2 className="text-3xl font-black text-white italic uppercase">{BODY_PARTS.find(p => p.id === selectedPart)?.label}</h2>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="w-3 h-3 text-blue-500" />
                                            <span className="text-[10px] uppercase font-bold text-blue-500">Recommandation</span>
                                        </div>
                                        <p className="text-sm font-bold text-white leading-tight">
                                            {WORKOUT_SUGGESTIONS[selectedPart as keyof typeof WORKOUT_SUGGESTIONS].name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-black/40 p-2 rounded-lg text-center">
                                            <span className="block text-[9px] text-gray-500 uppercase font-black">Durée</span>
                                            <span className="block text-xs font-bold text-white">{WORKOUT_SUGGESTIONS[selectedPart as keyof typeof WORKOUT_SUGGESTIONS].duration}</span>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg text-center">
                                            <span className="block text-[9px] text-gray-500 uppercase font-black">Intensité</span>
                                            <span className="block text-xs font-bold text-white">{WORKOUT_SUGGESTIONS[selectedPart as keyof typeof WORKOUT_SUGGESTIONS].intensity}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-lg shadow-[0_0_15px_-5px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2">
                                    Lancer Session <ArrowRight className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-3 opacity-50"
                            >
                                <Dumbbell className="w-12 h-12 mx-auto text-white/20" />
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                                    Sélectionnez une zone<br />musculaire pour analyser
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
