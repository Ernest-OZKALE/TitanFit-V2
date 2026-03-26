'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Scan, CheckCircle2, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TitanVisionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<'capture' | 'analyzing' | 'result'>('capture');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<any>(null);

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
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            >
                <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#D4AF37]/30 rounded-[2rem] overflow-hidden shadow-[0_0_50px_-20px_rgba(212,175,55,0.3)]">

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                <Scan className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-widest text-white leading-none">
                                    Titan <span className="text-[#D4AF37]">Vision</span>
                                </h2>
                                <p className="text-[10px] text-gray-500 font-medium tracking-wide">AI Food Analysis Protocol</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-8 min-h-[450px] flex flex-col relative z-10">

                        {/* STEP 1: CAPTURE */}
                        {step === 'capture' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] p-8 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500">
                                <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-24 h-24 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping opacity-20" />
                                    <Camera className="w-10 h-10 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                                </div>

                                <div className="text-center z-10 space-y-2">
                                    <h3 className="text-white font-bold text-xl">Capture Neurale</h3>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                                        Importez une photo de votre repas. L'IA Titan identifiera les ingrédients et calculera les macros instantanément.
                                    </p>
                                </div>

                                <div className="flex flex-col w-full gap-3 z-10">
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl"
                                    >
                                        <Upload className="w-4 h-4 mr-2" /> Importer Image
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 text-gray-300 font-bold uppercase tracking-widest rounded-xl">
                                        <Camera className="w-4 h-4 mr-2" /> Utiliser Caméra
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: ANALYZING */}
                        {step === 'analyzing' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6 relative rounded-3xl overflow-hidden bg-black">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-110" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Scanning Grid Overlay */}
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />

                                {/* Scanning Line */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] shadow-[0_0_30px_#D4AF37] z-20"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                />

                                <div className="relative z-30 flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin absolute inset-0" />
                                        <div className="w-20 h-20 rounded-full border-b-2 border-l-2 border-[#D4AF37]/30 animate-spin-reverse absolute inset-0" />
                                        <div className="w-20 h-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full">
                                            <Scan className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                                            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px]">Processing</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg animate-pulse">
                                            Analyse Spectrum en cours...
                                        </h3>
                                        <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500 font-mono uppercase">
                                            <span>Identification des protéines... <span className="text-emerald-500">OK</span></span>
                                            <span>Calcul volumétrique... <span className="text-[#D4AF37]">98%</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: RESULT */}
                        {step === 'result' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex items-start gap-5 mb-8">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl group cursor-pointer">
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Result" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                        <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
                                            <CheckCircle2 className="w-3 h-3" /> 98%
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className="text-2xl font-black text-white leading-tight mb-2 uppercase italic">Poke Bowl Saumon</h3>
                                        <div className="space-y-1 mb-3">
                                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Saumon Frais (120g)
                                            </p>
                                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Riz Vinaigré (150g)
                                            </p>
                                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Avocat (½)
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase border border-[#D4AF37]/20 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> High Protein
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3 mb-8">
                                    <div className="bg-[#151515] p-3 rounded-2xl border border-white/5 text-center group hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Kcal</div>
                                        <div className="text-xl font-black text-white group-hover:text-[#D4AF37] transition-colors">520</div>
                                    </div>
                                    <div className="bg-[#151515] p-3 rounded-2xl border border-white/5 text-center group hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Prot</div>
                                        <div className="text-xl font-black text-[#D4AF37]">35g</div>
                                    </div>
                                    <div className="bg-[#151515] p-3 rounded-2xl border border-white/5 text-center group hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Carb</div>
                                        <div className="text-xl font-black text-white group-hover:text-[#D4AF37] transition-colors">45g</div>
                                    </div>
                                    <div className="bg-[#151515] p-3 rounded-2xl border border-white/5 text-center group hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Fat</div>
                                        <div className="text-xl font-black text-white group-hover:text-[#D4AF37] transition-colors">18g</div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_-5px_#D4AF37] transition-all">
                                        Confirmer & Logging <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleReset}
                                        className="w-full text-gray-500 hover:text-white"
                                    >
                                        Scanner un autre plat
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
