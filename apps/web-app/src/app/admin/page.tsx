'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { KPIRibbon } from '@/components/admin/KPIRibbon';
import { OmniSearch } from '@/components/admin/OmniSearch';
import { LiveSignals } from '@/components/admin/LiveSignals';
import { AdminQuickActions } from '@/components/admin/AdminQuickActions';
import { GlassCard } from '@/components/ui/GlassCard';
import LiquidGoldBg from '@/components/hero/LiquidBackground';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return null;
    if (!user) return null;

    return (
        <div className="relative min-h-screen pb-24 pt-24 px-4 md:px-8 overflow-hidden bg-white text-slate-900">
            <LiquidGoldBg />

            {/* HEADER */}
            <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-xs font-mono text-red-600 uppercase tracking-widest">God Mode Active</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Command Center</h1>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 font-mono">System Time</p>
                    <p className="text-xl font-mono text-slate-900 font-bold">
                        {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* 1. OMNI-SEARCH (Focus Point) */}
                <OmniSearch />

                {/* 2. KPI RIBBON (Live Stats) */}
                <KPIRibbon />

                {/* 3. CONSOLE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">

                    {/* LEFT: LIVE SIGNALS */}
                    <div className="md:col-span-2 h-full">
                        <LiveSignals />
                    </div>

                    {/* RIGHT: QUICK ACTIONS */}
                    <div className="h-full">
                        <AdminQuickActions />
                    </div>
                </div>

                {/* 4. RECENT LOGS (Mini-Terminal) */}
                <GlassCard className="font-mono text-xs text-slate-500 p-4 h-32 overflow-hidden bg-slate-50 border border-slate-200" noPadding>
                    <div className="p-4 space-y-1">
                        <p><span className="text-blue-600 font-bold">[SYSTEM]</span> Backup routine executed successfully (128ms).</p>
                        <p><span className="text-green-600 font-bold">[AUTH]</span> Admin session started from IP 192.168.1.1.</p>
                        <p><span className="text-amber-600 font-bold">[WARN]</span> High latency detected on /api/vision (400ms).</p>
                        <p><span className="text-blue-600 font-bold">[SYSTEM]</span> Cache cleared for region eu-west-1.</p>
                    </div>
                </GlassCard>

            </main>
        </div>
    );
}
