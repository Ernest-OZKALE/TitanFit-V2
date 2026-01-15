'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    TrendingDown,
    Ticket,
    Activity,
    Crown,
    Download,
    RefreshCw,
    Calendar,
    BarChart3,
    PieChart,
    LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface KPIs {
    total_users: number;
    new_users: number;
    growth_percentage: number;
    active_subscriptions: number;
    total_promo_codes: number;
    active_promo_codes: number;
    promo_usage: number;
    admin_actions: number;
}

interface ChartData {
    user_growth: { date: string; count: number }[];
    subscriptions_by_plan: { plan: string; count: number }[];
    roles_distribution: { role: string; count: number }[];
    activity_timeline: { date: string; count: number }[];
}

interface AnalyticsData {
    period: string;
    kpis: KPIs;
    charts: ChartData;
    top_promo_codes: { code: string; uses: number; max: number; active: boolean }[];
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/analytics?period=${period}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const exportData = async (type: string) => {
        setExporting(true);
        try {
            window.open(`/api/admin/export?type=${type}&format=csv`, '_blank');
            toast.success('Export lancé');
        } catch {
            toast.error('Erreur d\'export');
        } finally {
            setExporting(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-zinc-800 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const kpis = data?.kpis;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
                        Analytics
                    </h1>
                    <p className="text-gray-500">Tableau de bord temps réel</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-sm"
                    >
                        <option value="24h">Dernières 24h</option>
                        <option value="7d">7 derniers jours</option>
                        <option value="30d">30 derniers jours</option>
                        <option value="90d">90 derniers jours</option>
                        <option value="1y">1 an</option>
                    </select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchAnalytics}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>

                    <Button
                        onClick={() => exportData('users')}
                        disabled={exporting}
                        className="bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard
                    icon={<Users className="w-6 h-6" />}
                    label="Utilisateurs totaux"
                    value={kpis?.total_users || 0}
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                />
                <KPICard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Nouveaux"
                    value={kpis?.new_users || 0}
                    change={kpis?.growth_percentage}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                />
                <KPICard
                    icon={<Crown className="w-6 h-6" />}
                    label="Abonnés actifs"
                    value={kpis?.active_subscriptions || 0}
                    color="text-[#D4AF37]"
                    bgColor="bg-[#D4AF37]/10"
                />
                <KPICard
                    icon={<Ticket className="w-6 h-6" />}
                    label="Codes promo utilisés"
                    value={kpis?.promo_usage || 0}
                    color="text-purple-400"
                    bgColor="bg-purple-500/10"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-blue-400" />
                        Croissance utilisateurs
                    </h3>
                    <div className="h-48">
                        <SimpleBarChart
                            data={data?.charts.user_growth || []}
                            color="#3B82F6"
                        />
                    </div>
                </div>

                {/* Roles Distribution */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#D4AF37]" />
                        Distribution des rôles
                    </h3>
                    <div className="space-y-2">
                        {(data?.charts.roles_distribution || []).map((role, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">{role.role}</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                                        style={{ width: `${Math.min(role.count * 20, 100)}px` }}
                                    />
                                    <span className="text-sm font-medium w-8">{role.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Promo Codes */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-400" />
                    Top codes promo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {(data?.top_promo_codes || []).map((code, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-xl border ${code.active
                                    ? 'bg-purple-500/10 border-purple-500/30'
                                    : 'bg-zinc-800/50 border-white/5 opacity-60'
                                }`}
                        >
                            <p className="font-mono font-bold">{code.code}</p>
                            <p className="text-2xl font-bold mt-1">{code.uses}</p>
                            <p className="text-xs text-gray-500">
                                {code.max ? `/ ${code.max} max` : 'illimité'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Export Options */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-400" />
                    Exporter les données
                </h3>
                <div className="flex flex-wrap gap-3">
                    {[
                        { type: 'users', label: 'Utilisateurs' },
                        { type: 'promo_codes', label: 'Codes promo' },
                        { type: 'subscriptions', label: 'Abonnements' },
                        { type: 'activity_logs', label: 'Logs activité' },
                        { type: 'roles', label: 'Attributions rôles' },
                    ].map((item) => (
                        <Button
                            key={item.type}
                            variant="outline"
                            size="sm"
                            onClick={() => exportData(item.type)}
                            className="border-white/10 hover:border-green-500/50 hover:bg-green-500/10"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {item.label} (CSV)
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, label, value, change, color, bgColor }: any) {
    const isPositive = change > 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900/50 border border-white/10 rounded-xl p-5"
        >
            <div className={`${bgColor} ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">{label}</p>
                {change !== undefined && (
                    <span className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
        </motion.div>
    );
}

function SimpleBarChart({ data, color }: { data: { date: string; count: number }[]; color: string }) {
    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-500">Pas de données</div>;
    }

    const maxValue = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="h-full flex items-end gap-1">
            {data.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / maxValue) * 100}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 rounded-t-sm"
                    style={{ backgroundColor: color, minHeight: item.count > 0 ? '4px' : '0' }}
                    title={`${item.date}: ${item.count}`}
                />
            ))}
        </div>
    );
}
