'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MUSCLE_DATA } from '@/lib/muscle-data'; // Only for muscle info
import { EXERCISE_DB, Equipment, Exercise } from '@/lib/exercise-db';

// Dynamic Imports for Bundle Splitting (Vercel Best Practice)
import dynamic from 'next/dynamic';
import { BodyGender, BodyMode, BodyView } from './bodymap/types';
import { User, Users, Shield, Zap, Dumbbell, Box, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Lazy load heavy SVG components
const BodyMapMale = dynamic(() => import('./bodymap/BodyMapMale'), {
    loading: () => <div className="text-center text-[#D4AF37] animate-pulse">Chargement Anatomie Titanium...</div>
});
const BodyMapFemale = dynamic(() => import('./bodymap/BodyMapFemale'), {
    loading: () => <div className="text-center text-[#D4AF37] animate-pulse">Chargement Anatomie Titanium...</div>
});

interface BodyMapProps {
    onMuscleSelect: (muscleId: string) => void;
    selectedMuscle: string | null;
}

export default function BodyMap({ onMuscleSelect, selectedMuscle }: BodyMapProps) {
    // --- VIEW STATE ---
    const [viewSide, setViewSide] = useState<BodyView>('front');
    const [gender, setGender] = useState<BodyGender>('male');
    const [mode, setMode] = useState<BodyMode>('advanced');
    const [zoomZone, setZoomZone] = useState<string | null>(null);

    // --- FILTER STATE (The Titan Atlas Brain) ---
    const [equipment, setEquipment] = useState<Equipment[]>(['bodyweight', 'dumbbell']); // Default accessible
    const [exerciseType, setExerciseType] = useState<'strength' | 'stretching'>('strength');

    // --- RESULTS STATE (Replacing basic MuscleDetail) ---
    // Instead of just showing the muscle, we show the FILTERED exercises for that muscle
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

    // ViewBox Logic
    const getViewBox = () => {
        if (!zoomZone) return "0 0 400 600";
        if (zoomZone === 'chest' || zoomZone === 'shoulders' || zoomZone === 'core') return "120 100 160 200";
        if (zoomZone === 'arms') return "80 120 240 200";
        if (zoomZone === 'legs') return "140 280 120 300";
        if (zoomZone === 'back') return "120 100 160 200";
        return "0 0 400 600";
    };

    // --- HANDLE SELECTION ---
    const handleSelect = (muscleId: string) => {
        onMuscleSelect(muscleId);

        // QUERY ENGINE
        const muscleInfo = MUSCLE_DATA[muscleId];
        if (!muscleInfo) return;

        // Find exercises that:
        // 1. Target this muscle (or its parent zone if simple mode?? No, let's keep it specific)
        // 2. Match Equipment (OR logic: if exercise needs Barbell, user must have Barbell)
        // 3. Match Category (Stretching vs Strength)

        const results = EXERCISE_DB.filter(ex => {
            const isMuscleMatch = ex.targetMuscles.includes(muscleId) || ex.secondaryMuscles?.includes(muscleId);
            const isTypeMatch = ex.category === exerciseType;
            // Equipment Match: Exercise needs X. User has [X, Y].
            // We assume exercise needs ONE of its listed items? 
            // Usually DB says "Requires: Barbell". 
            // Let's assume exercise.equipment is an array of ALLOWED tools or REQUIRED?
            // Simple logic: Exercise has 'dumbbell'. User has 'dumbbell'. Match.
            const hasEquipment = ex.equipment.some(req => equipment.includes(req));

            return isMuscleMatch && isTypeMatch && hasEquipment;
        });

        setFilteredExercises(results);
    };

    // Toggle Equipment Helper
    const toggleEquip = (eq: Equipment) => {
        if (equipment.includes(eq)) setEquipment(equipment.filter(e => e !== eq));
        else setEquipment([...equipment, eq]);
    };

    return (
        <div className="relative w-full h-full min-h-[600px] flex flex-col items-center">

            {/* === 1. TOP TOOLBAR (FILTERS) === */}
            <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-30 flex flex-wrap gap-4 justify-center items-center">

                {/* Gender */}
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button onClick={() => setGender('male')} className={cn("p-2 rounded hover:bg-white/10", gender === 'male' && "bg-[#D4AF37] text-black")}><User className="w-4 h-4" /></button>
                    <button onClick={() => setGender('female')} className={cn("p-2 rounded hover:bg-white/10", gender === 'female' && "bg-[#D4AF37] text-black")}><Users className="w-4 h-4" /></button>
                </div>

                {/* Type Switch (MuscleWiki Style) */}
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button onClick={() => setExerciseType('strength')} className={cn("px-3 py-1 text-xs font-bold uppercase rounded transition-all", exerciseType === 'strength' ? "bg-white text-black" : "text-gray-400")}>Musculation</button>
                    <button onClick={() => setExerciseType('stretching')} className={cn("px-3 py-1 text-xs font-bold uppercase rounded transition-all", exerciseType === 'stretching' ? "bg-white text-black" : "text-gray-400")}>Étirements</button>
                </div>

                {/* Equipment (Collapsible or Horizontal Scroll) */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
                    {[
                        { id: 'bodyweight', icon: User, label: 'Corps' },
                        { id: 'dumbbell', icon: Dumbbell, label: 'Haltères' },
                        { id: 'barbell', icon: Box, label: 'Barre' }, // Box icon as placeholder for Barbell
                        { id: 'cable', icon: Zap, label: 'Poulies' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleEquip(item.id as Equipment)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase whitespace-nowrap transition-all",
                                equipment.includes(item.id as Equipment)
                                    ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                                    : "bg-transparent border-gray-700 text-gray-500 hover:border-gray-500"
                            )}
                        >
                            <item.icon className="w-3 h-3" /> {item.label}
                        </button>
                    ))}
                </div>

            </div>


            {/* === 2. MAIN ATLAS AREA === */}
            <div className="flex-1 w-full relative flex items-center justify-center py-8">

                {/* Body Map SVG */}
                <motion.svg
                    initial={false}
                    animate={{ viewBox: getViewBox() }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-[60vh] drop-shadow-2xl"
                >
                    {gender === 'male' ? (
                        <BodyMapMale
                            onMuscleSelect={handleSelect}
                            selectedMuscle={selectedMuscle}
                            view={viewSide}
                            mode={mode}
                            zoomZone={zoomZone}
                            setZoomZone={setZoomZone}
                        />
                    ) : (
                        <BodyMapFemale
                            onMuscleSelect={handleSelect}
                            selectedMuscle={selectedMuscle}
                            view={viewSide}
                            mode={mode}
                            zoomZone={zoomZone}
                            setZoomZone={setZoomZone}
                        />
                    )}
                </motion.svg>

                {/* View Side Toggles (Floating) */}
                <div className="absolute top-10 right-10 flex flex-col gap-2">
                    <button onClick={() => setViewSide('front')} className={cn("w-12 h-12 rounded-full border flex items-center justify-center font-bold text-[10px]", viewSide === 'front' ? "bg-white text-black border-white" : "border-gray-700 text-gray-700")}>AVANT</button>
                    <button onClick={() => setViewSide('back')} className={cn("w-12 h-12 rounded-full border flex items-center justify-center font-bold text-[10px]", viewSide === 'back' ? "bg-white text-black border-white" : "border-gray-700 text-gray-700")}>ARRIÈRE</button>
                    {zoomZone && <Button size="sm" variant="destructive" onClick={() => setZoomZone(null)} className="mt-4 text-[10px]">RESET ZOOM</Button>}
                </div>

            </div>


            {/* === 3. RESULTS PANEL (Replaces MuscleDetail) === */}
            <AnimatePresence>
                {selectedMuscle && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#050505] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#D4AF37]">
                            <div className="text-black">
                                <h2 className="text-2xl font-black uppercase leading-none">{MUSCLE_DATA[selectedMuscle]?.name}</h2>
                                <p className="text-xs font-mono opacity-75">{MUSCLE_DATA[selectedMuscle]?.latinName}</p>
                            </div>
                            <button onClick={() => onMuscleSelect('')} className="bg-black/20 p-2 rounded-full hover:bg-black/40 text-black transition-colors"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Filter Summary */}
                        <div className="p-4 bg-white/5 border-b border-white/5 flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-white border-white/20 capitalize">{exerciseType === 'strength' ? 'Musculation' : 'Étirements'}</Badge>
                            {equipment.map(e => <Badge key={e} variant="secondary" className="bg-[#D4AF37]/20 text-[#D4AF37] capitalize">{e}</Badge>)}
                        </div>

                        {/* Results List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {filteredExercises.length > 0 ? (
                                filteredExercises.map((ex, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden border border-white/10 group-hover:border-[#D4AF37] transition-all relative">
                                            {/* Video Placeholder */}
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-grid-small-white/[0.2]">
                                                <span className="text-xs uppercase font-bold tracking-widest">Aperçu Vidéo</span>
                                            </div>
                                            <Badge className="absolute top-2 left-2 bg-black text-white text-[10px]">{ex.difficulty}</Badge>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{ex.name}</h3>
                                        <div className="text-sm text-gray-500 line-clamp-2">
                                            {ex.instructions[0]}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Search className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                    <p className="text-gray-500">Aucun exercice trouvé avec ces filtres.</p>
                                    <Button variant="link" onClick={() => setEquipment(['bodyweight', 'dumbbell', 'barbell', 'machine', 'cable'])} className="text-[#D4AF37]">Tout cocher</Button>
                                </div>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
