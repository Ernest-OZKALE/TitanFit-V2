"use client";

import { TitanSidebar } from "@/components/layout/TitanSidebar";
import { SleepArchitect } from "@/components/biohacking/SleepArchitect";
import { NeuroPriming } from "@/components/biohacking/NeuroPriming";
import { GlassCard } from "@/components/ui/premium-components";
import { Brain, Headphones } from "lucide-react";

export default function BioPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <TitanSidebar />

            <main className="flex-1 lg:ml-64 w-full max-w-5xl mx-auto px-8 py-12 space-y-16">

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Bio <span className="text-indigo-600">Hacking.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-lg">
                        Optimisation du système nerveux et du sommeil.
                    </p>
                </div>

                {/* 1. Sleep Architect */}
                <section>
                    <SleepArchitect />
                </section>

                {/* 2. Neuro Priming (Active) */}
                <section>
                    <NeuroPriming />
                </section>

            </main>
        </div>
    );
}
