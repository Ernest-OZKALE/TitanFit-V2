'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ScanBarcode, Coffee, Sun, Moon, Cookie, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface QuickLogMealProps {
    isOpen: boolean;
    onClose: () => void;
    onLogSuccess: () => void; // Callback pour refresh l'UI parent
}

export function QuickLogMeal({ isOpen, onClose, onLogSuccess }: QuickLogMealProps) {
    const [inputValue, setInputValue] = useState('');
    const [selectedType, setSelectedType] = useState('Déjeuner');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!inputValue.trim()) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const res = await fetch('/api/nutrition/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputValue })
            });

            if (!res.ok) throw new Error('Analysis failed');

            const data = await res.json();
            setAnalysisResult(data);
        } catch (error) {
            console.error(error);
            alert("L'analyse IA a échoué. Veuillez réessayer ou entrer manuellement.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLog = (skipAi = false) => {
        if (!inputValue.trim()) return;

        let finalCals = 0;
        let finalProtein = 0;
        let finalCarbs = 0;
        let finalFat = 0;

        if (!skipAi && analysisResult) {
            finalCals = analysisResult.total.calories;
            finalProtein = analysisResult.total.protein;
            finalCarbs = analysisResult.total.carbs;
            finalFat = analysisResult.total.fat;
        } else {
            // Fallback simulation (if AI failed or forced skip)
            finalCals = Math.floor(Math.random() * 500) + 100;
        }

        const newLog = {
            id: Date.now().toString(),
            name: inputValue,
            cals: finalCals,
            protein: finalProtein,
            carbs: finalCarbs,
            fat: finalFat,
            type: selectedType,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            details: analysisResult?.items || [] // Store detailed breakdown
        };

        const existingLogs = JSON.parse(localStorage.getItem('titan_nutrition_logs') || '[]');
        const updatedLogs = [newLog, ...existingLogs];
        localStorage.setItem('titan_nutrition_logs', JSON.stringify(updatedLogs));

        setInputValue('');
        setAnalysisResult(null);
        onLogSuccess();
        onClose();

        window.dispatchEvent(new Event('storage'));
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[9999] p-6 pb-24 max-w-2xl mx-auto h-[85vh] flex flex-col shadow-2xl"
                    >
                        {/* Handle */}
                        <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-8" />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ajouter un Repas</h2>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Input Principal */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ex: 2 oeufs et du riz..."
                                className="w-full h-16 pl-6 pr-14 rounded-2xl border-2 border-slate-100 focus:border-[#D4AF37] focus:ring-0 text-xl font-bold text-slate-900 placeholder:text-slate-300 transition-all"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && !analysisResult ? handleAnalyze() : null}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !inputValue}
                                    className={`p-2 rounded-xl transition-all ${isAnalyzing ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                >
                                    {isAnalyzing ? <span className="animate-spin block">↻</span> : <ScanBarcode className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        {/* AI RESULTS PREVIEW */}
                        <AnimatePresence>
                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-[30vh] overflow-y-auto">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                            Analyse Titan AI
                                        </h3>

                                        <div className="space-y-3">
                                            {analysisResult.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{item.quantity} {item.name}</div>
                                                        <div className="text-xs text-slate-400">{item.calories} kcal • {item.protein}P {item.carbs}G {item.fat}L</div>
                                                    </div>
                                                    <div className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">
                                                        {item.calories}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                                <span className="font-black text-slate-900 uppercase text-sm">Total Estimé</span>
                                                <span className="font-black text-[#FF4D00] text-lg">{analysisResult.total.calories} kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selecteur Type */}
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Moment de la journée</h3>
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            <MealTypeOption icon={Coffee} label="Matin" active={selectedType === 'Matin'} onClick={() => setSelectedType('Matin')} />
                            <MealTypeOption icon={Sun} label="Midi" active={selectedType === 'Midi'} onClick={() => setSelectedType('Midi')} />
                            <MealTypeOption icon={Moon} label="Soir" active={selectedType === 'Soir'} onClick={() => setSelectedType('Soir')} />
                            <MealTypeOption icon={Cookie} label="Snack" active={selectedType === 'Snack'} onClick={() => setSelectedType('Snack')} />
                        </div>

                        {/* Action CTA */}
                        {analysisResult ? (
                            <Button
                                onClick={() => handleLog(false)}
                                className="mt-auto w-full h-16 bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-500/30"
                            >
                                Confirmer ({analysisResult.total.calories} kcal)
                            </Button>
                        ) : (
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="mt-auto w-full h-16 bg-[#D4AF37] hover:bg-[#B8860B] text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#D4AF37]/30"
                            >
                                {isAnalyzing ? 'Analyse en cours...' : "Analyser l'entrée"}
                            </Button>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

function MealTypeOption({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${active
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </button>
    );
}
