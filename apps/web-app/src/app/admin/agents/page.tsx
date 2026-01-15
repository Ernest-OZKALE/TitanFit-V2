'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap, Brain, MessageSquare, Settings } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ToyCard } from '@/components/dashboard/toy-ui/ToyCard';

export default function AdminAgentsPage() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded">Neural Core</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Agents & IA</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Configurez le comportement et les capacités de l'agent Titan.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToyCard title="Personnalité" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Ton de Voix</h3>
                            <p className="text-xs text-gray-500">Actuel: Encourageant & Technique</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">L'agent utilise un ton professionnel mais motivant pour guider les utilisateurs.</p>
                </ToyCard>

                <ToyCard title="Intelligence" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Modèle Neural</h3>
                            <p className="text-xs text-gray-500">TitanCore v2.4 (Active)</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Analyse en temps réel des données biométriques et nutritionnelles.</p>
                </ToyCard>

                <ToyCard title="Capacités" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Auto-Actions</h3>
                            <p className="text-xs text-gray-500">8 modules actifs</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">L'agent peut suggérer des entraînements et des repas basés sur la fatigue.</p>
                </ToyCard>
            </div>

            <GlassCard className="p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Configuration Avancée</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Les options de réglage fin de l'agent (Fine-tuning) seront disponibles dans la prochaine mise à jour du Titan OS.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase transition-colors hover:bg-white/10">
                        Documentation
                    </button>
                    <button className="px-6 py-2 bg-[#D4AF37] text-black rounded-xl text-xs font-bold uppercase transition-colors hover:bg-[#B8860B]">
                        Mise à jour v2.5
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
