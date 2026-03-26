'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Zap, Utensils, Dumbbell } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types d'état pour les tâches
type TaskStatus = 'locked' | 'pending' | 'completed';

interface DailyTask {
    id: string;
    time: string;
    title: string;
    type: 'recovery' | 'nutrition' | 'training';
    icon: any;
    link: string | null;
}

const baseTimeline: DailyTask[] = [
    { id: 'checkin', time: '08:00', title: 'Check-In Matinal', type: 'recovery', icon: Zap, link: null },
    { id: 'nutrition', time: '13:00', title: 'Journal Nutrition', type: 'nutrition', icon: Utensils, link: '/dashboard/nutrition' },
    { id: 'workout', time: '18:00', title: 'Séance du Jour', type: 'training', icon: Dumbbell, link: '/dashboard/training' },
];

export function DailyStack() {
    const router = useRouter();
    const [statuses, setStatuses] = useState<Record<string, TaskStatus>>({
        checkin: 'pending',
        nutrition: 'pending',
        workout: 'pending'
    });

    // Vérification de l'état "Vrai" au chargement
    useEffect(() => {
        const checkStatus = () => {
            const today = new Date().toISOString().split('T')[0];

            // 1. Check-In
            const lastCheckIn = localStorage.getItem('titan_last_checkin');
            const isCheckInDone = lastCheckIn === today;

            // 2. Nutrition (Si au moins 1 log existe aujourd'hui)
            const nutLogs = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');
            const isNutDone = nutLogs.some((log: any) => log.date === today);

            // 3. Workout (Si une session est marquée finie)
            const lastWorkout = localStorage.getItem('titan_last_workout');
            const isWorkoutDone = lastWorkout === today;

            setStatuses({
                checkin: isCheckInDone ? 'completed' : 'pending',
                nutrition: isNutDone ? 'completed' : 'pending',
                workout: isWorkoutDone ? 'completed' : 'pending'
            });
        };

        checkStatus();
        // Optionnel: écouter les changements de storage ou focus pour auto-update
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, []);

    return (
        <div className="max-w-xl mx-auto space-y-8 relative pl-4">
            {/* Ligne Verticale Connectrice */}
            <div className="absolute left-[34px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent z-0" />

            {baseTimeline.map((item, index) => {
                const status = statuses[item.id];
                const isCompleted = status === 'completed';

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="relative z-10 group cursor-pointer"
                        onClick={() => item.link && status !== 'completed' && router.push(item.link)}
                    >
                        {/* Indicateur Latéral (Heure) */}
                        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 text-[10px] font-bold text-slate-400 text-right opacity-50">
                            {item.time}
                        </div>

                        {/* Noeud (Dot) */}
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 transition-colors duration-500 ${isCompleted
                                ? 'bg-[#D4AF37] border-white shadow-lg'
                                : 'bg-white border-slate-200 group-hover:border-[#D4AF37]'
                            }`} />

                        {/* Carte Interactive */}
                        <div className={`ml-10 p-5 rounded-2xl border transition-all duration-300 ${isCompleted
                                ? 'bg-white/50 border-slate-100 opacity-70 grayscale-[0.5]'
                                : 'bg-white border-slate-200 shadow-xl shadow-slate-900/5 scale-105 hover:scale-[1.07] hover:border-[#D4AF37]/50'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-colors ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-[#D4AF37] text-white'
                                        }`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                                            {isCompleted ? 'Mission Accomplie' : 'En Attente'}
                                        </p>
                                    </div>
                                </div>

                                {status !== 'completed' && (
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#D4AF37] group-hover:bg-white transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                                {isCompleted && (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
