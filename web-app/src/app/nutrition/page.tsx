"use client";

import { TitanSidebar } from "@/components/layout/TitanSidebar";
import { FridgeEngine } from "@/components/nutrition/FridgeEngine";
import { GainerLab } from "@/components/nutrition/GainerLab";
import { GlassCard } from "@/components/ui/premium-components";
import { motion } from "framer-motion";
import { ShoppingBasket, Milk } from "lucide-react";

export default function NutritionPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <TitanSidebar />

            <main className="flex-1 lg:ml-64 w-full max-w-7xl mx-auto px-8 py-12 space-y-12 transition-all">

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Neural <span className="text-[#D4AF37]">Fuel.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl">
                        Alimentation de précision. Générée par l'IA. Adaptée à votre biologie.
                    </p>
                </div>

                {/* Feature 1: The Alchemist */}
                <section>
                    <FridgeEngine />
                </section>

                {/* Feature 2: Gainer Lab */}
                <section>
                    <GainerLab />
                </section>

                {/* Feature 3: Grocery Auto-Pilot */}
                <section>
                    <SmartGroceryList />
                </section>

            </main>
        </div>
    );
}
