'use client';

import { motion } from 'framer-motion';
import { Camera, Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const photos = [
    { id: 1, date: 'Jan 2025', src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2070', weight: '82kg' },
    { id: 2, date: 'Dec 2024', src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=2070', weight: '80kg' },
    { id: 3, date: 'Nov 2024', src: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=1974', weight: '78kg' },
];

export function PhysiqueGallery() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Physique Timeline</h3>
                <Button variant="ghost" className="text-[#D4AF37] hover:text-[#B8860B] hover:bg-[#D4AF37]/10 text-xs font-bold uppercase tracking-wide h-8">
                    <Plus className="w-3 h-3 mr-1" /> Add Entry
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Add New Card */}
                <button className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all flex flex-col items-center justify-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#D4AF37]/20 flex items-center justify-center text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                        <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-[#D4AF37] uppercase tracking-wide">Upload</span>
                </button>

                {/* Photos */}
                {photos.map((photo, i) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                    >
                        <img src={photo.src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Physique" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform">
                            <div className="text-white font-bold text-sm">{photo.date}</div>
                            <div className="text-[#D4AF37] text-xs font-mono font-bold">{photo.weight}</div>
                        </div>
                    </motion.div>
                ))}

                {/* Locked / Future */}
                <div className="aspect-[3/4] rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-2 opacity-50">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Next Month</span>
                </div>
            </div>
        </div>
    );
}
