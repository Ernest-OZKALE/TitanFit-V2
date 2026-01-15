'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Calendar, Flame, ArrowLeft } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

export default function WorkoutLogPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchSessions();
    }, [user]);

    async function fetchSessions() {
        const { data, error } = await supabase
            .from('workout_sessions')
            .select(`*, workout_exercises (*)`)
            .eq('user_id', user?.id)
            .order('completed_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            setSessions(data);
        }
        setLoading(false);
    }

    const thisWeekCount = sessions.filter((s) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.completed_at) > weekAgo;
    }).length;

    const totalExercises = sessions.reduce((sum, s) => sum + (s.workout_exercises?.length || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                Workout <span className="text-[#D4AF37]">Log</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Historique Entraînements</p>
                        </div>
                    </div>
                    <Link href="/log-workout">
                        <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl px-6 shadow-[0_0_20px_-5px_#D4AF37]">
                            <Plus className="w-4 h-4 mr-2" /> New Session
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={Dumbbell} label="Total Sessions" value={sessions.length.toString()} color="#D4AF37" />
                    <StatCard icon={Calendar} label="Cette Semaine" value={thisWeekCount.toString()} color="#10b981" />
                    <StatCard icon={Flame} label="Total Exercices" value={totalExercises.toString()} color="#8b5cf6" />
                </div>

                {/* Sessions List */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-black text-white uppercase tracking-widest">Historique</h2>
                            <p className="text-xs text-gray-500">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Dumbbell className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Aucun entraînement</h3>
                            <p className="text-gray-500 mb-6">Commencez à tracker vos sessions</p>
                            <Link href="/log-workout">
                                <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" /> Nouvelle session
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{session.workout_name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {new Date(session.completed_at).toLocaleDateString('fr-FR')} à{' '}
                                                {new Date(session.completed_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                                            {session.workout_exercises?.length || 0} exos
                                        </span>
                                    </div>

                                    {session.notes && (
                                        <p className="text-sm text-gray-400 italic mb-3">{session.notes}</p>
                                    )}

                                    {session.workout_exercises && session.workout_exercises.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {session.workout_exercises.slice(0, 4).map((ex: any, idx: number) => (
                                                <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded">
                                                    {ex.exercise_name}
                                                </span>
                                            ))}
                                            {session.workout_exercises.length > 4 && (
                                                <span className="text-[10px] text-gray-500">+{session.workout_exercises.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-[1.5rem] bg-[#0F0F0F] border border-white/5"
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </motion.div>
    );
}
