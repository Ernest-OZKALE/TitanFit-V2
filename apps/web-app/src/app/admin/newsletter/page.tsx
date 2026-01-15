'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Mail, Plus, Edit2, Trash2, Copy, Play, Pause, Calendar,
    Users, Eye, BarChart3, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Campaign {
    id: string;
    name: string;
    subject: string;
    status: string;
    total_recipients: number;
    total_sent: number;
    total_opened: number;
    total_clicked: number;
    scheduled_at?: string;
    sent_at?: string;
    created_at: string;
}

export default function NewsletterPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    useEffect(() => { fetchCampaigns(); }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/admin/newsletter');
            const data = await res.json();
            setCampaigns(data.campaigns || []);
            setStats(data.stats || {});
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const sendNow = async (c: Campaign) => {
        if (!confirm(`Envoyer "${c.name}" à ${c.total_recipients} abonnés ?`)) return;
        await fetch('/api/admin/newsletter', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: c.id, action: 'send_now' }),
        });
        fetchCampaigns();
        toast.success('Campagne envoyée !');
    };

    const duplicate = async (c: Campaign) => {
        await fetch('/api/admin/newsletter', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: c.id, action: 'duplicate' }),
        });
        fetchCampaigns();
        toast.success('Campagne dupliquée');
    };

    const deleteCampaign = async (c: Campaign) => {
        if (!confirm(`Supprimer "${c.name}" ?`)) return;
        await fetch(`/api/admin/newsletter?id=${c.id}`, { method: 'DELETE' });
        setCampaigns(campaigns.filter(x => x.id !== c.id));
        toast.success('Supprimée');
    };

    const getStatusBadge = (s: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-gray-500/20 text-gray-400',
            scheduled: 'bg-blue-500/20 text-blue-400',
            sending: 'bg-yellow-500/20 text-yellow-400',
            sent: 'bg-green-500/20 text-green-400',
        };
        return styles[s] || 'bg-gray-500/20';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="w-7 h-7 text-[#D4AF37]" />
                        Newsletter
                    </h1>
                    <p className="text-gray-500">{stats.active_subscribers || 0} abonnés actifs</p>
                </div>
                <Button onClick={() => { setEditingCampaign(null); setShowEditor(true); }} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouvelle Campagne
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard icon={<Mail />} label="Total" value={stats.total || 0} />
                <StatCard icon={<Edit2 />} label="Brouillons" value={stats.draft || 0} color="text-gray-400" />
                <StatCard icon={<Calendar />} label="Planifiées" value={stats.scheduled || 0} color="text-blue-400" />
                <StatCard icon={<Send />} label="Envoyées" value={stats.sent || 0} color="text-green-400" />
            </div>

            {/* Campaigns List */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Chargement...</div>
                ) : campaigns.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucune campagne</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {campaigns.map(c => (
                            <motion.div key={c.id} className="p-4 hover:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-medium">{c.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(c.status)}`}>{c.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{c.subject}</p>
                                        {c.status === 'sent' && (
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span><Users className="w-3 h-3 inline mr-1" />{c.total_sent} envoyés</span>
                                                <span><Eye className="w-3 h-3 inline mr-1" />{c.total_opened} ouverts ({c.total_sent > 0 ? Math.round((c.total_opened / c.total_sent) * 100) : 0}%)</span>
                                                <span>🖱️ {c.total_clicked} clics</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {c.status === 'draft' && (
                                            <Button size="sm" onClick={() => sendNow(c)} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => duplicate(c)}><Copy className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingCampaign(c); setShowEditor(true); }}><Edit2 className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm" className="text-red-400" onClick={() => deleteCampaign(c)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showEditor && (
                    <CampaignEditor
                        campaign={editingCampaign}
                        onClose={() => setShowEditor(false)}
                        onSave={() => { setShowEditor(false); fetchCampaigns(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon, label, value, color = 'text-[#D4AF37]' }: any) {
    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
            <div className={color}>{icon}</div>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function CampaignEditor({ campaign, onClose, onSave }: any) {
    const [form, setForm] = useState({
        name: campaign?.name || '',
        subject: campaign?.subject || '',
        preview_text: campaign?.preview_text || '',
        content_html: campaign?.content_html || '<h1 style="color:#D4AF37">Titre</h1><p>Votre contenu ici...</p>',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.name || !form.subject || !form.content_html) { toast.error('Champs requis'); return; }
        setSaving(true);
        try {
            const method = campaign ? 'PUT' : 'POST';
            const body = campaign ? { id: campaign.id, ...form } : form;
            const res = await fetch('/api/admin/newsletter', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) { toast.success('Enregistré'); onSave(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    // Email blocks for drag-and-drop (simplified version)
    const blocks = [
        { type: 'header', label: 'Titre', html: '<h1 style="color:#D4AF37;font-size:28px">Titre</h1>' },
        { type: 'text', label: 'Texte', html: '<p style="line-height:1.6">Votre texte ici...</p>' },
        { type: 'button', label: 'Bouton', html: '<a href="#" style="display:inline-block;padding:12px 24px;background:#D4AF37;color:#000;text-decoration:none;border-radius:8px;font-weight:bold">Cliquez ici</a>' },
        { type: 'divider', label: 'Séparateur', html: '<hr style="border:none;border-top:1px solid #333;margin:20px 0">' },
        { type: 'image', label: 'Image', html: '<img src="https://via.placeholder.com/600x200" style="max-width:100%;border-radius:8px" alt="Image">' },
    ];

    const addBlock = (html: string) => {
        setForm({ ...form, content_html: form.content_html + html });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex" onClick={onClose}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="ml-auto w-full max-w-4xl bg-zinc-900 border-l border-white/10 h-full flex flex-col" onClick={(e?: any) => e?.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{campaign ? 'Modifier' : 'Nouvelle'} campagne</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>Annuler</Button>
                        <Button onClick={handleSubmit} disabled={saving} className="bg-[#D4AF37] text-black">{saving ? '...' : 'Enregistrer'}</Button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar blocks */}
                    <div className="w-48 border-r border-white/10 p-4 space-y-2">
                        <p className="text-xs text-gray-500 uppercase mb-3">Blocs</p>
                        {blocks.map(b => (
                            <button key={b.type} onClick={() => addBlock(b.html)} className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-left">{b.label}</button>
                        ))}
                    </div>

                    {/* Main editor */}
                    <div className="flex-1 p-4 overflow-auto">
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nom de la campagne</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sujet</label>
                                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Texte d'aperçu</label>
                                <input type="text" value={form.preview_text} onChange={e => setForm({ ...form, preview_text: e.target.value })} placeholder="Visible dans la boîte de réception" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Contenu (HTML)</label>
                            <textarea value={form.content_html} onChange={e => setForm({ ...form, content_html: e.target.value })} rows={12} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm" />
                        </div>

                        {/* Preview */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-2">Aperçu</p>
                            <div className="bg-white text-black p-6 rounded-lg" dangerouslySetInnerHTML={{ __html: form.content_html }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
