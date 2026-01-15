'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Dumbbell, Zap, Target, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Muscle Groups Configuration
const MUSCLE_GROUPS = {
    front: [
        { id: 'chest', label: 'Pectoraux', x: 50, y: 28, size: 20 },
        { id: 'abs', label: 'Abdominaux', x: 50, y: 45, size: 15 },
        { id: 'biceps', label: 'Biceps', x: 28, y: 32, size: 12 },
        { id: 'biceps_r', label: 'Biceps', x: 72, y: 32, size: 12 },
        { id: 'quads', label: 'Quadriceps', x: 50, y: 65, size: 25 },
        { id: 'shoulders', label: 'Épaules', x: 50, y: 22, size: 30 },
    ],
    back: [
        { id: 'back_upper', label: 'Dos (Haut)', x: 50, y: 30, size: 25 },
        { id: 'back_lower', label: 'Lombaires', x: 50, y: 48, size: 15 },
        { id: 'triceps', label: 'Triceps', x: 25, y: 32, size: 10 },
        { id: 'triceps_r', label: 'Triceps', x: 75, y: 32, size: 10 },
        { id: 'glutes', label: 'Fessiers', x: 50, y: 58, size: 20 },
        { id: 'hamstrings', label: 'Ischios', x: 50, y: 75, size: 20 },
    ]
};

const WORKOUT_SUGGESTIONS: Record<string, { name: string; focus: string; duration: string; intensity: string }> = {
    chest: { name: 'Titan Chest Press', focus: 'Volume & Force', duration: '45 min', intensity: 'Haute' },
    abs: { name: 'Core Sculpt 360', focus: 'Définition', duration: '20 min', intensity: 'Moyenne' },
    biceps: { name: 'Arm Blaster', focus: 'Hypertrophie', duration: '40 min', intensity: 'Haute' },
    biceps_r: { name: 'Arm Blaster', focus: 'Hypertrophie', duration: '40 min', intensity: 'Haute' },
    quads: { name: 'Leg Day Supreme', focus: 'Force Explosive', duration: '60 min', intensity: 'Extrême' },
    shoulders: { name: 'Boulder Shoulders', focus: 'Largeur', duration: '50 min', intensity: 'Haute' },
    back_upper: { name: 'V-Taper Row', focus: 'Épaisseur', duration: '50 min', intensity: 'Haute' },
    back_lower: { name: 'Lumbar Strength', focus: 'Stabilité', duration: '30 min', intensity: 'Moyenne' },
    triceps: { name: 'Triceps Extension', focus: 'Isolation', duration: '35 min', intensity: 'Haute' },
    triceps_r: { name: 'Triceps Extension', focus: 'Isolation', duration: '35 min', intensity: 'Haute' },
    glutes: { name: 'Glute Activation', focus: 'Puissance', duration: '45 min', intensity: 'Haute' },
    hamstrings: { name: 'Hamstring Curls', focus: 'Isolation', duration: '40 min', intensity: 'Moyenne' },
};

export default function BodyMapSelector() {
    const [view, setView] = useState<'front' | 'back'>('front');
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    // Simple SVG Paths (Approximation for visuals)
    const BodySilhouette = ({ isBack }: { isBack: boolean }) => (
        <svg viewBox="0 0 100 200" className="w-full h-full opacity-80 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#333" />
                    <stop offset="100%" stopColor="#111" />
                </linearGradient>
            </defs>
            {/* Head */}
            <circle cx="50" cy="12" r="8" fill="url(#bodyGradient)" />
            {/* Body */}
            {isBack ? (
                <path d="M42 20 L58 20 L65 24 L75 28 L72 50 L75 55 L70 80 L60 85 L62 130 L58 180 L52 180 L50 130 L48 180 L42 180 L38 130 L40 85 L30 80 L25 55 L28 50 L25 28 L35 24 Z" fill="url(#bodyGradient)" />
            ) : (
                <path d="M42 20 L58 20 L65 24 L75 28 L72 50 L75 55 L70 80 L60 85 L62 130 L58 180 L52 180 L50 130 L48 180 L42 180 L38 130 L40 85 L30 80 L25 55 L28 50 L25 28 L35 24 Z" fill="url(#bodyGradient)" />
            )}
        </svg>
    );

    return (
        <Card className="border border-white/5 bg-[#0F0F0F] rounded-[2.5rem] overflow-hidden relative shadow-2xl group h-full flex flex-col hover:border-[#D4AF37]/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none transition-colors" />

            <CardHeader className="border-b border-white/5 relative z-10 flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-widest text-white">
                    <Activity className="h-5 w-5 text-[#D4AF37]" />
                    <span className="italic">Body<span className="text-[#D4AF37]">Map</span></span>
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView(view === 'front' ? 'back' : 'front')}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 rounded-full px-3"
                >
                    <RotateCcw className="w-3 h-3 mr-1.5" />
                    {view === 'front' ? 'Face' : 'Dos'}
                </Button>
            </CardHeader>

            <CardContent className="p-0 relative z-10 flex-1 flex">
                {/* Visual Body Area */}
                <div className="w-1/2 relative flex items-center justify-center p-6 border-r border-white/5 bg-gradient-to-b from-[#151515] to-[#0A0A0A]">
                    <div className="relative w-full h-full max-w-[140px] aspect-[1/2]">
                        {/* Body Silhouette */}
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                        >
                            <BodySilhouette isBack={view === 'back'} />
                        </motion.div>

                        {/* Interactive Points */}
                        <AnimatePresence mode="wait">
                            {MUSCLE_GROUPS[view].map((part) => (
                                <motion.button
                                    key={part.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={() => setSelectedPart(part.id)}
                                    className={cn(
                                        "absolute rounded-full border flex items-center justify-center z-20 transition-all duration-300",
                                        selectedPart === part.id
                                            ? "bg-[#D4AF37] border-white shadow-[0_0_20px_#D4AF37]"
                                            : "bg-[#D4AF37]/20 border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:border-white"
                                    )}
                                    style={{
                                        top: `${part.y}%`,
                                        left: `${part.x}%`,
                                        width: `${part.size}px`,
                                        height: `${part.size}px`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <div className={cn(
                                        "rounded-full transition-colors",
                                        selectedPart === part.id ? "bg-white w-1.5 h-1.5" : "bg-transparent w-full h-full"
                                    )} />
                                </motion.button>
                            ))}
                        </AnimatePresence>

                        {/* Scanner Beam */}
                        <motion.div
                            className="absolute left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] z-10 pointer-events-none opacity-50"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Info & Action Panel */}
                <div className="w-1/2 p-6 flex flex-col justify-center bg-[#0F0F0F]">
                    <AnimatePresence mode="wait">
                        {selectedPart ? (
                            <motion.div
                                key={selectedPart}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                <div>
                                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Cible Musculaire</h3>
                                    <h2 className="text-2xl font-black text-white italic uppercase leading-none">
                                        {view === 'front'
                                            ? MUSCLE_GROUPS.front.find(p => p.id === selectedPart)?.label
                                            : MUSCLE_GROUPS.back.find(p => p.id === selectedPart)?.label}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-3 h-3 text-[#D4AF37]" />
                                            <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Recommandation</span>
                                        </div>
                                        <p className="text-sm font-bold text-white leading-tight">
                                            {WORKOUT_SUGGESTIONS[selectedPart]?.name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-[#151515] p-2.5 rounded-lg text-center border border-white/5">
                                            <span className="block text-[9px] text-gray-500 uppercase font-black mb-0.5">Durée</span>
                                            <span className="block text-xs font-bold text-white">{WORKOUT_SUGGESTIONS[selectedPart]?.duration}</span>
                                        </div>
                                        <div className="bg-[#151515] p-2.5 rounded-lg text-center border border-white/5">
                                            <span className="block text-[9px] text-gray-500 uppercase font-black mb-0.5">Intensité</span>
                                            <span className="block text-xs font-bold text-[#D4AF37]">{WORKOUT_SUGGESTIONS[selectedPart]?.intensity}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full h-10 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest text-[10px] rounded-lg shadow-[0_0_20px_-5px_#D4AF37] transition-all flex items-center justify-center gap-2">
                                    Lancer Session <ArrowRight className="w-3 h-3" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-4 opacity-30 select-none cursor-default"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                    <Activity className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white px-4">
                                    Sélectionnez un muscle pour analyser le protocole
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
