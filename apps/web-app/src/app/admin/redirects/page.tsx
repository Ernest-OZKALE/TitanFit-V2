'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Plus, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Redirect {
    id: string;
    source_path: string;
    target_path: string;
    status_code: number;
    hits: number;
    is_active: boolean;
    created_at: string;
}

export default function RedirectsPage() {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => { fetchRedirects(); }, []);

    const fetchRedirects = async () => {
        try {
            const res = await fetch('/api/admin/redirects');
            const data = await res.json();
            setRedirects(data.redirects || []);
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const deleteRedirect = async (id: string) => {
        if (!confirm('Supprimer cette redirection ?')) return;
        await fetch(`/api/admin/redirects?id=${id}`, { method: 'DELETE' });
        setRedirects(redirects.filter(r => r.id !== id));
        toast.success('Supprimée');
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shuffle className="w-7 h-7 text-[#D4AF37]" />
                        Redirections URL
                    </h1>
                    <p className="text-gray-500">Gérez les codes 301/302 pour le SEO</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouvelle
                </Button>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Source</th>
                            <th className="p-4">Cible</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Visites</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chargement...</td></tr>
                        ) : redirects.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucune redirection</td></tr>
                        ) : (
                            redirects.map(r => (
                                <tr key={r.id} className="hover:bg-white/5 text-sm">
                                    <td className="p-4 font-mono text-xs">{r.source_path}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-3 h-3 text-gray-500" />
                                            <span className="font-mono text-xs text-green-400">{r.target_path}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs ${r.status_code === 301 ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {r.status_code}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{r.hits}</td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => deleteRedirect(r.id)} className="text-red-400 w-8 h-8 p-0">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showCreate && <CreateRedirectModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchRedirects(); }} />}
            </AnimatePresence>
        </div>
    );
}

function CreateRedirectModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        source_path: '',
        target_path: '',
        status_code: '301',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.source_path || !form.target_path) { toast.error('URLs requises'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, status_code: parseInt(form.status_code) }),
            });
            if (res.ok) { toast.success('Redirection créée'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Nouvelle Redirection</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">URL Source (ancienne)</label>
                        <input type="text" value={form.source_path} onChange={e => setForm({ ...form, source_path: e.target.value })} placeholder="/old-page" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">URL Cible (nouvelle)</label>
                        <input type="text" value={form.target_path} onChange={e => setForm({ ...form, target_path: e.target.value })} placeholder="/new-page" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                        <select value={form.status_code} onChange={e => setForm({ ...form, status_code: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                            <option value="301">301 - Permanent (Recommandé SEO)</option>
                            <option value="302">302 - Temporaire</option>
                            <option value="307">307 - Temporaire (Moderne)</option>
                        </select>
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
