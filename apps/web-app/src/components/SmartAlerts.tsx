'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartAlert {
    id: string;
    type: 'meal' | 'workout' | 'water' | 'motivation';
    message: string;
    time: string;
    dismissed: boolean;
}

export default function SmartAlerts() {
    const [alerts, setAlerts] = useState<SmartAlert[]>([]);
    const [enabled, setEnabled] = useState(true);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    useEffect(() => {
        // Load persistency
        const savedDismissed = localStorage.getItem('titan_dismissed_alerts');
        if (savedDismissed) {
            setDismissedIds(JSON.parse(savedDismissed));
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        // Check user activity and generate smart alerts
        const checkAlerts = () => {
            const now = new Date();
            const hour = now.getHours();
            const newAlerts: SmartAlert[] = [];

            // Welcome Alert (Always present if not dismissed)
            if (!dismissedIds.includes('welcome-titan')) {
                newAlerts.push({
                    id: 'welcome-titan',
                    type: 'motivation',
                    message: `⚡ Protocole Titan activé. Prêt à dominer ?`,
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Hydration Logic (Mocked but cleaner)
            const hydrationId = `water-${hour}`;
            if (hour % 3 === 0 && !dismissedIds.includes(hydrationId)) {
                newAlerts.push({
                    id: hydrationId,
                    type: 'water',
                    message: '💧 Niveau d\'hydratation bas. Recharger.',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Meal Logic
            const mealId = `meal-${hour}`;
            if ((hour === 12 || hour === 19) && !dismissedIds.includes(mealId)) {
                newAlerts.push({
                    id: mealId,
                    type: 'meal',
                    message: '🍽️ Fenêtre anabolique ouverte. Logger le repas.',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Deduplicate logic
            setAlerts(prev => {
                const combined = [...prev, ...newAlerts];
                // Keep only unique IDs
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                return unique.filter(a => !dismissedIds.includes(a.id));
            });
        };

        const interval = setInterval(checkAlerts, 10000); // Check more frequently for demo
        checkAlerts(); // Initial check

        return () => clearInterval(interval);
    }, [enabled, dismissedIds]);

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            await Notification.requestPermission();
        }
    };

    const dismissAlert = (id: string) => {
        const newDismissed = [...dismissedIds, id];
        setDismissedIds(newDismissed);
        localStorage.setItem('titan_dismissed_alerts', JSON.stringify(newDismissed));
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const activeAlerts = alerts.filter(a => !a.dismissed);

    return (
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg overflow-hidden relative group">
            <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <CardTitle className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-tighter">
                            <Bell className="h-5 w-5 text-[#D4AF37]" />
                            Titan Insight
                        </CardTitle>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">Assistant Proactif Intelligent</p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className={`${enabled ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-slate-400 bg-slate-100'} border border-slate-200 hover:bg-slate-50 transition-all`}
                        onClick={() => setEnabled(!enabled)}
                    >
                        {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {!('Notification' in window) ? (
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">Système non supporté</p>
                ) : Notification.permission !== 'granted' ? (
                    <Button onClick={requestNotificationPermission} className="w-full bg-[#D4AF37] text-white font-black uppercase tracking-wider h-12 rounded-xl hover:bg-[#b8952b] shadow-md">
                        Autoriser les Notifications
                    </Button>
                ) : null}

                {activeAlerts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                            <Bell className="h-6 w-6 opacity-30 text-slate-900" />
                        </div>
                        <p className="text-sm font-medium opacity-70">
                            Le système veille.<br />
                            <span className="text-xs opacity-50">Aucune action requise pour le moment.</span>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeAlerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start justify-between group/alert hover:border-[#D4AF37]/50 hover:shadow-md transition-all"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 text-sm tracking-tight">{alert.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                        {new Date(alert.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-full"
                                    onClick={() => dismissAlert(alert.id)}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


