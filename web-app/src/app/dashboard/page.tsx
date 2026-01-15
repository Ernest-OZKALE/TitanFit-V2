'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/use-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Flame, Target, TrendingUp, Zap, LogOut } from 'lucide-react';
import NotificationsBtn from '@/components/NotificationsBtn';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';
import { TimeAwareHero } from '@/components/dashboard/TimeAwareHero';
import { SmartStack } from '@/components/dashboard/SmartStack';
import ProgressPredictions from '@/components/ProgressPredictions';
import SmartAlerts from '@/components/SmartAlerts';
import MealGenerator from '@/components/MealGenerator';
import BodyMapSelector from '@/components/dashboard/BodyMapSelector';

export default function DashboardPage() {
    const { user, loading, signOut } = useAuth();
    const { isAdmin, profile } = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-sans">
                <div className="text-center relative z-10">
                    <div className="w-20 h-20 border-t-4 border-[#D4AF37] border-r-4 border-r-[#D4AF37]/20 border-b-4 border-b-[#D4AF37]/10 border-l-4 border-l-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_30px_-5px_#D4AF37]"></div>
                    <p className="text-[#D4AF37] font-black tracking-[0.2em] uppercase text-sm animate-pulse">Initialisation du Système Titan</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            {/* Background 3D */}
            <TitaniumBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black z-0 pointer-events-none" />

            {/* Top Navigation - Ultra Premium Glass */}
            <nav className="relative z-[100] backdrop-blur-3xl bg-black/60 border-b border-white/5 sticky top-0 shadow-2xl transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center h-24">
                        <Link href="/" className="flex items-center space-x-4 group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-black text-2xl shadow-[0_0_25px_-5px_#D4AF37] group-hover:shadow-[0_0_35px_-2px_#D4AF37] transition-all duration-500">
                                T
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white group-hover:text-[#D4AF37] transition-colors">
                                Titan<span className="text-[#D4AF37]">Fit</span>
                            </span>
                        </Link>

                        <div className="flex items-center space-x-6">
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black shadow-[0_0_20px_-10px_#D4AF37] transition-all bg-black/40 backdrop-blur-md font-black uppercase tracking-widest text-xs px-6 py-5 rounded-xl border-l-2">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Mode Admin
                                    </Button>
                                </Link>
                            )}
                            <NotificationsBtn />
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1 opacity-60 italic">Opérateur</span>
                                <span className="text-sm text-white font-bold bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">{user.email?.split('@')[0]}</span>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="w-12 h-12 p-0 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-full border border-white/5 group"
                            >
                                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Grid - Masterpiece Layout */}
            <main className="relative z-10 max-w-[1700px] mx-auto px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                    {/* Left Column - User Context & Quick Stats (4 Cols) */}
                    <div className="xl:col-span-8 space-y-10">
                        {/* Time Aware Hero - Adaptive Greeting */}
                        <TimeAwareHero />

                        {/* Middle Content - Neural Insights & Predictions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <SmartStack />
                            <ProgressPredictions />
                        </div>

                        {/* Dashboard Stats Row - Refined */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatWidget title="Calories" value="0" target="2000" color="#D4AF37" icon={Flame} />
                            <StatWidget title="Protéines" value="0g" target="150g" color="#10b981" icon={Target} />
                            <StatWidget title="Série" value="0j" target="Elite" color="#8b5cf6" icon={Zap} />
                            <StatWidget title="Niveau" value="Titan" target="V12" color="#3b82f6" icon={Shield} />
                        </div>
                    </div>

                    {/* Right Column - Neural Protocols & Alerts (4 Cols) */}
                    <div className="xl:col-span-4 space-y-10">
                        <SmartAlerts />
                        <MealGenerator />
                        <BodyMapSelector />

                        {/* Motivation Card - Final Polish */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 border-t-[#D4AF37]/40 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
                            <Zap className="h-8 w-8 text-[#D4AF37] mb-6 animate-pulse" />
                            <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest mb-4 italic">Neural Sync</h3>
                            <p className="text-lg text-gray-300 font-light italic leading-relaxed">
                                "La discipline est le pont entre vos objectifs et votre héritage. Ne traversez pas seul, devenez la légende."
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatWidget({ title, value, target, color, icon: Icon }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 hover:border-white/20 transition-all shadow-xl group"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{title}</span>
                <Icon className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-black text-white tracking-tighter" style={{ color: value === '0' || value === '0j' || value === '0g' ? 'white' : color }}>{value}</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: '5%', backgroundColor: color }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{target}</span>
                </div>
            </div>
        </motion.div>
    );
}
