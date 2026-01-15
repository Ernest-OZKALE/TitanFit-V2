'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Zap } from 'lucide-react';

interface Workout {
    id: string;
    title: string;
    duration: string;
    intensity: string;
    image: string;
    muscles: string[];
}

interface WorkoutCardProps {
    workout: Workout;
    onStart: () => void;
}

export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative h-64 rounded-[2rem] overflow-hidden bg-slate-900 cursor-pointer shadow-xl shadow-slate-900/10"
            onClick={onStart}
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60" style={{ backgroundImage: `url(${workout.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex flex-wrap gap-2 mb-3">
                    {workout.muscles.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                            {m}
                        </span>
                    ))}
                </div>

                <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none mb-4">
                    {workout.title}
                </h3>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {workout.duration}
                        </span>
                        <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {workout.intensity}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover Play Button */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-[#D4AF37]/30 transform translate-y-2 group-hover:translate-y-0">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
        </motion.div>
    );
}
