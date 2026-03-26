'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Coffee, Sunrise, Sunset } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function FocusHeader() {
    const { user } = useAuth();
    const [timeData, setTimeData] = useState({
        greeting: 'Chargement...',
        icon: Sun,
        status: 'Synchronisation...'
    });

    // Username logic: MetaData -> Email -> "Athlète"
    const username = user?.user_metadata?.username || user?.email?.split('@')[0] || "Athlète";

    useEffect(() => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 10) {
            setTimeData({
                greeting: 'Bonjour',
                icon: Sunrise,
                status: 'Réveil Cortisol • Activation'
            });
        } else if (hour >= 10 && hour < 14) {
            setTimeData({
                greeting: 'Bonne Séance',
                icon: Sun,
                status: 'Pic de Performance'
            });
        } else if (hour >= 14 && hour < 18) {
            setTimeData({
                greeting: 'Bon Après-midi',
                icon: Coffee,
                status: 'Hydratation & Focus'
            });
        } else if (hour >= 18 && hour < 22) {
            setTimeData({
                greeting: 'Bonsoir',
                icon: Sunset,
                status: 'Récupération Active'
            });
        } else {
            setTimeData({
                greeting: 'Bonne Nuit',
                icon: Moon,
                status: 'Sommeil Profond Requis'
            });
        }
    }, []);

    const Icon = timeData.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-12"
        >
            <div className="mb-4 p-4 rounded-full bg-slate-50 border border-slate-100 text-[#D4AF37] shadow-lg shadow-black/5">
                <Icon className="w-8 h-8" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-2">
                {timeData.greeting}
            </h1>

            <p className="text-xl text-slate-500 font-medium">
                Prêt à dominer, <span className="text-[#D4AF37] font-bold capitalize">{username}</span> ?
            </p>

            <div className="mt-6 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {timeData.status}
            </div>
        </motion.div>
    );
}
