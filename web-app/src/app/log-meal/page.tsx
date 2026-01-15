'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Zap, Camera, Mic, ChevronLeft, ScanLine } from 'lucide-react';
import { openFoodFactsAPI, edamamAPI } from '@/lib/api-services';
import BarcodeScanner from '@/components/BarcodeScanner';
import PageLoader from '@/components/PageLoader';
import TitaniumBackground from '@/components/TitaniumBackground';
import { GlassCard } from '@/components/ui/premium-components';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LogMealPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    // Mock function for demo
    const handleSearch = async () => {
        setLoading(true);
        // Simulate search delay
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden pb-24">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black pointer-events-none" />

            {loading && <PageLoader />}

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center gap-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-[#D4AF37]">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black uppercase tracking-tighter text-white leading-none">
                        Journal <span className="text-[#D4AF37]">Nutrition</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Acquisition de données</p>
                </div>
            </header>

            <main className="relative z-10 max-w-md mx-auto px-4 py-8 space-y-8">

                {/* Search & Actions */}
                <GlassCard className="border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden p-0">
                    <div className="p-4 space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                                <Input
                                    placeholder="Rechercher un aliment..."
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button size="icon" className="h-12 w-12 bg-[#D4AF37] hover:bg-[#F5C518] text-black shadow-[0_0_15px_-5px_#D4AF37] rounded-xl transition-transform hover:scale-105 active:scale-95">
                                <Plus className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                className="h-20 flex-col gap-2 border border-dashed border-white/20 bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all rounded-xl group"
                                onClick={() => setShowScanner(!showScanner)}
                            >
                                <ScanLine className="h-6 w-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-white">Scan</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border border-dashed border-white/20 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500 transition-all rounded-xl group">
                                <Camera className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-white">Titan Vision</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border border-dashed border-white/20 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all rounded-xl group">
                                <Mic className="h-6 w-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-white">Vocal</span>
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                {showScanner && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden rounded-2xl border-2 border-[#D4AF37] shadow-[0_0_30px_-10px_#D4AF37]"
                    >
                        <BarcodeScanner onDetected={(code) => console.log(code)} onClose={() => setShowScanner(false)} />
                    </motion.div>
                )}

                {/* Recent Meals */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Logs Récents</h2>
                        <Button variant="link" className="text-[#D4AF37] text-xs h-auto p-0 hover:text-white transition-colors">Tout voir</Button>
                    </div>

                    {[
                        { name: 'Omelette Fromage', cal: 450, time: 'Hier', macros: { p: 35, c: 2, f: 28 } },
                        { name: 'Salade César', cal: 320, time: 'Hier', macros: { p: 25, c: 12, f: 18 } },
                        { name: 'Shake Protéiné', cal: 180, time: 'Hier', macros: { p: 40, c: 4, f: 1 } }
                    ].map((meal, idx) => (
                        <GlassCard key={idx} className="border border-white/5 hover:border-[#D4AF37]/30 bg-black/40 backdrop-blur-md p-4 group cursor-pointer transition-all hover:translate-x-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white text-sm group-hover:text-[#D4AF37] transition-colors">{meal.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{meal.time}</p>
                                        <div className="flex gap-1">
                                            <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 rounded">P:{meal.macros.p}</span>
                                            <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 rounded">C:{meal.macros.c}</span>
                                            <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 rounded">F:{meal.macros.f}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-white text-lg">{meal.cal} <span className="text-[10px] text-gray-500 font-bold uppercase">kcal</span></p>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black uppercase tracking-wider font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                        + Ajouter
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    );
}
