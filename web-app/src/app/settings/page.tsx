"use client";

import { TitanSidebar } from "@/components/layout/TitanSidebar";
import { HealthSyncHub } from "@/components/settings/HealthSyncHub";
import { GlassCard } from "@/components/ui/premium-components";
import { User, Bell, Shield, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <TitanSidebar />

            <main className="flex-1 lg:ml-64 w-full max-w-4xl mx-auto px-8 py-12 space-y-12 transition-all">

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Control <span className="text-[#D4AF37]">Center.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-lg">
                        Paramètres, Profil & Intégrations.
                    </p>
                </div>

                {/* 1. Health Sync Hub (Priority) */}
                <section>
                    <HealthSyncHub />
                </section>

                {/* 2. User Preferences Grid */}
                <section className="grid md:grid-cols-2 gap-6">

                    {/* Profile Card */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <User className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-900">Profile Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Username</span>
                                <span className="text-sm font-black text-slate-900">Starwek</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Titan Tier</span>
                                <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">OMEGA</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Body Type</span>
                                <span className="text-sm font-bold text-slate-900">Hybrid Athlete</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* App Preferences */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-900">App Preferences</h3>
                        </div>
                        <div className="space-y-4">
                            <ToggleRow label="Dark Mode (Auto)" icon={Moon} active={false} />
                            <ToggleRow label="Notifications" icon={Bell} active={true} />
                        </div>
                    </GlassCard>

                </section>

            </main>
        </div>
    );
}

function ToggleRow({ label, icon: Icon, active }: any) {
    const [isOn, setIsOn] = useState(active);
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{label}</span>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={cn("w-10 h-5 rounded-full relative transition-colors", isOn ? "bg-[#D4AF37]" : "bg-slate-200")}
            >
                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all", isOn ? "left-6" : "left-1")} />
            </button>
        </div>
    )
}
