'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User, Bell, Shield, Target, Droplets, Flame, Dumbbell, Check, Globe, Crown } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const SETTINGS_KEY = 'titanfit_settings';

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fitness Goals State
    const [goals, setGoals] = useState({
        daily_calories: 2000,
        daily_protein: 150,
        daily_water: 8,
        workout_days_per_week: 4,
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        notifications_enabled: true,
        share_progress: false,
    });

    const [isPremium, setIsPremium] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.goals) setGoals(parsed.goals);
                if (parsed.preferences) setPreferences(parsed.preferences);
            } catch (e) {
                console.error('Error parsing settings:', e);
            }
        }

        // Check Premium Status
        async function checkPremium() {
            if (!user) return;
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_premium')
                .eq('id', user.id)
                .single();

            if (profile?.is_premium) {
                setIsPremium(true);
            }
        }
        checkPremium();
    }, [user]);

    function saveSettings() {
        setLoading(true);
        setMessage(null);

        try {
            const settingsData = { goals, preferences };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
            setMessage({ type: 'success', text: 'Paramètres sauvegardés !' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
        }

        setLoading(false);
    }

    async function handleSubscribe() {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_1234567890', // Replace with real price ID
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de la création de la session de paiement.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Une erreur est survenue.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleManageSubscription() {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setMessage({ type: 'error', text: 'Impossible d\'accéder au portail.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Erreur accès portail.' });
        } finally {
            setLoading(false);
        }
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
                                Para<span className="text-[#D4AF37]">mètres</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Configuration & Préférences</p>
                        </div>
                    </div>
                    <Button
                        onClick={saveSettings}
                        disabled={loading}
                        className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl px-6 shadow-[0_0_20px_-5px_#D4AF37]"
                    >
                        <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Sauvegarder'}
                    </Button>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* Message Alert */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-4 rounded-xl border flex items-center gap-3",
                            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        )}
                    >
                        {message.type === 'success' && <Check className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}

                {/* Fitness Goals Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-3 mb-8">
                        <Target className="w-6 h-6 text-[#D4AF37]" />
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">Objectifs Quotidiens</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <GoalInput
                            icon={Flame}
                            label="Calories"
                            value={goals.daily_calories}
                            onChange={(v: number) => setGoals({ ...goals, daily_calories: v })}
                            unit="kcal"
                            color="#D4AF37"
                        />
                        <GoalInput
                            icon={Target}
                            label="Protéines"
                            value={goals.daily_protein}
                            onChange={(v: number) => setGoals({ ...goals, daily_protein: v })}
                            unit="g"
                            color="#10b981"
                        />
                        <GoalInput
                            icon={Droplets}
                            label="Eau"
                            value={goals.daily_water}
                            onChange={(v: number) => setGoals({ ...goals, daily_water: v })}
                            unit="verres"
                            color="#3b82f6"
                        />
                        <GoalInput
                            icon={Dumbbell}
                            label="Entraînements"
                            value={goals.workout_days_per_week}
                            onChange={(v: number) => setGoals({ ...goals, workout_days_per_week: v })}
                            unit="/semaine"
                            color="#8b5cf6"
                        />
                    </div>
                </motion.section>

                {/* Subscription Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={cn(
                        "p-8 rounded-[2rem] border relative overflow-hidden group transition-all",
                        isPremium
                            ? "bg-gradient-to-br from-[#D4AF37]/10 to-black border-[#D4AF37]/50"
                            : "bg-gradient-to-br from-[#0F0F0F] to-[#1a1a1a] border-[#D4AF37]/20"
                    )}
                >
                    <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center border",
                                isPremium ? "bg-[#D4AF37] border-[#D4AF37] text-black" : "bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]"
                            )}>
                                <Crown className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    Titan Pro <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                        isPremium ? "bg-white text-black" : "bg-[#D4AF37] text-black"
                                    )}>{isPremium ? 'ACTIF' : 'ELITE'}</span>
                                </h2>
                                <p className="text-gray-400 max-w-md mt-1">
                                    {isPremium
                                        ? "Vous avez accès à toutes les fonctionnalités Elite. Merci de votre soutien !"
                                        : "Débloquez le coaching IA illimité, les analyses avancées et le programme de nutrition personnalisé."
                                    }
                                </p>
                            </div>
                        </div>
                        {isPremium ? (
                            <Button
                                onClick={handleManageSubscription}
                                disabled={loading}
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 text-white font-bold px-8 py-8 md:py-6 rounded-xl border-dashed uppercase tracking-widest"
                            >
                                {loading ? 'Chargement...' : 'Gérer l\'abonnement'}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="bg-[#D4AF37] text-black font-bold px-8 py-8 md:py-6 rounded-xl hover:bg-[#F5C518] border-none shadow-[0_0_20px_-5px_#D4AF37] transition-all hover:shadow-[0_0_30px_-5px_#D4AF37] uppercase tracking-widest"
                            >
                                {loading ? 'Redirection...' : 'Passer Pro - 9.99€/mois'}
                            </Button>
                        )}
                    </div>
                </motion.section>

                {/* Preferences Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Notifications */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">Notifications</h3>
                        </div>
                        <ToggleRow
                            label="Alertes Push"
                            description="Rappels d'hydratation, repas, entraînement"
                            active={preferences.notifications_enabled}
                            onChange={(v: boolean) => setPreferences({ ...preferences, notifications_enabled: v })}
                        />
                    </motion.section>

                    {/* Privacy */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">Confidentialité</h3>
                        </div>
                        <ToggleRow
                            label="Partager mes progrès"
                            description="Visible dans le feed communautaire"
                            active={preferences.share_progress}
                            onChange={(v: boolean) => setPreferences({ ...preferences, share_progress: v })}
                        />
                    </motion.section>
                </div>

                {/* Language Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-[#D4AF37]" />
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-widest">Langue</h3>
                                <p className="text-sm text-gray-500">Changer la langue de l'application</p>
                            </div>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </motion.section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/profile">
                        <div className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer group flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white uppercase">Modifier le Profil</h3>
                                    <p className="text-sm text-gray-500">Avatar, bio, informations personnelles</p>
                                </div>
                            </div>
                            <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}

function GoalInput({ icon: Icon, label, value, onChange, unit, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</Label>
            </div>
            <div className="relative">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white text-center text-2xl font-black h-16 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">{unit}</span>
            </div>
        </div>
    );
}

function ToggleRow({ label, description, active, onChange }: any) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="text-white font-bold">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                onClick={() => onChange(!active)}
                className={cn(
                    "w-12 h-6 rounded-full relative transition-all",
                    active ? "bg-[#D4AF37]" : "bg-white/10"
                )}
            >
                <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all",
                    active ? "left-7" : "left-1"
                )} />
            </button>
        </div>
    );
}
