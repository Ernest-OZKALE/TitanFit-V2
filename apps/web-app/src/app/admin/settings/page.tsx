'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save, AlertTriangle, Globe, Coins, ShieldAlert, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';


export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (data) {
            const settingsObj = data.reduce((acc: any, setting: any) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {});
            setSettings(settingsObj);
        } else {
            // Mock default settings if empty
            setSettings({
                site_name: 'TitanFit',
                site_description: 'Votre parcours fitness premium',
                currency: 'EUR',
                coins_per_dollar: '100',
                maintenance_mode: 'false'
            });
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        // Simulate save
        setTimeout(() => {
            setSaving(false);
        }, 1000);
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="w-12 h-12 border-t-2 border-[#D4AF37] border-r-2 border-[#D4AF37]/30 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded">Configuration</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Paramètres</h1>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Configurez les options générales de l'application</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#D4AF37] text-black font-bold hover:bg-[#B8860B] min-w-[140px]"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-black/50 border-t-black rounded-full animate-spin mr-2" />
                            Sauvegarde...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Settings Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Général</h3>
                                <p className="text-sm text-gray-500">Informations de base du site</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="site_name" className="text-gray-400 text-xs uppercase font-bold tracking-wider">Nom du Site</Label>
                                <Input
                                    id="site_name"
                                    value={settings.site_name || ''}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="bg-[#1A1A1A] border-white/10 text-white focus:border-[#D4AF37]/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site_description" className="text-gray-400 text-xs uppercase font-bold tracking-wider">Description</Label>
                                <Input
                                    id="site_description"
                                    value={settings.site_description || ''}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    className="bg-[#1A1A1A] border-white/10 text-white focus:border-[#D4AF37]/50"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Currency Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/5"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                <Coins className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Économie</h3>
                                <p className="text-sm text-gray-500">Configuration des devises et des points</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="text-gray-400 text-xs uppercase font-bold tracking-wider">Devise Principale</Label>
                                <Input
                                    id="currency"
                                    value={settings.currency || 'USD'}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="bg-[#1A1A1A] border-white/10 text-white focus:border-[#D4AF37]/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coins_per_dollar" className="text-gray-400 text-xs uppercase font-bold tracking-wider">Coins par Euro</Label>
                                <Input
                                    id="coins_per_dollar"
                                    type="number"
                                    value={settings.coins_per_dollar || '100'}
                                    onChange={(e) => setSettings({ ...settings, coins_per_dollar: e.target.value })}
                                    className="bg-[#1A1A1A] border-white/10 text-white focus:border-[#D4AF37]/50"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Settings Column */}
                <div className="space-y-8">
                    {/* Maintenance Mode */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-[#D4AF37]/30 transition-colors"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Power className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Maintenance</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div>
                                <p className="font-bold text-gray-200 text-sm">Mode Maintenance</p>
                                <p className="text-xs text-gray-500 mt-1">Désactiver l'accès au site public</p>
                            </div>
                            <Badge
                                variant={settings.maintenance_mode === 'true' ? 'destructive' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSettings({ ...settings, maintenance_mode: settings.maintenance_mode === 'true' ? 'false' : 'true' })}
                            >
                                {settings.maintenance_mode === 'true' ? 'ACTIF' : 'INACTIF'}
                            </Badge>
                        </div>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-red-500/[0.05] border border-red-500/20"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Danger Zone</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-red-400/80 leading-relaxed">
                                Les actions ci-dessous sont irréversibles. Soyez prudent.
                            </p>
                            <Button variant="destructive" className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50">
                                Réinitialiser les Données
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
