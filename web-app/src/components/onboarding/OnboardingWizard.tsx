"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Dumbbell, Ruler, Scale, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types
type OnboardingData = {
    name: string;
    gender: "male" | "female" | "other";
    age: number;
    weight: number;
    height: number;
    goal: "mass" | "lean" | "athlete";
    equipment: string[];
};

const GOALS = [
    {
        id: "mass",
        label: "Mass Monster",
        desc: "Maximiser l'hypertrophie. Devenir énorme.",
        icon: Dumbbell,
    },
    {
        id: "lean",
        label: "Lean God",
        desc: "Définition musculaire extrême. Esthétique pure.",
        icon: Zap,
    },
    {
        id: "athlete",
        label: "Hybrid Athlete",
        desc: "Performance, Force et Endurance.",
        icon: User,
    },
];

const EQUIPMENTS = [
    "Poids du corps",
    "Haltères",
    "Barre & Poids",
    "Banc",
    "Barre de traction",
    "Machines (Salle)",
    "Bandes élastiques",
    "Kettlebell",
];

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        name: "",
        gender: "male",
        age: 25,
        weight: 75,
        height: 175,
        goal: "athlete",
        equipment: [],
    });
    const [isSyncing, setIsSyncing] = useState(false);

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSync();
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        // Simulation of AI Calibration
        setTimeout(() => {
            router.push("/dashboard");
        }, 3000);
    };

    const toggleEquipment = (item: string) => {
        setData((prev) => ({
            ...prev,
            equipment: prev.equipment.includes(item)
                ? prev.equipment.filter((i) => i !== item)
                : [...prev.equipment, item],
        }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto min-h-[600px] relative font-sans">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -z-10" />

            <AnimatePresence mode="wait">
                {!isSyncing ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Titan Logo / Header */}
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((s) => (
                                    <div key={s} className={cn("h-1 rounded-full transition-all duration-500", step >= s ? "w-8 bg-gold" : "w-2 bg-slate-200")} />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phase 0.5: Init</span>
                        </div>

                        {/* Steps Content */}
                        <div className="min-h-[300px]">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-900">Identité du Titan</h2>
                                    <p className="text-slate-500">Pour calibrer votre Body Map anatomique.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Prénom</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                                placeholder="Votre nom..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setData({ ...data, gender: "male" })}
                                                className={cn("p-4 rounded-xl border-2 transition-all font-bold", data.gender === "male" ? "border-gold bg-gold/5 text-gold-dark" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200")}
                                            >
                                                Homme
                                            </button>
                                            <button
                                                onClick={() => setData({ ...data, gender: "female" })}
                                                className={cn("p-4 rounded-xl border-2 transition-all font-bold", data.gender === "female" ? "border-gold bg-gold/5 text-gold-dark" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200")}
                                            >
                                                Femme
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-900">Biométrie</h2>
                                    <p className="text-slate-500">L'IA doit connaître vos métriques de base.</p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Scale className="w-4 h-4 text-gold" /> Poids (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.weight}
                                                onChange={(e) => setData({ ...data, weight: Number(e.target.value) })}
                                                className="w-full text-center text-3xl font-black bg-slate-50 border border-slate-200 rounded-2xl px-4 py-6 focus:outline-none focus:border-gold transition-all text-slate-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Ruler className="w-4 h-4 text-gold" /> Taille (cm)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.height}
                                                onChange={(e) => setData({ ...data, height: Number(e.target.value) })}
                                                className="w-full text-center text-3xl font-black bg-slate-50 border border-slate-200 rounded-2xl px-4 py-6 focus:outline-none focus:border-gold transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
                                        🔍 Ces données ajusteront le calcul de maintenance calorique et l'IMC.
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-900">L'Objectif Ultime</h2>
                                    <p className="text-slate-500">Quel type de Titan voulez-vous devenir ?</p>

                                    <div className="space-y-3">
                                        {GOALS.map((goal) => (
                                            <button
                                                key={goal.id}
                                                onClick={() => setData({ ...data, goal: goal.id as any })}
                                                className={cn(
                                                    "w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
                                                    data.goal === goal.id ? "border-gold bg-gold/5" : "border-slate-100 bg-white hover:border-gold/30"
                                                )}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("p-2 rounded-lg", data.goal === goal.id ? "bg-gold text-white" : "bg-slate-100 text-slate-400 group-hover:text-gold transition-colors")}>
                                                            <goal.icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className={cn("font-bold text-lg", data.goal === goal.id ? "text-slate-900" : "text-slate-600")}>{goal.label}</h3>
                                                            <p className="text-sm text-slate-400">{goal.desc}</p>
                                                        </div>
                                                    </div>
                                                    {data.goal === goal.id && <Check className="w-6 h-6 text-gold" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-900">L'Arsenal</h2>
                                    <p className="text-slate-500">Sélectionnez le matériel à votre disposition.</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        {EQUIPMENTS.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => toggleEquipment(item)}
                                                className={cn(
                                                    "p-3 rounded-xl border-2 text-sm font-bold transition-all",
                                                    data.equipment.includes(item) ? "border-gold bg-gold text-white shadow-gold-glow" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                                )}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                                        ℹ️ Le mode "MacGyver" utilisera ces infos pour générer vos séances.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Navigation */}
                        <div className="mt-10 flex justify-end">
                            <Button
                                onClick={handleNext}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
                            >
                                {step === 4 ? "Initialiser le Système" : "Continuer"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center p-12"
                    >
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                            <div className="absolute inset-0 border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-gold animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Neural Sync...</h2>
                        <div className="text-slate-500 font-medium space-y-1">
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>Calibrage de l'Engine...</motion.p>
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>Génération du Body Map...</motion.p>
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}>Configuration des Macros...</motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
