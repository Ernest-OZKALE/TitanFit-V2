'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Edit2, Trash2, Pin, Lock, AlertTriangle, DollarSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ClientNote {
    id: string;
    content: string;
    note_type: string;
    is_pinned: boolean;
    is_private: boolean;
    created_at: string;
    updated_at: string;
    author?: {
        display_name?: string;
        email?: string;
    };
}

interface ClientNotesProps {
    clientId: string;
}

export default function ClientNotesWidget({ clientId }: ClientNotesProps) {
    const [notes, setNotes] = useState<ClientNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingNote, setEditingNote] = useState<ClientNote | null>(null);

    React.useEffect(() => {
        if (clientId) fetchNotes();
    }, [clientId]);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`/api/admin/client-notes?client_id=${clientId}`);
            const data = await res.json();
            setNotes(data.notes || []);
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const togglePin = async (note: ClientNote) => {
        await fetch('/api/admin/client-notes', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: note.id, is_pinned: !note.is_pinned }),
        });
        fetchNotes();
    };

    const deleteNote = async (note: ClientNote) => {
        if (!confirm('Supprimer cette note ?')) return;
        await fetch(`/api/admin/client-notes?id=${note.id}`, { method: 'DELETE' });
        setNotes(notes.filter(n => n.id !== note.id));
        toast.success('Note supprimée');
    };

    const getNoteTypeIcon = (type: string) => {
        const icons: Record<string, React.ReactNode> = {
            general: <StickyNote className="w-4 h-4" />,
            billing: <DollarSign className="w-4 h-4" />,
            support: <MessageSquare className="w-4 h-4" />,
            warning: <AlertTriangle className="w-4 h-4" />,
            priority: <Pin className="w-4 h-4" />,
        };
        return icons[type] || <StickyNote className="w-4 h-4" />;
    };

    const getNoteTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            general: 'border-gray-500/30',
            billing: 'border-green-500/30 bg-green-500/5',
            support: 'border-blue-500/30 bg-blue-500/5',
            warning: 'border-red-500/30 bg-red-500/5',
            priority: 'border-[#D4AF37]/30 bg-[#D4AF37]/5',
        };
        return colors[type] || 'border-white/10';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-[#D4AF37]" />
                    Notes internes
                </h3>
                <Button size="sm" onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-4 text-gray-500 text-sm">Chargement...</div>
            ) : notes.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-white/10 rounded-lg">
                    Aucune note
                </div>
            ) : (
                <div className="space-y-2">
                    {notes.map(note => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg border ${getNoteTypeColor(note.note_type)}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                    <div className="mt-0.5 text-gray-400">{getNoteTypeIcon(note.note_type)}</div>
                                    <div className="flex-1">
                                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <span>{note.author?.display_name || note.author?.email || 'Admin'}</span>
                                            <span>•</span>
                                            <span>{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                                            {note.is_private && <span title="Note privée"><Lock className="w-3 h-3" /></span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => togglePin(note)} className={`p-1 rounded ${note.is_pinned ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}>
                                        <Pin className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingNote(note)} className="p-1 text-gray-500 hover:text-white">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteNote(note)} className="p-1 text-gray-500 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {(showCreate || editingNote) && (
                    <NoteEditorModal
                        clientId={clientId}
                        note={editingNote}
                        onClose={() => { setShowCreate(false); setEditingNote(null); }}
                        onSuccess={() => { setShowCreate(false); setEditingNote(null); fetchNotes(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function NoteEditorModal({ clientId, note, onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        content: note?.content || '',
        note_type: note?.note_type || 'general',
        is_pinned: note?.is_pinned || false,
        is_private: note?.is_private || false,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.content.trim()) { toast.error('Contenu requis'); return; }
        setSaving(true);
        try {
            const method = note ? 'PUT' : 'POST';
            const body = note ? { id: note.id, ...form } : { client_id: clientId, ...form };
            const res = await fetch('/api/admin/client-notes', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) { toast.success(note ? 'Modifiée' : 'Ajoutée'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{note ? 'Modifier' : 'Nouvelle'} note</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contenu</label>
                        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                        <select value={form.note_type} onChange={e => setForm({ ...form, note_type: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                            <option value="general">Général</option>
                            <option value="billing">Facturation</option>
                            <option value="support">Support</option>
                            <option value="warning">Attention</option>
                            <option value="priority">Priorité</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.is_pinned} onChange={e => setForm({ ...form, is_pinned: e.target.checked })} />
                            Épingler
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.is_private} onChange={e => setForm({ ...form, is_private: e.target.checked })} />
                            Privée (moi seul)
                        </label>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#D4AF37] text-black">{saving ? '...' : 'Enregistrer'}</Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Export standalone page
export function ClientNotesPage() {
    const [clientId, setClientId] = useState('');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <StickyNote className="w-7 h-7 text-[#D4AF37]" />
                Notes Clients
            </h1>
            <div className="max-w-md">
                <input
                    type="text"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    placeholder="ID du client..."
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 mb-4"
                />
                {clientId && <ClientNotesWidget clientId={clientId} />}
            </div>
        </div>
    );
}
