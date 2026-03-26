'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
    Plus,
    GripVertical,
    Settings,
    Trash2,
    Eye,
    EyeOff,
    ArrowLeft,
    Layers,
    Type,
    Image as ImageIcon,
    LayoutGrid,
    CheckCircle2,
    Loader2,
    MoveUp,
    MoveDown
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { CmsPage, CmsSection } from '@/types/cms';

interface SectionListProps {
    page: CmsPage;
    onBack: () => void;
    onEditSection: (section: CmsSection) => void;
}

/**
 * SectionList Component
 * Admin interface for managing sections within a CMS page
 */
export const SectionList: React.FC<SectionListProps> = ({ page, onBack, onEditSection }) => {
    const [sections, setSections] = useState<CmsSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        fetchSections();
    }, [page.id]);

    const fetchSections = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/cms/pages/${page.id}`);
            const data = await response.json();
            if (data.sections) {
                setSections(data.sections);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSection = async (type: string) => {
        try {
            const response = await fetch('/api/admin/cms/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_id: page.id,
                    section_type: type,
                    order_index: sections.length
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setSections([...sections, data.section]);
            }
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!confirm('Supprimer cette section ?')) return;
        try {
            const response = await fetch(`/api/admin/cms/sections?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSections(sections.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const toggleVisibility = async (section: CmsSection) => {
        try {
            const response = await fetch('/api/admin/cms/sections', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: section.id,
                    is_visible: !section.is_visible
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setSections(sections.map(s => s.id === section.id ? data.section : s));
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;

        const newSections = [...sections];
        const temp = newSections[index];
        newSections[index] = newSections[newIndex];
        newSections[newIndex] = temp;

        // Update order_index
        const updatedSections = newSections.map((s, i) => ({ ...s, order_index: i }));
        setSections(updatedSections);
        saveOrder(updatedSections);
    };

    const saveOrder = async (updatedSections: CmsSection[]) => {
        setReordering(true);
        try {
            // Bulk update not directly supported in this API version, so we send multiple patches or just rely on state for now
            // For production, a bulk order API would be better.
            const promises = updatedSections.map(s =>
                fetch('/api/admin/cms/sections', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: s.id, order_index: s.order_index })
                })
            );
            await Promise.all(promises);
        } catch (error) {
            console.error('Error saving order:', error);
        } finally {
            setReordering(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'hero': return <ImageIcon size={16} />;
            case 'bento_grid': return <LayoutGrid size={16} />;
            default: return <Layers size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{page.title}</h2>
                        <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Structure de la Page</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        <Button
                            onClick={() => handleAddSection('hero')}
                            size="sm"
                            variant="ghost"
                            className="text-[10px] font-bold uppercase tracking-wider h-8"
                        >
                            + Hero
                        </Button>
                        <Button
                            onClick={() => handleAddSection('bento_grid')}
                            size="sm"
                            variant="ghost"
                            className="text-[10px] font-bold uppercase tracking-wider h-8"
                        >
                            + Bento
                        </Button>
                        <Button
                            onClick={() => handleAddSection('features')}
                            size="sm"
                            variant="ghost"
                            className="text-[10px] font-bold uppercase tracking-wider h-8"
                        >
                            + Custom
                        </Button>
                    </div>
                </div>
            </div>

            {/* Section List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : sections.length > 0 ? (
                <div className="space-y-3">
                    <AnimatePresence>
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <GlassCard
                                    noPadding
                                    className={`group flex items-center p-4 border-white/5 hover:border-titan-gold/40 transition-all ${!section.is_visible ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex flex-col gap-1 text-gray-700">
                                            <button
                                                onClick={() => moveSection(index, 'up')}
                                                disabled={index === 0}
                                                className="hover:text-titan-gold disabled:opacity-0 transition-colors"
                                            >
                                                <MoveUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveSection(index, 'down')}
                                                disabled={index === sections.length - 1}
                                                className="hover:text-titan-gold disabled:opacity-0 transition-colors"
                                            >
                                                <MoveDown size={14} />
                                            </button>
                                        </div>

                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-titan-gold border border-white/10">
                                            {getIcon(section.section_type)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-titan-gold/70">{section.section_type}</span>
                                                {section.title && <span className="text-xs text-gray-500">• {section.title}</span>}
                                            </div>
                                            <h4 className="font-bold text-sm tracking-tight">{section.component_name || 'Sans Nom'}</h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pr-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5"
                                            onClick={() => toggleVisibility(section)}
                                        >
                                            {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5"
                                            onClick={() => onEditSection(section)}
                                        >
                                            <Settings size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleDeleteSection(section.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <Layers size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Aucune section configurée</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => handleAddSection('hero')} className="border-white/5">Ajouter Hero</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddSection('bento_grid')} className="border-white/5">Ajouter Bento</Button>
                    </div>
                </div>
            )}

            {reordering && (
                <div className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-black border border-titan-gold/50 rounded-full shadow-2xl shadow-titan-gold/20 animate-pulse">
                    <Loader2 size={16} className="text-titan-gold animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-titan-gold">Mise à jour de l'ordre...</span>
                </div>
            )}
        </div>
    );
};
