'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Dumbbell, Utensils, User, LogOut, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GlobalCommandProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalCommand({ isOpen, onClose }: GlobalCommandProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');

    // Keyboard Shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose(); // Toggle mechanism handled by parent usually, but here we assume opening via prop
                // Actually need a way to OPEN it via key from parent. 
                // For now, this is just a dummy listener logic placeholder.
            }
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [onClose]);

    const navigate = (path: string) => {
        router.push(path);
        onClose();
    };

    const actions = [
        { id: 'train', label: 'Démarrer Entraînement', icon: Dumbbell, action: () => navigate('/dashboard/training') },
        { id: 'fuel', label: 'Ajouter Repas', icon: Utensils, action: () => navigate('/dashboard/nutrition') },
        { id: 'profile', label: 'Modifier Profil', icon: User, action: () => navigate('/dashboard/profile') },
    ];

    const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10">
                            <Search className="w-5 h-5 text-slate-500" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tapez une commande..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-600 h-full"
                                autoFocus
                            />
                            <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-slate-400">ESC</div>
                        </div>

                        <div className="p-2">
                            <h3 className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Suggestions</h3>
                            {filteredActions.map((action, i) => (
                                <button
                                    key={action.id}
                                    onClick={action.action}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <action.icon className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37]" />
                                        <span className="font-medium text-sm">{action.label}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                            {filteredActions.length === 0 && (
                                <div className="px-4 py-8 text-center text-slate-600 text-sm">Aucune commande trouvée.</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
