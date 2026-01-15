'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LiquidGoldBg from '@/components/hero/LiquidBackground';
import { useAuth } from '@/lib/auth-context';
import { Shield, Flame, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Component Imports
import { TimeAwareHero } from '@/components/dashboard/TimeAwareHero';
import { SmartStack } from '@/components/dashboard/SmartStack';
import ProgressPredictions from '@/components/ProgressPredictions';
import SmartAlerts from '@/components/SmartAlerts';
import MealGenerator from '@/components/MealGenerator';
import BodyMapSelector from '@/components/dashboard/BodyMapSelector';
import FocusModeOverlay from '@/components/dashboard/FocusModeOverlay';
import { MorningCheckIn } from '@/components/dashboard/MorningCheckIn';
import { CycleSyncWidget } from '@/components/dashboard/CycleSyncWidget';
import { DataRing } from '@/components/dashboard/DataRing';
import { BioScanWidget } from '@/components/dashboard/BioScanWidget';
import EnergyBatteryWidget from '@/components/dashboard/EnergyBatteryWidget';
import InsightCard from '@/components/dashboard/InsightCard';
import FoodLogger from '@/components/nutrition/FoodLogger';
import LiveWorkout from '@/components/strength/LiveWorkout';
import PremiumGate from '@/components/premium/PremiumGate';
import SubscribeButton from '@/components/premium/SubscribeButton';
import DeviceManager from '@/components/bio/DeviceManager';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showFocusMode, setShowFocusMode] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);

    // Check if we need a morning check-in
    useEffect(() => {
        const checkStatus = async () => {
            const lastCheckIn = localStorage.getItem('titan_last_checkin');
            const today = new Date().toISOString().split('T')[0];

            if (lastCheckIn !== today) {
                // Wait a bit for dramatic effect
                setTimeout(() => setShowCheckIn(true), 1000);
            }
        };
        checkStatus();
    }, []);

    const handleCheckInComplete = () => {
        setShowCheckIn(false);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('titan_last_checkin', today);
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
                    <p className="animate-pulse text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Chargement Bio-OS...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 font-bold">
                ERREUR AUTH: Utilisateur non détecté. Redirection...
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            <FocusModeOverlay isActive={showFocusMode} onClose={() => setShowFocusMode(false)} />
            {showCheckIn && <MorningCheckIn onComplete={handleCheckInComplete} />}
            <LiquidGoldBg />

            {/* HERO SECTION */}
            {/* HERO SECTION */}
            <TimeAwareHero onStartFocus={() => setShowFocusMode(true)} />

            {/* MAIN CONTROL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: MISSION CONTROL (Stack + Progress) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* ENERGY BANK + CYCLE (Bevel Feature) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EnergyBatteryWidget />
                        <CycleSyncWidget />
                    </div>

                    {/* Row 1: Active Operations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SmartStack onStartFocus={() => setShowFocusMode(true)} />
                        <ProgressPredictions />
                    </div>

                    {/* Row 2: Bio-Metrics Ribbon */}
                    <section className="bg-black/20 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-1 h-4 bg-[#10B981] rounded-full shadow-[0_0_10px_#10B981]" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Bio-Harnais (Direct)</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                            <DataRing label="Flux" subValue="1,240" suffix="kcal" value={65} color="#D4AF37" icon={Flame} delay={0.1} />
                            <DataRing label="Synthèse" subValue="145" suffix="prot" value={80} color="#10B981" icon={Target} delay={0.2} />
                            <DataRing label="Constance" subValue="12" suffix="jours" value={100} color="#8B5CF6" icon={Zap} delay={0.3} />
                            <DataRing label="Indice Titan" subValue="840" suffix="pts" value={84} color="#3B82F6" icon={Shield} delay={0.4} />
                        </div>
                        {/* Background Deco */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#10B981]/5 to-transparent pointer-events-none" />
                    </section>
                </div>

                {/* RIGHT COLUMN: TACTICAL TOOLS */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* STRENGTH BUILDER (Phase 3) */}
                    <LiveWorkout />

                    {/* DEVICE HUB (Phase 4) */}
                    <DeviceManager />

                    {/* TITAN ARSENAL (New Navigation Hub) */}
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href="/dashboard/generator"
                            className="bg-[#D4AF37] text-black p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37] transition-transform hover:scale-105"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-16 h-16" /></div>
                            <Zap className="w-6 h-6 mb-2" />
                            <div>
                                <h3 className="font-black uppercase text-sm leading-tight">Générateur <br />Titan</h3>
                                <p className="text-[10px] uppercase opacity-75 mt-1">Créer Programme</p>
                            </div>
                        </a>

                        <a
                            href="/dashboard/body"
                            className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-transform hover:scale-105"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><Shield className="w-16 h-16" /></div>
                            <Shield className="w-6 h-6 text-[#D4AF37] mb-2" />
                            <div>
                                <h3 className="font-bold text-white uppercase text-sm leading-tight">Titan <br />Atlas</h3>
                                <p className="text-[10px] text-gray-500 uppercase mt-1">Carte Anatomique</p>
                            </div>
                        </a>

                        <a
                            href="/dashboard/tools"
                            className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-transform hover:scale-105"
                        >
                            <Target className="w-6 h-6 text-blue-400 mb-2" />
                            <div>
                                <h3 className="font-bold text-white uppercase text-sm leading-tight">Bio <br />Tools</h3>
                                <p className="text-[10px] text-gray-500 uppercase mt-1">Calculateurs</p>
                            </div>
                        </a>

                        <a
                            href="/exercises"
                            className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-transform hover:scale-105"
                        >
                            <Flame className="w-6 h-6 text-purple-400 mb-2" />
                            <div>
                                <h3 className="font-bold text-white uppercase text-sm leading-tight">Wiki <br />Source</h3>
                                <p className="text-[10px] text-gray-500 uppercase mt-1">Encyclopédie</p>
                            </div>
                        </a>
                    </div>

                    {/* UPGRADE CTA */}
                    <div className="w-full">
                        <SubscribeButton className="w-full py-6 text-lg shadow-xl shadow-[#D4AF37]/10 border border-[#D4AF37]/20" />
                    </div>

                    <SmartAlerts />
                    <div className="flex-1">
                        <FoodLogger />
                    </div>
                </div>
            </div>
        </div>
    );
}


