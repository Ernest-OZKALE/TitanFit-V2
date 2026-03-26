"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Smartphone, Watch, Check, X } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

const PROVIDERS = [
    { id: "apple", name: "Apple Health", icon: Activity, color: "text-red-500", bg: "bg-red-500", connected: true },
    { id: "google", name: "Google Fit", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-500", connected: false },
    { id: "oura", name: "Oura Ring", icon: createOuraIcon(), color: "text-slate-900", bg: "bg-slate-900", connected: false },
    { id: "garmin", name: "Garmin Connect", icon: Watch, color: "text-blue-400", bg: "bg-blue-400", connected: false },
];

function createOuraIcon() {
    return (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z m0 -14 c -4.42 0 -8 3.58 -8 8 c 0 4.42 3.58 8 8 8 c 4.42 0 8 -3.58 8 -8 c 0 -4.42 -3.58 -8 -8 -8 z" />
        </svg>
    );
}

export function HealthSyncHub() {
    const [providers, setProviders] = useState(PROVIDERS);

    const toggleProvider = (id: string) => {
        setProviders(providers.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                    <Activity className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900">Health Ecosystem</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase">Centralisez vos données biométriques.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {providers.map((p) => (
                    <GlassCard key={p.id} className="flex items-center justify-between p-4 group hover:border-[#D4AF37]/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg", p.bg)}>
                                <p.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    {p.name}
                                    {p.connected && <Check className="w-4 h-4 text-green-500" />}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    {p.connected ? "Sync active" : "Nécessite App Native (.ipa/.apk)"}
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={true} // Disabled on Web
                            className="w-12 h-6 rounded-full relative transition-colors duration-300 bg-slate-100 cursor-not-allowed opacity-50"
                        >
                            <motion.div
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-slate-300 shadow-sm"
                            />
                        </button>
                    </GlassCard>
                ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-700">
                <div className="min-w-[20px] pt-0.5"><Activity className="w-5 h-5" /></div>
                <p>
                    <span className="font-bold">Note de Sécurité :</span> Vos données de santé sont cryptées localement. TitanFit n'a qu'un accès en lecture seule pour adapter vos programmes.
                </p>
            </div>

        </div>
    );
}
