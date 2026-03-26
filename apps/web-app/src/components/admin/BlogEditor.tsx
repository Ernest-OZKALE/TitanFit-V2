'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
    Save,
    X,
    Image as ImageIcon,
    Settings,
    Eye,
    Edit3,
    ArrowLeft,
    Globe,
    Lock,
    Type,
    Link as LinkIcon,
    Smartphone,
    Monitor,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { MediaLibrary } from './MediaLibrary';
import { CmsMediaLibrary } from '@/types/cms';

interface BlogEditorProps {
    post?: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

/**
 * BlogEditor Component
 * Advanced Markdown Editor with Split-View and Media Integration
 */
export const BlogEditor: React.FC<BlogEditorProps> = ({ post, onClose, onSave }) => {
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [status, setStatus] = useState(post?.status || 'draft');
    const [featuredImage, setFeaturedImage] = useState<string | null>(post?.featured_image || null);
    const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
    const [metaDesc, setMetaDesc] = useState(post?.meta_description || '');

    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [saving, setSaving] = useState(false);

    // Auto-generate slug from title
    useEffect(() => {
        if (!post) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            setSlug(generatedSlug);
        }
    }, [title, post]);

    const handleSave = async () => {
        setSaving(true);
        const data = {
            id: post?.id,
            title,
            slug,
            content,
            status,
            featured_image: featuredImage,
            meta_title: metaTitle,
            meta_description: metaDesc
        };
        await onSave(data);
        setSaving(false);
    };

    const handleMediaSelect = (file: CmsMediaLibrary) => {
        setFeaturedImage(file.public_url);
        setShowMediaPicker(false);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col">
            {/* Header / Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white truncate max-w-[300px]">
                        {post ? `Édition: ${post.title}` : 'Nouvel Article'}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mr-4">
                        <button
                            onClick={() => setViewMode('edit')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Edit3 size={14} className="inline mr-2" /> ÉDIT
                        </button>
                        <button
                            onClick={() => setViewMode('split')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Monitor size={14} className="inline mr-2" /> SPLIT
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Eye size={14} className="inline mr-2" /> VUE
                        </button>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-titan-gold text-black hover:bg-white font-bold px-6"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                        {post ? 'Mettre à jour' : 'Publier'}
                    </Button>
                </div>
            </div>

            {/* Main Editor Section */}
            <div className="flex-1 flex overflow-hidden">
                {/* Secondary Sidebar (Settings) */}
                <div className="w-80 border-r border-white/5 bg-black/40 flex flex-col">
                    <div className="flex p-4 border-b border-white/5 gap-2">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white/10 text-titan-gold shadow-lg shadow-titan-gold/5' : 'text-gray-600'}`}
                        >
                            <Type size={14} className="inline mr-2" /> Contenu
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white/10 text-titan-gold shadow-lg shadow-titan-gold/5' : 'text-gray-600'}`}
                        >
                            <Settings size={14} className="inline mr-2" /> Config
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {activeTab === 'content' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Titre de l'article</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-titan-gold/50 transition-all font-bold"
                                        placeholder="Le futur de la musculation..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">URL Slug</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-gray-400 focus:outline-none focus:border-titan-gold/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Image à la une</label>
                                    <button
                                        onClick={() => setShowMediaPicker(true)}
                                        className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/5 bg-white/5 group hover:bg-white/10 hover:border-titan-gold/30 transition-all overflow-hidden relative"
                                    >
                                        {featuredImage ? (
                                            <img src={featuredImage} className="w-full h-full object-cover" alt="Featured" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                                                <ImageIcon size={24} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">Sélectionner Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Changer l'image</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Statut de publication</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setStatus('draft')}
                                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${status === 'draft' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-gray-600'}`}
                                        >
                                            Brouillon
                                        </button>
                                        <button
                                            onClick={() => setStatus('published')}
                                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${status === 'published' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-600'}`}
                                        >
                                            Publié
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Meta Title (SEO)</label>
                                    <input
                                        type="text"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                                        placeholder="Optimisez votre CTR..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Description SEO</label>
                                    <textarea
                                        rows={4}
                                        value={metaDesc}
                                        onChange={(e) => setMetaDesc(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white resize-none"
                                        placeholder="Résumé de l'article pour Google..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor / Canvas */}
                <div className="flex-1 flex overflow-hidden">
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className={`flex-1 flex flex-col bg-white/[0.02] ${viewMode === 'split' ? 'border-r border-white/5' : ''}`}>
                            <textarea
                                className="flex-1 w-full bg-transparent p-10 text-lg font-mono text-gray-300 resize-none focus:outline-none leading-relaxed custom-scrollbar"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="# Commencez à écrire en Markdown..."
                            />
                        </div>
                    )}

                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div className="flex-1 bg-black overflow-y-auto custom-scrollbar">
                            <div className="max-w-2xl mx-auto py-20 px-10 prose prose-invert prose-titan prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-a:text-titan-gold prose-strong:text-white">
                                {featuredImage && (
                                    <img
                                        src={featuredImage}
                                        className="w-full aspect-video rounded-3xl object-cover mb-10 shadow-2xl shadow-titan-gold/5 border border-white/10"
                                        alt=""
                                    />
                                )}
                                <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">
                                    {title || 'Titre de l\'article'}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-10 border-b border-white/5 pb-6">
                                    <span>Par Admin TitanFit</span>
                                    <span>•</span>
                                    <span>{new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                                <ReactMarkdown>
                                    {content || '*Le contenu apparaîtra ici...*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Media Picker Modal */}
            <AnimatePresence>
                {showMediaPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-6xl h-[80vh] bg-black border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="font-black italic tracking-tight uppercase">Choisir un Média</h3>
                                <button
                                    onClick={() => setShowMediaPicker(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <MediaLibrary
                                    allowSelection
                                    onSelect={handleMediaSelect}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
