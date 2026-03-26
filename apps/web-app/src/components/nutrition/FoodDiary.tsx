'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, BoxSelect } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FoodLog {
    id: string;
    name: string;
    cals: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    type: string;
    timestamp: string;
    details?: any[];
}

export function FoodDiary() {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadLogs = () => {
        const stored = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const todaysLogs = stored.filter((l: any) => l.date === today);
        setLogs(todaysLogs);
    };

    useEffect(() => {
        loadLogs();
        window.addEventListener('storage', loadLogs);
        return () => window.removeEventListener('storage', loadLogs);
    }, []);

    const deleteLog = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const stored = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');
        const updated = stored.filter((l: any) => l.id !== id);
        localStorage.setItem('titan_nutrition_logs', JSON.stringify(updated));
        loadLogs();
        window.dispatchEvent(new Event('storage'));
    };

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 opacity-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <BoxSelect className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Aucune donnée aujourd'hui</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Journal Aujourd'hui</h3>
                <span className="text-xs font-bold text-slate-400">{logs.length} entrées</span>
            </div>

            <div className="space-y-3">
                {logs.map((log) => (
                    <motion.div
                        key={log.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${expandedId === log.id ? 'border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/20' : 'border-slate-100 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${expandedId === log.id ? 'bg-[#D4AF37] text-white' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                    }`}>
                                    {log.type.slice(0, 3)}
                                </div>
                                <div className="min-w-0 pr-2">
                                    <h4 className="font-bold text-slate-900 capitalize leading-relaxed text-sm md:text-base break-words">{log.name}</h4>
                                    <div className="text-xs text-slate-400 font-medium flex flex-wrap items-center gap-2 mt-1">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold flex-shrink-0">{log.cals} kcal</span>
                                        <span className="flex-shrink-0">•</span>
                                        <span className="flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {(log.protein || log.fat || log.carbs) ? (
                                            <>
                                                <span className="flex-shrink-0">•</span>
                                                <span className="text-slate-900 font-bold flex-shrink-0">
                                                    {log.protein}P {log.carbs}G {log.fat}L
                                                </span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => deleteLog(e, log.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* DETAILED BREAKDOWN */}
                        <AnimatePresence>
                            {expandedId === log.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50"
                                >
                                    <div className="pt-3 space-y-2">
                                        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Détails de l'analyse</h5>
                                        {log.details && log.details.length > 0 ? (
                                            log.details.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm py-1">
                                                    <div className="flex items-start gap-2 max-w-[70%]">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                                                        <span className="font-medium text-slate-700 leading-tight">
                                                            <span className="font-bold text-slate-900">{item.quantity}</span> {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="text-slate-500 text-xs font-mono whitespace-nowrap ml-2 text-right">
                                                        {item.calories} kcal
                                                        <div className="text-[10px] opacity-70">
                                                            {item.protein || 0}P/{item.carbs || 0}G/{item.fat || 0}L
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-slate-400 italic py-2">
                                                Aucun détail d'ingrédient disponible pour cette entrée.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
