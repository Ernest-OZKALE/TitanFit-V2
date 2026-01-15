'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Scan, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/premium-components';

export default function TitanVisionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<'capture' | 'analyzing' | 'result'>('capture');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setStep('analyzing');
                simulateAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAnalysis = () => {
        setTimeout(() => {
            setStep('result');
        }, 3000);
    };

    const handleReset = () => {
        setStep('capture');
        setImagePreview(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            >
                <div className="relative w-full max-w-lg bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2">
                            <Scan className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-black uppercase tracking-widest text-white">
                                Titan <span className="text-blue-500">Vision</span>
                            </h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                            <X className="w-5 h-5 text-gray-400" />
                        </Button>
                    </div>

                    <div className="p-6 min-h-[400px] flex flex-col">

                        {/* STEP 1: CAPTURE */}
                        {step === 'capture' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 p-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-20 h-20 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-lg relative z-10">
                                    <Camera className="w-8 h-8 text-gray-400" />
                                </div>

                                <div className="text-center z-10">
                                    <h3 className="text-white font-bold text-lg mb-2">Capture Neurale</h3>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                        Prenez une photo ou importez une image. L'IA analysera les macros instantanément.
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full z-10">
                                    <Button
                                        className="flex-1 bg-white text-black hover:bg-gray-200 font-bold"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" /> Importer
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    {/* Mock Camera Button */}
                                    <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-500 font-bold">
                                        <Camera className="w-4 h-4 mr-2" /> Photo
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: ANALYZING */}
                        {step === 'analyzing' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6 relative rounded-2xl overflow-hidden">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
                                )}
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay" />

                                {/* Scanning Line */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-2 bg-blue-500 shadow-[0_0_20px_#3b82f6] z-10"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />

                                <div className="relative z-20 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin flex items-center justify-center bg-black/50 backdrop-blur-md">
                                        <Scan className="w-6 h-6 text-blue-500 animate-pulse" />
                                    </div>
                                    <div className="text-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <h3 className="text-blue-400 font-black uppercase tracking-widest text-sm mb-1 animate-pulse">
                                            Analyse Neurale en cours...
                                        </h3>
                                        <p className="text-xs text-gray-400">Identification des structures moléculaires</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: RESULT */}
                        {step === 'result' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/20 relative">
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Result" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-1 right-1 bg-green-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> 98%
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white leading-tight mb-1">Poke Bowl Saumon</h3>
                                        <p className="text-sm text-gray-400 mb-2">Détecté: Saumon, Avocat, Riz, Edamame</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">Riche en Omega-3</span>
                                            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/20">Protéine Haut de Gamme</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                        <div className="text-[10px] text-gray-500 font-black uppercase">Kcal</div>
                                        <div className="text-xl font-black text-white">520</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                        <div className="text-[10px] text-gray-500 font-black uppercase">Prot</div>
                                        <div className="text-xl font-black text-blue-500">35g</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                        <div className="text-[10px] text-gray-500 font-black uppercase">Carb</div>
                                        <div className="text-xl font-black text-white">45g</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                        <div className="text-[10px] text-gray-500 font-black uppercase">Fat</div>
                                        <div className="text-xl font-black text-white">18g</div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_-5px_#2563eb]">
                                        Confirmer & Logging <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleReset}
                                        className="w-full text-gray-500 hover:text-white"
                                    >
                                        Recommencer
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
