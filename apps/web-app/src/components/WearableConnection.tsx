'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Watch,
    Smartphone,
    RefreshCw,
    Check,
    X,
    Link2,
    Unlink,
    Heart,
    Activity,
    Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WearableProvider {
    key: string;
    name: string;
    icon: string;
    color: string;
}

interface WearableConnection {
    id: string;
    provider: string;
    providerInfo: WearableProvider;
    lastSync: string | null;
    isActive: boolean;
}

interface WearableData {
    date: string;
    total_steps: number;
    total_calories_burned: number;
    total_distance_km: number;
    avg_heart_rate: number;
    sleep_hours: number;
    recovery_score?: number;
}

export default function WearableConnection() {
    const [connections, setConnections] = useState<WearableConnection[]>([]);
    const [available, setAvailable] = useState<WearableProvider[]>([]);
    const [healthData, setHealthData] = useState<WearableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);

    useEffect(() => {
        fetchConnections();
        fetchHealthData();
    }, []);

    const fetchConnections = async () => {
        try {
            const response = await fetch('/api/wearables/connect');
            const data = await response.json();
            setConnections(data.connections || []);
            setAvailable(data.available || []);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHealthData = async () => {
        try {
            const response = await fetch('/api/wearables/sync?days=7');
            const data = await response.json();
            setHealthData(data.summaries || data.data || []);
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    };

    const connectWearable = async (provider: string) => {
        setConnecting(provider);
        try {
            const response = await fetch('/api/wearables/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });
            const data = await response.json();

            if (data.auth_url) {
                // Redirect to Terra auth
                window.location.href = data.auth_url;
            } else if (data.mock_auth_url) {
                // Development mode - simulate connection
                toast.success(`${provider} connecté (mode démo)`);
                fetchConnections();
            } else {
                toast.error('Erreur de connexion');
            }
        } catch (error) {
            console.error('Connect error:', error);
            toast.error('Erreur de connexion');
        } finally {
            setConnecting(null);
        }
    };

    const syncData = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/wearables/sync', {
                method: 'POST',
            });
            const data = await response.json();

            if (data.status === 'success' || data.status === 'development_mode') {
                toast.success('Données synchronisées !');
                fetchHealthData();
                fetchConnections();
            }
        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Erreur de synchronisation');
        } finally {
            setSyncing(false);
        }
    };

    const getProviderIcon = (provider: string) => {
        const icons: Record<string, React.ReactNode> = {
            apple: <span className="text-2xl">🍎</span>,
            google: <span className="text-2xl">🟢</span>,
            fitbit: <span className="text-2xl">💙</span>,
            garmin: <span className="text-2xl">🔵</span>,
            oura: <span className="text-2xl">💍</span>,
            whoop: <span className="text-2xl">🖤</span>,
        };
        return icons[provider.toLowerCase()] || <Watch className="w-6 h-6" />;
    };

    const todayData = healthData[0];

    if (loading) {
        return (
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-32 bg-zinc-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Connected Wearables */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Watch className="w-5 h-5 text-[#D4AF37]" />
                        Mes Wearables
                    </h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={syncData}
                        disabled={syncing || connections.length === 0}
                        className="border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        Synchroniser
                    </Button>
                </div>

                {connections.length > 0 ? (
                    <div className="space-y-3">
                        {connections.map((conn) => (
                            <motion.div
                                key={conn.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    {getProviderIcon(conn.provider)}
                                    <div>
                                        <p className="font-medium">{conn.providerInfo?.name || conn.provider}</p>
                                        <p className="text-xs text-gray-500">
                                            {conn.lastSync
                                                ? `Sync: ${new Date(conn.lastSync).toLocaleString('fr-FR')}`
                                                : 'Non synchronisé'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-xs text-green-500">Connecté</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun wearable connecté</p>
                        <p className="text-sm">Connectez votre montre ou bracelet ci-dessous</p>
                    </div>
                )}
            </div>

            {/* Health Stats (if data available) */}
            {todayData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-[#D4AF37]/20 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#D4AF37]" />
                        Aujourd'hui
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={<Activity className="w-5 h-5" />}
                            label="Pas"
                            value={todayData.total_steps.toLocaleString()}
                            color="text-blue-400"
                        />
                        <StatCard
                            icon={<Heart className="w-5 h-5" />}
                            label="FC Moy."
                            value={`${todayData.avg_heart_rate} bpm`}
                            color="text-red-400"
                        />
                        <StatCard
                            icon={<Moon className="w-5 h-5" />}
                            label="Sommeil"
                            value={`${todayData.sleep_hours}h`}
                            color="text-purple-400"
                        />
                        <StatCard
                            icon={<span>🔥</span>}
                            label="Calories"
                            value={`${todayData.total_calories_burned} kcal`}
                            color="text-orange-400"
                        />
                    </div>
                </motion.div>
            )}

            {/* Available Providers */}
            {available.length > 0 && (
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-[#D4AF37]" />
                        Connecter un appareil
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {available.map((provider) => (
                            <motion.button
                                key={provider.key}
                                whileHover={connecting === provider.key ? {} : { scale: 1.02 }}
                                whileTap={connecting === provider.key ? {} : { scale: 0.98 }}
                                onClick={connecting === provider.key ? undefined : () => connectWearable(provider.key)}
                                className={`p-4 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl border border-white/10 
                                         hover:border-[#D4AF37]/30 transition-all text-center ${connecting === provider.key ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-3xl block mb-2">{provider.icon}</span>
                                <span className="text-sm font-medium">{provider.name}</span>
                                {connecting === provider.key && (
                                    <RefreshCw className="w-4 h-4 mx-auto mt-2 animate-spin text-[#D4AF37]" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
            <div className={`${color} mb-2 flex justify-center`}>{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}
