'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Check, Activity, Target, Weight, Ruler, X, ChevronLeft, Flame, Scale, Dumbbell } from 'lucide-react';
import { calculateTDEE, calculateMacros, UserStats, NutritionPlan } from '@/lib/nutrition-calculations';

interface OnboardingProps {
    onComplete: (plan: NutritionPlan, stats: UserStats) => void;
}

export function NutritionOnboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(0);
    const [stats, setStats] = useState<UserStats>({
        gender: 'male',
        age: 25,
        weight: 75,
        height: 180,
        activityLevel: 'moderate',
        goal: 'maintain'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; }
    }, []);

    // Scroll to top on step change
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [step]);

    // ... handles ...
    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => Math.max(0, prev - 1));

    const updateStats = (key: keyof UserStats, value: any) => {
        setStats(prev => ({ ...prev, [key]: value }));
    };

    const handleCalculate = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            handleNext();
        }, 800);
    };

    const stepsTotal = 5;
    const progress = ((step + 1) / stepsTotal) * 100;

    // ... footer config ...
    let footerConfig = { show: false, label: 'Continuer', onClick: handleNext, primary: false, icon: ArrowRight, loading: false };

    if (step === 0) {
        footerConfig = { show: true, label: 'Suivant', onClick: handleNext, primary: false, icon: ArrowRight, loading: false };
    } else if (step === 1) { // Gender/Age
        footerConfig = { show: true, label: 'Continuer', onClick: handleNext, primary: false, icon: ArrowRight, loading: false };
    } else if (step === 2) { // Metrics
        footerConfig = { show: true, label: 'Continuer', onClick: handleNext, primary: false, icon: ArrowRight, loading: false };
    } else if (step === 3) { // Activity
        footerConfig = { show: true, label: 'Calculer mon Plan', onClick: handleCalculate, primary: true, icon: Target, loading: isProcessing };
    } else if (step === 4) { // Result
        footerConfig = { show: false, label: '', onClick: () => { }, primary: false, icon: ArrowRight, loading: false };
    }

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[20000] bg-white flex flex-col h-[100dvh]">
            {/* --- HEADER --- */}
            <div className="flex-none px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md z-20">
                <div className="w-10">
                    {step > 0 && (
                        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 active:scale-95 transition-transform rounded-full">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <div className="text-center">
                    <h1 className="font-black italic text-slate-900 uppercase text-lg tracking-tighter">
                        TITAN<span className="text-[#FF4D00]">PLAN</span>
                    </h1>
                </div>
                <div className="w-10 text-right">
                    <span className="text-xs font-bold text-slate-300 tracking-widest">{step + 1}/{stepsTotal}</span>
                </div>
            </div>

            {/* --- PROGRESS BAR --- */}
            <div className="h-1 bg-slate-50 w-full flex-none relative z-10">
                <div
                    className="h-full bg-[#FF4D00] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* --- BODY (SCROLLABLE) --- */}
            <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain bg-slate-50/50 relative z-0">
                <div className="min-h-full p-6 pb-48 max-w-lg mx-auto flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {step === 0 && <StepGoal key="goal" selected={stats.goal} onSelect={(g) => updateStats('goal', g)} />}
                        {step === 1 && <StepGenderAge key="gen" gender={stats.gender} age={stats.age} onChange={updateStats as any} />}
                        {step === 2 && <StepMetrics key="met" weight={stats.weight} height={stats.height} onChange={updateStats as any} />}
                        {step === 3 && <StepActivity key="act" selected={stats.activityLevel} onSelect={(a) => updateStats('activityLevel', a)} />}
                        {step === 4 && <StepResult key="res" stats={stats} onComplete={(plan) => onComplete(plan, stats)} />}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- FOOTER (FIXED OUTSIDE FLOW) --- */}
            {footerConfig.show && (
                <div className="flex-none p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 pb-[env(safe-area-inset-bottom,20px)] transition-all">
                    <button
                        onClick={footerConfig.onClick}
                        disabled={footerConfig.loading}
                        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg
                            ${footerConfig.primary
                                ? 'bg-[#FF4D00] text-white shadow-[#FF4D00]/25'
                                : 'bg-slate-900 text-white shadow-slate-900/25'
                            }
                            ${footerConfig.loading ? 'opacity-80' : ''}
                        `}
                    >
                        {footerConfig.loading ? 'Traitement...' : footerConfig.label}
                        {!footerConfig.loading && footerConfig.icon && <footerConfig.icon className="w-5 h-5" />}
                    </button>
                </div>
            )}
        </div>
        , document.body);
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS (Simplified: No buttons inside!)
// ----------------------------------------------------------------------

function StepGoal({ selected, onSelect }: { selected: string, onSelect: (g: string) => void }) {
    const goals = [
        { id: 'cut', label: 'Perte de Gras', desc: 'Sécher, définir, perdre du poids', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: 'maintain', label: 'Maintenance', desc: 'Performance & forme athlétique', icon: Scale, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'bulk', label: 'Prise de Masse', desc: 'Volume, force et construction', icon: Dumbbell, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-hide">Objectif</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">Choisissez votre voie.</p>
            </div>

            <div className="grid gap-4">
                {goals.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selected === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`relative w-full p-6 rounded-[2rem] text-left transition-all duration-200 touch-manipulation flex items-center gap-5 border-2
                                ${isSelected
                                    ? 'bg-white border-[#FF4D00] shadow-xl shadow-[#FF4D00]/10 scale-[1.02] z-10'
                                    : 'bg-white border-transparent shadow-sm hover:border-slate-100 scale-100'
                                }
                            `}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{item.label}</h3>
                                <p className="text-xs text-slate-500 font-bold mt-1 opacity-70">{item.desc}</p>
                            </div>
                            {isSelected && <Check className="w-6 h-6 text-[#FF4D00]" />}
                        </button>
                    )
                })}
            </div>
        </motion.div>
    );
}

function StepGenderAge({ gender, age, onChange }: { gender: string, age: number, onChange: (k: string, v: any) => void }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">Profil</h2>
            </div>
            {/* Gender */}
            <div className="bg-white p-2 rounded-[2rem] shadow-sm flex items-center justify-between relative overflow-hidden">
                {['male', 'female'].map((g) => (
                    <button
                        key={g}
                        onClick={() => onChange('gender', g)}
                        className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-sm tracking-wide transition-all duration-300 relative z-10
                            ${gender === g ? 'text-white' : 'text-slate-400 hover:text-slate-600'}
                        `}
                    >
                        {g === 'male' ? 'Homme' : 'Femme'}
                    </button>
                ))}

                {/* Slidiing Background */}
                <div
                    className="absolute top-2 bottom-2 w-[calc(50%-8px)] bg-slate-900 rounded-[1.5rem] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ left: gender === 'male' ? '8px' : 'calc(50% + 4px)' }}
                />
            </div>

            {/* Age */}
            <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl shadow-slate-200/40 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest absolute top-6 left-0 right-0">Votre Âge</label>
                <div className="flex items-center justify-center gap-1 mt-4">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={age}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
                        className="w-32 text-center text-8xl font-black text-slate-900 bg-transparent outline-none p-0 tracking-tighter"
                    />
                </div>
                <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mt-2">Ans</div>
            </div>
        </motion.div>
    );
}

function StepMetrics({ weight, height, onChange }: { weight: number, height: number, onChange: (k: string, v: any) => void }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">Mesures</h2>
            </div>
            <div className="grid gap-6">
                <MetricCard icon={Weight} label="Poids (kg)" value={weight} onChange={(v: any) => onChange('weight', v)} />
                <MetricCard icon={Ruler} label="Taille (cm)" value={height} onChange={(v: any) => onChange('height', v)} />
            </div>
        </motion.div>
    );
}

function MetricCard({ icon: Icon, label, value, onChange }: any) {
    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-200/40 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</label>
                <input
                    type="number"
                    inputMode="decimal"
                    value={value}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-4xl font-black text-slate-900 outline-none"
                />
            </div>
        </div>
    )
}

function StepActivity({ selected, onSelect }: { selected: string, onSelect: (a: string) => void }) {
    const options = [
        { id: 'sedentary', label: 'Sédentaire', emoji: '🛋️', desc: 'Bureau' },
        { id: 'light', label: 'Léger', emoji: '🚶', desc: '1-3x / sem' },
        { id: 'moderate', label: 'Modéré', emoji: '🏃', desc: '3-5x / sem' },
        { id: 'active', label: 'Actif', emoji: '🏋️', desc: '6-7x / sem' },
        { id: 'athlete', label: 'Athlète', emoji: '🔥', desc: 'Intensif' },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">Activité</h2>
            </div>
            <div className="space-y-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className={`w-full p-4 rounded-[2rem] flex items-center px-6 gap-4 text-left transition-all duration-200 active:scale-[0.98]
                            ${selected === opt.id
                                ? 'bg-slate-900 text-white shadow-xl scale-[1.02]'
                                : 'bg-white text-slate-500 shadow-sm border border-slate-100'
                            }
                        `}
                    >
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                            <div className="font-bold text-lg">{opt.label}</div>
                            <div className={`text-xs font-medium ${selected === opt.id ? 'text-slate-400' : 'text-slate-400/60'}`}>{opt.desc}</div>
                        </div>
                        {selected === opt.id && <Check className="w-5 h-5 text-[#FF4D00]" />}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepResult({ stats, onComplete }: { stats: UserStats, onComplete: (p: NutritionPlan) => void }) {
    const [plan, setPlan] = useState<NutritionPlan | null>(null);

    useEffect(() => {
        try {
            const cleanStats = {
                ...stats,
                age: Number(stats.age) || 25,
                weight: Number(stats.weight) || 75,
                height: Number(stats.height) || 180,
                gender: stats.gender || 'male',
                activityLevel: stats.activityLevel || 'moderate',
                goal: stats.goal || 'maintain'
            };
            const tdee = calculateTDEE(cleanStats);
            const p = calculateMacros(tdee, cleanStats.goal);
            setPlan(p);
        } catch (e) {
            console.error("CRITICAL CALC ERROR", e);
            setPlan({ calories: 2000, protein: 150, carbs: 200, fat: 65 });
        }
    }, []);

    if (!plan) return <div className="p-10 text-center font-bold text-slate-400">Génération du plan...</div>;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Plan Prêt !</h2>
                <p className="text-slate-500 mt-2 font-medium">Voici votre carburant quotidien.</p>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Cible Journalière</span>
                    <div className="text-7xl font-black tracking-tighter my-2">{plan.calories}</div>
                    <div className="text-xl font-bold text-[#FF4D00] uppercase tracking-widest">Kcal</div>

                    <div className="grid grid-cols-3 gap-2 mt-8 border-t border-white/10 pt-6">
                        <MacroBox label="Prot" val={plan.protein} color="text-emerald-400" />
                        <MacroBox label="Gluc" val={plan.carbs} color="text-amber-400" />
                        <MacroBox label="Lip" val={plan.fat} color="text-red-400" />
                    </div>
                </div>
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FF4D00]/20 rounded-full blur-[60px]" />
            </div>

            <div className="p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 rounded-2xl">
                <button
                    onClick={() => onComplete(plan)}
                    className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg bg-[#FF4D00] text-white shadow-[#FF4D00]/25"
                >
                    Lancer l'Expérience <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}

function MacroBox({ label, val, color }: any) {
    return (
        <div>
            <div className={`text-2xl font-black ${color}`}>{val}</div>
            <div className="text-[10px] font-bold opacity-50 uppercase">{label}</div>
        </div>
    )
}
