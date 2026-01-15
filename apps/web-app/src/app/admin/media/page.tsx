'use client';

import React from 'react';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, HardDrive, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function AdminMediaPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            {/* Header section with Premium design */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <Link
                            href="/admin"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-titan-gold transition-colors mb-4 group"
                        >
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Retour au Command Center
                        </Link>
                        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase italic">
                            Bibliothèque <span className="text-titan-gold">Média</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em]">
                            Gestion Centrale des Ressources Numériques • TitanFit V2
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-4"
                    >
                        {/* Status Cards */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
                            <div className="p-3 bg-titan-gold/10 rounded-xl text-titan-gold">
                                <HardDrive size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-mono text-gray-500">Stockage</p>
                                <p className="text-xl font-bold font-mono">1.2 GB</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Database size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-mono text-gray-500">Bucket</p>
                                <p className="text-xl font-bold font-mono">Media</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content: The Media Library Component */}
            <div className="max-w-7xl mx-auto">
                <MediaLibrary />
            </div>

            {/* Footer / Guide */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-titan-gold">
                            <BarChart3 size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Optimisation SEO</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-mono">
                            Utilisez le champ "Alt Text" pour améliorer le référencement de vos images sur les pages publiques.
                        </p>
                    </div>
                    <div className="space-y-3 text-center">
                        <p className="text-[10px] text-gray-600 font-mono">
                            TitanFit V2 • CMS Cloud System • Secured with RLS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
