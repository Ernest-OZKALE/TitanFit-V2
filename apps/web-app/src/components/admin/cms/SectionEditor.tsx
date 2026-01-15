'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
    Save,
    X,
    Image as ImageIcon,
    Settings,
    ArrowLeft,
    Type,
    Palette,
    Info,
    Layout,
    Eye,
    Plus,
    Trash2,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CmsSection, CmsMediaLibrary } from '@/types/cms';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

interface SectionEditorProps {
    section: CmsSection;
    onClose: () => void;
    onSave: (data: Partial<CmsSection>) => void;
}

/**
 * SectionEditor Component
 * Dynamic form for editing CMS section content and style properties
 */
export const SectionEditor: React.FC<SectionEditorProps> = ({ section, onClose, onSave }) => {
    const [title, setTitle] = useState(section.title || '');
    const [subtitle, setSubtitle] = useState(section.subtitle || '');
    const [description, setDescription] = useState(section.description || '');
    const [content, setContent] = useState<Record<string, any>>(section.content || {});
    const [styleConfig, setStyleConfig] = useState<Record<string, any>>(section.style_config || {});

    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
    const [showMediaPicker, setShowMediaPicker] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const data = {
            id: section.id,
            title,
            subtitle,
            description,
            content,
            style_config: styleConfig
        };
        await onSave(data);
        setSaving(false);
    };

    const updateContent = (key: string, value: any) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key: string, value: any) => {
        setStyleConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleMediaSelect = (file: CmsMediaLibrary) => {
        if (showMediaPicker) {
            updateContent(showMediaPicker, file.public_url);
            setShowMediaPicker(null);
        }
    };

    // Helper for rendering dynamic inputs based on section type
    const renderContentFields = () => {
        switch (section.section_type) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Badge (Highlight)</label>
                            <input
                                type="text"
                                value={content.badge || ''}
                                onChange={(e) => updateContent('badge', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-titan-gold/50"
                                placeholder="ex: NOUVEAUTÉ 2026"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Main Heading (Line 1)</label>
                            <input
                                type="text"
                                value={content.heading_line_1 || ''}
                                onChange={(e) => updateContent('heading_line_1', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-titan-gold/50"
                                placeholder="ex: DEVENEZ"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Heading Gradient (Titan Gold)</label>
                            <input
                                type="text"
                                value={content.heading_gradient || ''}
                                onChange={(e) => updateContent('heading_gradient', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-titan-gold font-bold focus:outline-none focus:border-titan-gold/50"
                                placeholder="ex: L'EXCEPTION"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Image de fond / Vidéo</label>
                            <Button
                                variant="outline"
                                className="w-full h-24 border-dashed border-white/10 bg-white/5 hover:bg-white/10 flex flex-col gap-2"
                                onClick={() => setShowMediaPicker('background_url')}
                            >
                                {content.background_url ? (
                                    <div className="flex items-center gap-4">
                                        <img src={content.background_url} alt="BG" className="h-16 aspect-video object-cover rounded-lg" />
                                        <span className="text-[9px] font-mono text-gray-500 truncate max-w-[150px]">{content.background_url}</span>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon size={20} className="text-gray-500" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">Choisir Média</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                );
            case 'bento_grid':
                return (
                    <div className="space-y-6">
                        <p className="text-xs text-gray-500 italic">Configurez les éléments de votre grille bento ci-dessous.</p>
                        {/* More complex bento fields could go here */}
                        <div className="p-4 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                            <Layout size={24} className="mx-auto text-gray-700 mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Éditeur de Grille Bento prochainement...</span>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Titre Global</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-titan-gold/50 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-titan-gold/50 resize-none"
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-titan-gold/70">{section.section_type}</span>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase truncate max-w-[300px]">
                            Édition Section : {section.component_name || section.id.split('-')[0]}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-titan-gold text-black hover:bg-white font-bold px-6"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                        Sauvegarder
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className="w-full max-w-2xl border-r border-white/5 flex flex-col bg-black/20">
                    <div className="flex p-4 border-b border-white/5 gap-2">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white/10 text-titan-gold' : 'text-gray-600'}`}
                        >
                            <Type size={14} className="inline mr-2" /> Contenu
                        </button>
                        <button
                            onClick={() => setActiveTab('style')}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'style' ? 'bg-white/10 text-titan-gold' : 'text-gray-600'}`}
                        >
                            <Palette size={14} className="inline mr-2" /> Styles
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'content' ? (
                            <div className="space-y-10">
                                {/* Base Fields */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-titan-gold/50">
                                        <Info size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Informations Générales</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Nom Administratif (Tag)</label>
                                            <input
                                                type="text"
                                                defaultValue={section.component_name || ''}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-500 focus:outline-none"
                                                placeholder="ex: Home Hero v2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Dynamic Section Fields */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-titan-gold/50">
                                        <Layout size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Contenu Spécifique ({section.section_type})</span>
                                    </div>
                                    {renderContentFields()}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-titan-gold/50">
                                        <Palette size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Configuration Visuelle</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Padding Top</label>
                                            <select
                                                value={styleConfig.padding_top || 'pt-20'}
                                                onChange={(e) => updateStyle('padding_top', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                            >
                                                <option value="pt-0">Aucun</option>
                                                <option value="pt-10">Petit</option>
                                                <option value="pt-20">Standard</option>
                                                <option value="pt-40">Large</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Padding Bottom</label>
                                            <select
                                                value={styleConfig.padding_bottom || 'pb-20'}
                                                onChange={(e) => updateStyle('padding_bottom', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                            >
                                                <option value="pb-0">Aucun</option>
                                                <option value="pb-10">Petit</option>
                                                <option value="pb-20">Standard</option>
                                                <option value="pb-40">Large</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Background Style</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['black', 'titanium', 'glass'].map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => updateStyle('bg_style', style)}
                                                    className={`py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${styleConfig.bg_style === style ? 'bg-titan-gold/20 border-titan-gold text-titan-gold' : 'bg-white/5 border-white/10 text-gray-600'}`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Preview (Simulated) */}
                <div className="flex-1 bg-[#0a0a0a] overflow-hidden flex flex-col">
                    <div className="h-10 border-b border-white/5 bg-black/50 flex items-center justify-center px-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Simulateur de Rendu</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 flex items-center justify-center">
                        {/* Mocking the actual component looks */}
                        <div className="w-full max-w-4xl opacity-50 pointer-events-none grayscale">
                            <div className="h-96 border border-dashed border-white/10 rounded-[3rem] flex items-center justify-center">
                                <Eye size={48} className="text-gray-800" />
                                <span className="absolute mt-20 text-[10px] font-bold tracking-widest text-gray-700 uppercase">Aperçu dynamique non disponible en mode édition</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Picker */}
            <AnimatePresence>
                {showMediaPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-6xl h-[80vh] bg-black border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="font-black italic tracking-tight uppercase">Choisir un Média</h3>
                                <button
                                    onClick={() => setShowMediaPicker(null)}
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
