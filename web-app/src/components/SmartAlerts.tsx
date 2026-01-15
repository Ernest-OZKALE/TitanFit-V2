'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check } from 'lucide-react';

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

    useEffect(() => {
        if (!enabled) return;

        // Check user activity and generate smart alerts
        const checkAlerts = () => {
            const now = new Date();
            const hour = now.getHours();
            const newAlerts: SmartAlert[] = [];

            // Meal reminders
            if (hour === 12 && !hasLoggedToday('lunch')) {
                newAlerts.push({
                    id: `meal-${Date.now()}`,
                    type: 'meal',
                    message: '🍽️ N\'oublie pas de logger ton déjeuner !',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Workout reminder
            if (hour === 18 && !hasWorkedOutToday()) {
                newAlerts.push({
                    id: `workout-${Date.now()}`,
                    type: 'workout',
                    message: '💪 C\'est l\'heure de ton entraînement !',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Water reminder
            if (hour % 2 === 0) {
                newAlerts.push({
                    id: `water-${Date.now()}`,
                    type: 'water',
                    message: '💧 Hydrate-toi ! Bois un verre d\'eau.',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            // Motivation
            if (hour === 8) {
                newAlerts.push({
                    id: `motivation-${Date.now()}`,
                    type: 'motivation',
                    message: '🌟 Aujourd\'hui sera une grande journée !',
                    time: now.toISOString(),
                    dismissed: false
                });
            }

            if (newAlerts.length > 0) {
                setAlerts(prev => [...prev, ...newAlerts]);

                // Browser notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    newAlerts.forEach(alert => {
                        new Notification('TitanFit', {
                            body: alert.message,
                            icon: '/icon-192.png',
                            tag: alert.id
                        });
                    });
                }
            }
        };

        const interval = setInterval(checkAlerts, 60000); // Check every minute
        checkAlerts(); // Initial check

        return () => clearInterval(interval);
    }, [enabled]);

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            await Notification.requestPermission();
        }
    };

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
    };

    const activeAlerts = alerts.filter(a => !a.dismissed);

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative group">
            <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-white font-black uppercase tracking-tighter">
                        <Bell className="h-5 w-5 text-[#D4AF37]" />
                        Alertes Smart
                    </CardTitle>
                    <Button
                        size="sm"
                        variant="ghost"
                        className={`${enabled ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 bg-white/5'} border border-white/10 hover:bg-white/10 transition-all`}
                        onClick={() => setEnabled(!enabled)}
                    >
                        {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {!('Notification' in window) ? (
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">Système non supporté</p>
                ) : Notification.permission !== 'granted' ? (
                    <Button onClick={requestNotificationPermission} className="w-full bg-[#D4AF37] text-black font-black uppercase tracking-wider h-12 rounded-xl hover:bg-[#F5C518] shadow-[0_0_15px_-5px_#D4AF37]">
                        Autoriser les Notifications
                    </Button>
                ) : null}

                {activeAlerts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <Bell className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium opacity-50">Aucune alerte active dans le flux</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeAlerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start justify-between group/alert hover:border-[#D4AF37]/30 transition-all"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm tracking-tight">{alert.message}</p>
                                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                                        {new Date(alert.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-full"
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

// Helper functions (would check real database in production)
function hasLoggedToday(meal: string): boolean {
    return Math.random() > 0.5;
}

function hasWorkedOutToday(): boolean {
    return Math.random() > 0.7;
}
