'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Settings,
    ArrowLeft,
    Globe,
    Plus,
    Monitor,
    Smartphone,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { PageManager } from '@/components/admin/cms/PageManager';
import { SectionList } from '@/components/admin/cms/SectionList';
import { SectionEditor } from '@/components/admin/cms/SectionEditor';
import { CmsPage, CmsSection } from '@/types/cms';
import { toast } from 'sonner';

export default function AdminPagesPage() {
    const [view, setView] = useState<'manager' | 'sections' | 'editor'>('manager');
    const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
    const [editingSection, setEditingSection] = useState<CmsSection | null>(null);

    const handleSelectPage = (page: CmsPage) => {
        setSelectedPage(page);
        setView('sections');
    };

    const handleEditSection = (section: CmsSection) => {
        setEditingSection(section);
        setView('editor');
    };

    const handleSaveSection = async (data: Partial<CmsSection>) => {
        try {
            const response = await fetch('/api/admin/cms/sections', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Section mise à jour !');
                setView('sections');
            } else {
                const error = await response.json();
                toast.error(`Erreur: ${error.error}`);
            }
        } catch (error) {
            toast.error('Erreur lors de la sauvegarde');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                            Éditeur de <span className="text-titan-gold">Pages</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em]">
                            Système de Sections Dynamiques • TitanFit V2
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    >
                        <div className="p-3 bg-titan-gold/10 rounded-xl text-titan-gold">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-mono text-gray-500 text-center">Interface Admin</p>
                            <p className="text-xl font-bold font-mono tracking-tighter">CMS Engine v2</p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Areas */}
                <AnimatePresence mode="wait">
                    {view === 'manager' && (
                        <motion.div
                            key="manager"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PageManager onSelectPage={handleSelectPage} />
                        </motion.div>
                    )}

                    {view === 'sections' && selectedPage && (
                        <motion.div
                            key="sections"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <SectionList
                                page={selectedPage}
                                onBack={() => setView('manager')}
                                onEditSection={handleEditSection}
                            />
                        </motion.div>
                    )}

                    {view === 'editor' && editingSection && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <SectionEditor
                                section={editingSection}
                                onClose={() => setView('sections')}
                                onSave={handleSaveSection}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Stats / Global Info */}
                <div className="mt-20 pt-8 border-t border-white/5 grid md:grid-cols-3 gap-8 text-gray-500">
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-titan-gold flex items-center gap-2">
                            <Globe size={14} /> Propagation Directe
                        </div>
                        <p className="text-xs font-mono">
                            Toutes les modifications sont appliquées instantanément sur les pages publiées.
                            Utilisez le statut "Draft" pour tester vos designs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
