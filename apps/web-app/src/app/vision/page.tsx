'use client';

import { useRouter } from 'next/navigation';
import { NutriScanner } from '@/components/vision/NutriScanner';
import { FormCheck } from '@/components/vision/FormCheck';
import { ArrowLeft, Sparkles, Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

export default function VisionPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 font-sans bg-black">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                            Titan <span className="text-[#D4AF37]">Vision.</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Analyse Visuelle IA</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-12">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/20 mb-6">
                        <Sparkles className="w-3 h-3" /> Vision Matrix
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        See what you <span className="text-[#D4AF37]">Eat.</span>
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Pointez, Scannez, Loggez. L'IA analyse vos aliments en temps réel.
                    </p>
                </motion.div>

                {/* Food Scanner */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                            <Camera className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">Nutri Scanner</h3>
                            <p className="text-xs text-gray-500">Analyse nutritionnelle par photo</p>
                        </div>
                    </div>
                    <NutriScanner />
                </motion.section>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Video className="w-4 h-4" /> Motion Lab
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Form Check */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <FormCheck />
                </motion.section>

            </div>
        </div>
    );
}
