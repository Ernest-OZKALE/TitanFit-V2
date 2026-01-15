"use client";

import { TitanSidebar } from "@/components/layout/TitanSidebar";
import { NutriScanner } from "@/components/vision/NutriScanner";
import { FormCheck } from "@/components/vision/FormCheck";
import { Sparkles, Video } from "lucide-react";

export default function VisionPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex">
            <TitanSidebar />

            <main className="flex-1 lg:ml-64 w-full max-w-4xl mx-auto px-8 py-12 space-y-12">

                {/* Header */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/20">
                        <Sparkles className="w-3 h-3" /> Titan Vision Matrix
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        See what you <span className="text-[#D4AF37]">Eat.</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Pointez, Scannez, Loggez. L'IA analyse moleculairement vos aliments (Simulation).
                    </p>
                </div>

                {/* Feature 1: Food Scanner */}
                <section>
                    <NutriScanner />
                </section>

                {/* Feature 2: Form Check Analysis */}
                <div className="flex items-center gap-2 opacity-50 py-8">
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Video className="w-4 h-4" /> Motion Analysis Lab
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                </div>

                <section>
                    <FormCheck />
                </section>

            </main>
        </div>
    );
}
