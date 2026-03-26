'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, ChevronRight, BarChart2, Dumbbell } from 'lucide-react';
import { startWorkout, logSet, calculate1RM } from '@/services/strength';

export default function LiveWorkout() {
    const [isActive, setIsActive] = useState(false);
    const [workoutId, setWorkoutId] = useState<string | null>(null);

    // Current Set State
    const [exercise, setExercise] = useState('Bench Press');
    const [weight, setWeight] = useState(60);
    const [reps, setReps] = useState(10);
    const [rpe, setRpe] = useState(8); // Velocity Proxy (10 = Slow/Fail, 7 = Fast)

    const current1RM = calculate1RM(weight, reps);

    const handleStart = async () => {
        setIsActive(true);
        // In real app, get User ID from context
        const session = await startWorkout('Push Day', 'mock-user-id');
        if (session && session.id) setWorkoutId(session.id);
    };

    const handleLogSet = async () => {
        if (!workoutId) return;

        await logSet({
            workout_id: workoutId,
            exercise_name: exercise,
            set_number: 1, // Logic needed for auto-increment
            weight_kg: weight,
            reps: reps,
            rpe: rpe
        });

        // Haptic Feedback Integration
        import('@/lib/haptics').then(({ vibrate }) => vibrate('success'));

        // Reset/Success Animation logic would go here
    };

    if (!isActive) {
        return (
            <button
                onClick={handleStart}
                className="w-full bg-[#D4AF37] text-black font-black uppercase py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg shadow-[#D4AF37]/20"
            >
                <Play className="w-5 h-5 fill-black" />
                Start Workout
            </button>
        );
    }

    return (
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-[#D4AF37]" /> Push Day
                    </h3>
                    <p className="text-xs text-green-400 font-mono flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> LIVE TRACING
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Est. 1RM</p>
                    <p className="text-xl font-black text-white">{current1RM} <span className="text-xs font-normal text-gray-400">kg</span></p>
                </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <label className="text-xs text-gray-400 uppercase block mb-2">Weight (kg)</label>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setWeight(w => w - 2.5)} className="w-8 h-8 rounded-full bg-white/10 text-white">-</button>
                        <span className="text-2xl font-bold text-white flex-1 text-center">{weight}</span>
                        <button onClick={() => setWeight(w => w + 2.5)} className="w-8 h-8 rounded-full bg-white/10 text-white">+</button>
                    </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <label className="text-xs text-gray-400 uppercase block mb-2">Reps</label>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setReps(r => r - 1)} className="w-8 h-8 rounded-full bg-white/10 text-white">-</button>
                        <span className="text-2xl font-bold text-white flex-1 text-center">{reps}</span>
                        <button onClick={() => setReps(r => r + 1)} className="w-8 h-8 rounded-full bg-white/10 text-white">+</button>
                    </div>
                </div>
            </div>

            {/* Velocity/RPE Slider (The "Pro" Feature) */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Velocity (RPE)</span>
                    <span className={rpe > 8 ? "text-red-400" : "text-green-400"}>
                        {rpe > 9 ? 'Grind (Failure)' : rpe < 7 ? 'Explosive' : 'Controlled'}
                    </span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={rpe}
                    onChange={(e) => setRpe(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-widest">
                    <span>Fast</span>
                    <span>Failure</span>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleLogSet}
                className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
            >
                <Check className="w-5 h-5" /> LOG SET
            </button>
        </div>
    );
}
