'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Trash2, Users, Search, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ClientTag {
    id: string;
    name: string;
    color: string;
    description?: string;
    user_count: number;
}

export default function AdminClientTagsPage() {
    const [tags, setTags] = useState<ClientTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedTag, setSelectedTag] = useState<ClientTag | null>(null);

    useEffect(() => { fetchTags(); }, []);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/admin/client-tags');
            const data = await res.json();
            setTags(data.tags || []);
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const deleteTag = async (tag: ClientTag) => {
        if (!confirm(`Supprimer le tag "${tag.name}" ?`)) return;
        await fetch(`/api/admin/client-tags?tag_id=${tag.id}`, { method: 'DELETE' });
        setTags(tags.filter(t => t.id !== tag.id));
        toast.success('Tag supprimé');
    };

    const totalUsers = tags.reduce((sum, t) => sum + t.user_count, 0);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Tag className="w-7 h-7 text-[#D4AF37]" />
                        Segmentation Clients
                    </h1>
                    <p className="text-gray-500">{tags.length} tags • {totalUsers} attributions</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouveau Tag
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tags.map(tag => (
                        <motion.div
                            key={tag.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl p-5 cursor-pointer hover:border-[#D4AF37]/30"
                            onClick={() => setSelectedTag(tag)}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                                <button onClick={(e) => { e.stopPropagation(); deleteTag(tag); }} className="text-red-400 hover:bg-red-500/10 p-1 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="font-bold" style={{ color: tag.color }}>{tag.name}</h3>
                            {tag.description && <p className="text-xs text-gray-500 mt-1">{tag.description}</p>}
                            <div className="mt-4 pt-3 border-t border-white/10">
                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {tag.user_count} utilisateurs
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showCreate && <CreateTagModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchTags(); }} />}
            </AnimatePresence>

            <AnimatePresence>
                {selectedTag && <TagUsersModal tag={selectedTag} onClose={() => setSelectedTag(null)} />}
            </AnimatePresence>
        </div>
    );
}

function CreateTagModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({ name: '', color: '#D4AF37', description: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.name) { toast.error('Nom requis'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/client-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', ...form }),
            });
            if (res.ok) { toast.success('Tag créé'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    const colors = ['#D4AF37', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Nouveau Tag</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nom</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VIP" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Couleur</label>
                        <div className="flex gap-2">
                            {colors.map(c => (
                                <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#D4AF37] text-black">{saving ? '...' : 'Créer'}</Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function TagUsersModal({ tag, onClose }: any) {
    const [searchEmail, setSearchEmail] = useState('');

    const assignToUser = async () => {
        if (!searchEmail) return;
        toast.info('Fonctionnalité: rechercher l\'utilisateur par email puis assigner');
        // In production: search user, then call /api/admin/client-tags POST { action: 'assign', user_id, tag_id }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e?: any) => e?.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ color: tag.color }}>{tag.name}</h2>
                    <button onClick={onClose}><X className="w-5 h-5" /></button>
                </div>
                <p className="text-gray-500 mb-4">{tag.user_count} utilisateurs avec ce tag</p>
                <div className="flex gap-2">
                    <input type="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} placeholder="Email utilisateur..." className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    <Button onClick={assignToUser}><UserPlus className="w-4 h-4" /></Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
