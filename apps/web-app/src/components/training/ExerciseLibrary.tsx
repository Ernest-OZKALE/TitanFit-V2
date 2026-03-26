'use client';

import { useState } from 'react';
import { Search, Filter, Dumbbell, Zap } from 'lucide-react';
import { EXERCISE_DB, MuscleGroup, MUSCLE_GROUPS, Equipment, EQUIPMENT_TYPES, ExerciseDef } from '@/lib/exercise-db';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseDetailOverlay } from './ExerciseDetailOverlay';

interface ExerciseLibraryProps {
    onSelect?: (exerciseId: string) => void;
    selectionMode?: boolean;
}

export function ExerciseLibrary({ onSelect, selectionMode = false }: ExerciseLibraryProps) {
    const [search, setSearch] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'All'>('All');

    // DETAIL MODAL STATE
    const [viewingExercise, setViewingExercise] = useState<ExerciseDef | null>(null);

    const filtered = EXERCISE_DB.filter(ex => {
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || ex.subTarget.toLowerCase().includes(search.toLowerCase());
        const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
        const matchEquip = selectedEquipment === 'All' || ex.equipment === selectedEquipment;

        // Special Case: "Sans Matériel" in UI maps to 'Aucun' or 'Poids du corps'
        // For now direct mapping is fine.

        return matchSearch && matchMuscle && matchEquip;
    });

    const handleCardClick = (ex: ExerciseDef) => {
        // If selection mode (Builder), we might just select it directly OR open modal to confirm.
        // User asked for "Click does nothing" fix -> So Open Modal is best default.
        // If selectionMode, standard might be click to add, but let's open modal to give details first,
        // then "Add" from modal.

        if (selectionMode && onSelect) {
            // Option A: Direct Select
            // onSelect(ex.id);
            // Option B: View then Select (Better for "Knowing what part it works")
            setViewingExercise(ex);
        } else {
            // Browse Mode
            setViewingExercise(ex);
        }
    };

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTERS CONTAINER */}
            <div className="space-y-4">
                {/* 1. Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher (ex: Pectoraux, Ischios...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-slate-200 focus:border-[#D4AF37] outline-none font-medium"
                    />
                </div>

                {/* 2. Muscle Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <FilterButton
                        active={selectedMuscle === 'All'}
                        label="Tout (Muscles)"
                        onClick={() => setSelectedMuscle('All')}
                    />
                    {MUSCLE_GROUPS.map(m => (
                        <FilterButton
                            key={m}
                            active={selectedMuscle === m}
                            label={m}
                            onClick={() => setSelectedMuscle(m)}
                        />
                    ))}
                </div>

                {/* 3. Equipment Filters (NEW) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-t border-dashed border-slate-100 pt-4">
                    <FilterButton
                        active={selectedEquipment === 'All'}
                        label="Tout (Matériel)"
                        onClick={() => setSelectedEquipment('All')}
                        secondary
                    />
                    {EQUIPMENT_TYPES.map(e => (
                        <FilterButton
                            key={e}
                            active={selectedEquipment === e}
                            label={e === 'Aucun' ? 'Sans Matériel' : e}
                            onClick={() => setSelectedEquipment(e)}
                            secondary
                        />
                    ))}
                </div>
            </div>

            {/* RESULTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[500px] overflow-y-auto custom-scrollbar pr-2 content-start">
                <AnimatePresence>
                    {filtered.map(ex => (
                        <motion.div
                            key={ex.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            onClick={() => handleCardClick(ex)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-[120px] ${selectionMode
                                ? 'bg-white hover:border-[#D4AF37] hover:shadow-md'
                                : 'bg-white hover:shadow-lg hover:border-slate-200 border-slate-100'
                                }`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${ex.difficulty === 'Avancé' ? 'bg-red-50 text-red-600' :
                                        ex.difficulty === 'Intermédiaire' ? 'bg-orange-50 text-orange-600' :
                                            'bg-green-50 text-green-600'
                                        }`}>
                                        {ex.difficulty}
                                    </span>
                                    <Dumbbell className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#D4AF37]" />
                                </div>
                                <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">{ex.name}</h4>
                            </div>

                            <div className="mt-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wide mb-0.5">
                                    <Zap className="w-3 h-3" /> {ex.subTarget}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                    {ex.equipment}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center flex flex-col items-center justify-center opacity-50">
                        <Dumbbell className="w-12 h-12 text-slate-300 mb-2" />
                        <span className="text-sm font-bold text-slate-400">Aucun exercice trouvé.</span>
                        <span className="text-xs text-slate-300">Essayez de changer les filtres.</span>
                    </div>
                )}
            </div>

            {/* DETAIL OVERLAY */}
            <ExerciseDetailOverlay
                exercise={viewingExercise}
                onClose={() => setViewingExercise(null)}
                onAddToProgram={selectionMode && onSelect ? (ex) => onSelect(ex.id) : undefined}
            />
        </div>
    );
}

function FilterButton({ active, label, onClick, secondary = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap flex-shrink-0 transition-colors border ${active
                ? (secondary ? 'bg-slate-700 border-slate-700 text-white' : 'bg-[#D4AF37] border-[#D4AF37] text-slate-900')
                : 'bg-transparent border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
        >
            {label}
        </button>
    );
}
