'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Send, Trash2, Users, Smartphone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    body: string;
    status: string;
    target_type: string;
    total_sent: number;
    total_delivered: number;
    total_clicked: number;
    scheduled_at?: string;
    sent_at?: string;
    created_at: string;
}

export default function PushNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/push-notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
            setStats(data.stats || {});
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const sendNow = async (n: Notification) => {
        if (!confirm(`Envoyer "${n.title}" maintenant ?`)) return;
        const res = await fetch('/api/admin/push-notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: n.id, action: 'send_now' }),
        });
        const data = await res.json();
        toast.success(data.message || 'Envoyée');
        fetchNotifications();
    };

    const deleteNotif = async (n: Notification) => {
        if (!confirm('Supprimer ?')) return;
        await fetch(`/api/admin/push-notifications?id=${n.id}`, { method: 'DELETE' });
        setNotifications(notifications.filter(x => x.id !== n.id));
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
                        <Bell className="w-7 h-7 text-[#D4AF37]" />
                        Notifications Push
                    </h1>
                    <p className="text-gray-500">{stats.active_tokens || 0} appareils enregistrés</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouvelle
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <p className="text-2xl font-bold mt-2">{stats.active_tokens || 0}</p>
                    <p className="text-sm text-gray-500">Appareils</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                    <Send className="w-5 h-5 text-green-400" />
                    <p className="text-2xl font-bold mt-2">{stats.sent || 0}</p>
                    <p className="text-sm text-gray-500">Envoyées</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <p className="text-2xl font-bold mt-2">{stats.scheduled || 0}</p>
                    <p className="text-sm text-gray-500">Planifiées</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Chargement...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucune notification</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map(n => (
                            <div key={n.id} className="p-4 hover:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-medium">{n.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(n.status)}`}>{n.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{n.body}</p>
                                        {n.status === 'sent' && (
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span><Users className="w-3 h-3 inline mr-1" />{n.total_sent} envoyées</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {n.status === 'draft' && (
                                            <Button size="sm" onClick={() => sendNow(n)} className="bg-green-500/20 text-green-400">
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-400" onClick={() => deleteNotif(n)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreate && <CreateNotificationModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchNotifications(); }} />}
            </AnimatePresence>
        </div>
    );
}

function CreateNotificationModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        title: '',
        body: '',
        target_type: 'all',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.title || !form.body) { toast.error('Titre et message requis'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/push-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) { toast.success('Créée'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Nouvelle notification</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Titre</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="C'est l'heure!" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Message</label>
                        <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={3} placeholder="N'oublie pas ton entraînement..." className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Cible</label>
                        <select value={form.target_type} onChange={e => setForm({ ...form, target_type: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                            <option value="all">Tous les utilisateurs</option>
                            <option value="segment">Segment spécifique</option>
                            <option value="user">Utilisateur unique</option>
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
