'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity, ArrowRight, UserPlus, Gift, FileText, Sparkles, Bot, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data for charts
const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4200 },
    { name: 'Sep', value: 5100 },
    { name: 'Oct', value: 6500 },
    { name: 'Nov', value: 7200 },
    { name: 'Dec', value: 8400 },
];

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [aiInput, setAiInput] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="w-12 h-12 border-t-2 border-[#D4AF37] border-r-2 border-[#D4AF37]/30 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const stats = [
        { name: 'Utilisateurs', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { name: 'Produits', value: '45', change: '+3', icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { name: 'Commandes', value: '128', change: '+8%', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { name: 'Revenus', value: '12,450€', change: '+24%', icon: DollarSign, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20' },
    ];

    return (
        <div className="space-y-8 animate-fade-in text-gray-200">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Dashboard <span className="text-[#D4AF37]">Nexus</span></h1>
                    <p className="text-gray-400 mt-2 text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        Intelligence Artificielle & Gestion Unifiée
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse box-shadow-[0_0_10px_#10B981]" />
                    SYSTEM_ONLINE // V2.4
                </div>
            </div>

            {/* AI Agent Widget (Hero of the Dashboard) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden p-1 rounded-3xl bg-gradient-to-br from-[#D4AF37]/30 via-white/5 to-transparent p-[1px]"
            >
                <div className="relative rounded-[23px] bg-black/60 backdrop-blur-xl border border-white/5 p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                        <Bot className="w-64 h-64 text-[#D4AF37] rotate-12 translate-x-12 -translate-y-12" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                                <Zap className="w-3 h-3" /> Assistant Actif
                            </div>
                            <h2 className="text-3xl font-bold text-white max-w-md leading-tight">
                                Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF5C3]">Architecte</span>.
                                <br />Quelles sont vos directives pour aujourd'hui ?
                            </h2>
                            <p className="text-gray-400 text-sm max-w-sm">
                                Je suis prêt à analyser vos données, générer du contenu ou optimiser vos workflows.
                            </p>
                        </div>

                        <div className="flex flex-col justify-end space-y-4">
                            {/* Fake Chat Interface */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-end">
                                    <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-2xl rounded-tr-sm text-sm border border-[#D4AF37]/20 max-w-[80%]">
                                        Analyse les ventes de la dernière semaine.
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-white/5 text-gray-300 px-4 py-2 rounded-2xl rounded-tl-sm text-sm border border-white/5 max-w-[90%]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bot className="w-3 h-3 text-[#D4AF37]" />
                                            <span className="text-[10px] uppercase font-bold text-gray-500">Titan AI</span>
                                        </div>
                                        Analyse effectuée. Hausse de 12% détectée sur les programmes "Hypertrophie". Recommande d'augmenter le budget pub sur ce segment.
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Envoyer une directive à l'agent..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-inner"
                                />
                                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#D4AF37] hover:bg-[#B8860B] rounded-lg flex items-center justify-center text-black transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        key={stat.name}
                        className={cn(
                            "relative group p-6 rounded-2xl bg-[#0F0F0F] border hover:border-white/20 transition-all duration-300",
                            "border-white/5 hover:bg-[#141414] hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]"
                        )}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-2xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.name}</p>
                                <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={cn("p-3 rounded-xl backdrop-blur-md shadow-lg", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium relative z-10">
                            <span className={cn("px-1.5 py-0.5 rounded bg-white/5 border border-white/5", stat.color)}>{stat.change}</span>
                            <span className="text-gray-500">vs mois dernier</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 lg:grid-cols-3">

                {/* Chart Section (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    Revenus & Croissance
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">LIVE</span>
                                </h3>
                                <p className="text-sm text-gray-500">Analyse de la performance annuelle</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                                <TrendingUp className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#666"
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                        tickFormatter={(value) => `€${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px' }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#D4AF37"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (1 Col) */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-black border border-white/5 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-[50px] pointer-events-none" />

                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Actions Rapides
                        </h3>

                        <div className="space-y-3 relative z-10">
                            <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group text-left flex items-center justify-between hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:text-blue-300 border border-blue-500/10">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-200">Gérer Utilisateurs</p>
                                        <p className="text-xs text-gray-500">Ajouter ou modifier</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group text-left flex items-center justify-between hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:text-emerald-300 border border-emerald-500/10">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-200">Nouveau Produit</p>
                                        <p className="text-xs text-gray-500">Catalogue boutique</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group text-left flex items-center justify-between hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:text-purple-300 border border-purple-500/10">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-200">Contenu CMS</p>
                                        <p className="text-xs text-gray-500">Blog et Articles</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 relative group hover:bg-[#D4AF37]/10 transition-colors">
                            <p className="text-xs text-[#D4AF37] font-medium mb-2 flex justify-between">
                                <span>État du Serveur</span>
                                <span className="animate-pulse">●</span>
                            </p>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-full h-1.5 rounded-full bg-[#D4AF37]/20 overflow-hidden">
                                    <div className="w-[32%] h-full rounded-full bg-[#D4AF37] group-hover:w-[45%] transition-all duration-1000" />
                                </div>
                                <span className="text-xs font-bold text-[#D4AF37]">32%</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Charge CPU - Stable</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
