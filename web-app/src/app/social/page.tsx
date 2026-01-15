"use client";

import { TitanSidebar } from "@/components/layout/TitanSidebar";
import { SquadsDashboard } from "@/components/social/SquadsDashboard";
import { LiveBattleArena } from "@/components/social/LiveBattleArena";
import { GlassCard } from "@/components/ui/premium-components";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

export default function SocialPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <TitanSidebar />

            <main className="flex-1 lg:ml-64 w-full max-w-5xl mx-auto px-8 py-12 space-y-16">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            The <span className="text-[#D4AF37]">Tribe.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg">
                            Rejoignez les rangs. Combattez ensemble. Devenez un Titan.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Global Rank</p>
                            <p className="text-3xl font-black text-slate-900">#4,281</p>
                        </div>
                    </div>
                </div>

                {/* 1. Live Battle (Hero) */}
                <section>
                    <LiveBattleArena />
                </section>

                {/* 2. Squads Dashboard */}
                <section>
                    <SquadsDashboard />
                </section>

                {/* 3. Marketplace Teaser */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-slate-400" /> Blueprints Market
                        </h3>
                    </div>
                    <GlassCard className="bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-[200px] flex items-center justify-between p-10 group cursor-pointer hover:scale-[1.01] transition-transform">
                        <div className="space-y-4">
                            <h4 className="text-3xl font-black">Vendez vos programmes.</h4>
                            <p className="text-slate-400 max-w-sm">
                                Partagez vos "Titan Blueprints" avec la communauté et gagnez des golds.
                            </p>
                            <button className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                                Coming Soon <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="opacity-20 group-hover:opacity-40 transition-opacity">
                            <ShoppingBag className="w-32 h-32" />
                        </div>
                    </GlassCard>
                </section>

            </main>
        </div>
    );
}
