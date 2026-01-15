'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    FileText,
    Settings,
    ArrowLeft,
    Search,
    Plus,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { BlogList } from '@/components/admin/BlogList';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { toast } from 'sonner';

export default function AdminContentPage() {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editingPost, setEditingPost] = useState<any>(null);

    const handleCreate = () => {
        setEditingPost(null);
        setView('editor');
    };

    const handleEdit = (post: any) => {
        setEditingPost(post);
        setView('editor');
    };

    const handleSave = async (data: any) => {
        try {
            const method = data.id ? 'PATCH' : 'POST';
            const response = await fetch('/api/admin/blog', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(data.id ? 'Article mis à jour !' : 'Article publié !');
                setView('list');
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
                            Gestion <span className="text-titan-gold">Contenu</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em]">
                            Système de Publication d'Articles • TitanFit V2
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    >
                        <div className="p-3 bg-titan-gold/10 rounded-xl text-titan-gold">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-mono text-gray-500 text-center">Moteur de Blog</p>
                            <p className="text-xl font-bold font-mono tracking-tighter">Markdown v2.0</p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Areas */}
                <AnimatePresence mode="wait">
                    {view === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <BlogList onEdit={handleEdit} onCreate={handleCreate} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <BlogEditor
                                post={editingPost}
                                onClose={() => setView('list')}
                                onSave={handleSave}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SEO Tips Footer */}
                <div className="mt-20 pt-8 border-t border-white/5 grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-titan-gold text-[10px] font-bold uppercase tracking-widest">
                            <BarChart3 size={14} /> Stratégie SEO
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                            Optimisez vos Meta Tags pour augmenter le trafic organique. Les Slugs doivent être descriptifs.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                            <Layout size={14} /> Content Mix
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                            Alternez entre articles informatifs, guides pratiques et cas clients pour un engagement maximal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
