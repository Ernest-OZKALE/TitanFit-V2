"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Milk, Zap, Flame, MoveRight, Beaker } from "lucide-react";
import { GlassCard, GoldButton, PremiumProgressBar } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

const BASES = [
    { id: "milk", label: "Lait Entier", cals: 150, prot: 8 },
    { id: "oat_milk", label: "Lait d'Avoine", cals: 130, prot: 4 },
    { id: "water", label: "Eau (Hardcore)", cals: 0, prot: 0 },
];

const PROTEINS = [
    { id: "whey", label: "Whey Isolate", cals: 120, prot: 25 },
    { id: "casein", label: "Caséine", cals: 110, prot: 24 },
    { id: "vegan", label: "Pois/Riz Mix", cals: 130, prot: 22 },
];

const FATS = [
    { id: "pb", label: "Beurre de Cacahuète", cals: 190, prot: 8 },
    { id: "mct", label: "Huile MCT", cals: 130, prot: 0 },
    { id: "almond", label: "Amandes", cals: 160, prot: 6 },
];

const CARBS = [
    { id: "oats", label: "Flocons d'Avoine", cals: 150, prot: 5 },
    { id: "banana", label: "Banane", cals: 105, prot: 1 },
    { id: "honey", label: "Miel", cals: 60, prot: 0 },
];

export function GainerLab() {
    const [selectedBase, setBase] = useState(BASES[0]);
    const [selectedProtein, setProtein] = useState(PROTEINS[0]);
    const [selectedFats, setFats] = useState([FATS[0]]);
    const [selectedCarbs, setCarbs] = useState([CARBS[0]]);
    const [isBlending, setIsBlending] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const toggleItem = (item: any, list: any[], setList: any) => {
        if (list.find(i => i.id === item.id)) {
            setList(list.filter(i => i.id !== item.id));
        } else {
            setList([...list, item]);
        }
    };

    const totalCals = selectedBase.cals + selectedProtein.cals + selectedFats.reduce((a, b) => a + b.cals, 0) + selectedCarbs.reduce((a, b) => a + b.cals, 0);
    const totalProt = selectedBase.prot + selectedProtein.prot + selectedFats.reduce((a, b) => a + b.prot, 0) + selectedCarbs.reduce((a, b) => a + b.prot, 0);

    const handleBlend = () => {
        setIsBlending(true);
        setTimeout(() => {
            setIsBlending(false);
            setShowResult(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">

            {/* LEFT: Lab Form */}
            <GlassCard className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Beaker className="w-8 h-8 text-[#D4AF37]" /> Gainer Lab
                    </h3>
                    <div className="text-xs font-bold uppercase text-slate-400 border border-slate-200 px-2 py-1 rounded-lg">
                        Mass Mode
                    </div>
                </div>

                {/* Section: Base */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Liquid Base</label>
                    <div className="flex gap-2 flex-wrap">
                        {BASES.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setBase(b)}
                                className={cn("px-4 py-2 rounded-xl text-sm font-bold border transition-all", selectedBase.id === b.id ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200")}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Protein */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Protein Source</label>
                    <div className="flex gap-2 flex-wrap">
                        {PROTEINS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setProtein(p)}
                                className={cn("px-4 py-2 rounded-xl text-sm font-bold border transition-all", selectedProtein.id === p.id ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200")}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Hyper-Load (Multi-select) */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hyper-Caloric Load</label>
                    <div className="flex gap-2 flex-wrap">
                        {[...FATS, ...CARBS].map(item => {
                            const isSelected = selectedFats.find(i => i.id === item.id) || selectedCarbs.find(i => i.id === item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (FATS.some(f => f.id === item.id)) toggleItem(item, selectedFats, setFats);
                                        else toggleItem(item, selectedCarbs, setCarbs);
                                    }}
                                    className={cn("px-4 py-2 rounded-xl text-sm font-bold border transition-all", isSelected ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200")}
                                >
                                    {item.label} (+{item.cals})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Real-time Ticker */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm"><Flame className="w-5 h-5 text-orange-500" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Est. Calories</p>
                            <p className="text-2xl font-black text-slate-900">{totalCals}</p>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm"><Zap className="w-5 h-5 text-[#D4AF37]" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Protein</p>
                            <p className="text-2xl font-black text-slate-900">{totalProt}g</p>
                        </div>
                    </div>
                </div>

                <GoldButton onClick={handleBlend} disabled={isBlending} className="w-full py-6 text-xl rounded-2xl shadow-gold-glow">
                    {isBlending ? "Mélange en cours..." : "Générer la Formule"} <MoveRight className={cn("ml-2 w-5 h-5", isBlending && "hidden")} />
                </GoldButton>
            </GlassCard>

            {/* RIGHT: The Result Shake */}
            <div className="lg:w-96 relative">
                <AnimatePresence mode="wait">
                    {showResult && !isBlending ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 relative overflow-hidden">
                                {/* Glow effect */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#D4AF37] blur-[100px] opacity-20" />

                                <Beaker className="w-32 h-32 text-[#D4AF37] mb-6 drop-shadow-glow relative z-10" strokeWidth={1} />

                                <h2 className="text-3xl font-black text-white mb-2 relative z-10">Titan Mass Fuel</h2>
                                <p className="text-slate-400 mb-8 relative z-10">Votre formule sur-mesure est prête.</p>

                                <div className="w-full space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-slate-400">
                                            <span>Calories</span>
                                            <span className="text-white">{totalCals} / 1000 Kcal</span>
                                        </div>
                                        <PremiumProgressBar value={(totalCals / 1000) * 100} showValue={false} className="h-3" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-slate-400">
                                            <span>Protein Density</span>
                                            <span className="text-[#D4AF37]">{totalProt}g</span>
                                        </div>
                                        <PremiumProgressBar value={(totalProt / 60) * 100} showValue={false} className="h-3" />
                                    </div>
                                </div>

                                <div className="mt-8 relative z-10">
                                    <button className="text-white text-sm font-bold underline decoration-[#D4AF37] underline-offset-4 hover:text-[#D4AF37] transition-colors">
                                        Ajouter au Journal (+{totalCals} kcal)
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            {isBlending ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <RefreshCw className="w-12 h-12 text-[#D4AF37]" />
                                </motion.div>
                            ) : (
                                <>
                                    <Beaker className="w-16 h-16 mb-4 opacity-30" />
                                    <p className="font-bold">Configurez votre Shake</p>
                                </>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Icon helper
function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
        </svg>
    );
}
