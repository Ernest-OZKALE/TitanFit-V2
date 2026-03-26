'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Globe,
    Layout,
    ChevronRight,
    Search as SearchIcon,
    Loader2,
    CheckCircle2,
    CircleDashed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CmsPage } from '@/types/cms';

interface PageManagerProps {
    onSelectPage: (page: CmsPage) => void;
}

/**
 * PageManager Component
 * Admin interface for managing CMS pages
 */
export const PageManager: React.FC<PageManagerProps> = ({ onSelectPage }) => {
    const [pages, setPages] = useState<CmsPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showNewPageModal, setShowNewPageModal] = useState(false);
    const [newPageData, setNewPageData] = useState({ title: '', slug: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/cms/pages');
            const data = await response.json();
            if (data.pages) {
                setPages(data.pages);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const response = await fetch('/api/admin/cms/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPageData),
            });
            if (response.ok) {
                const data = await response.json();
                setPages([data.page, ...pages]);
                setShowNewPageModal(false);
                setNewPageData({ title: '', slug: '' });
            }
        } catch (error) {
            console.error('Error creating page:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une page..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-titan-gold/50 transition-all font-mono text-sm"
                    />
                </div>
                <Button
                    onClick={() => setShowNewPageModal(true)}
                    className="bg-titan-gold text-black hover:bg-titan-gold/90 font-bold w-full md:w-auto"
                >
                    <Plus size={18} className="mr-2" />
                    Créer une Page
                </Button>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {pages
                            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
                            .map((page) => (
                                <motion.div
                                    key={page.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <GlassCard
                                        noPadding
                                        className="group relative h-full flex flex-col hover:border-titan-gold/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl"
                                        onClick={() => onSelectPage(page)}
                                    >
                                        {/* Page Preview Header */}
                                        <div className="h-24 bg-gradient-to-br from-white/5 via-black to-[#D4AF37]/5 flex items-center justify-center border-b border-white/5">
                                            <Layout size={32} className="text-gray-700 group-hover:text-titan-gold/50 transition-colors" />
                                        </div>

                                        <div className="p-6 space-y-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {page.is_published ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                            <CheckCircle2 size={10} /> LIVE
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
                                                            <CircleDashed size={10} /> DRAFT
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">ID: {page.id.split('-')[0]}</span>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black italic tracking-tight uppercase group-hover:text-titan-gold transition-colors">{page.title}</h3>
                                                <p className="text-xs font-mono text-gray-500">/{page.slug}</p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-400 capitalize">
                                                <span>Mise à jour le {new Date(page.updated_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>

                                        {/* Action Hover */}
                                        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                            <div className="h-10 w-10 rounded-full bg-titan-gold text-black flex items-center justify-center shadow-lg shadow-titan-gold/20">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>
            )}

            {/* New Page Modal */}
            {showNewPageModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg bg-black border border-white/10 rounded-3xl p-8 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-6">Nouvelle Page CMS</h2>
                        <form onSubmit={handleCreatePage} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Titre de la page</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-titan-gold/50 transition-all font-bold"
                                    placeholder="ex: Landing Page Pro"
                                    value={newPageData.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                                        setNewPageData({ title, slug });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">URL Slug</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono text-xs">/</span>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono text-gray-400 focus:outline-none focus:border-titan-gold/50 transition-all"
                                        value={newPageData.slug}
                                        onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewPageModal(false)}
                                    className="flex-1 border-white/10"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 bg-titan-gold text-black hover:bg-white font-bold"
                                >
                                    {creating ? <Loader2 className="animate-spin" /> : 'Créer la Page'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
