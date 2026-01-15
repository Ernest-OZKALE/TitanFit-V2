'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ToggleLeft,
    ToggleRight,
    Code,
    FileText,
    Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EmailTemplate {
    id: string;
    slug: string;
    name: string;
    subject: string;
    body_html: string;
    variables: string[];
    category: string;
    is_active: boolean;
}

export default function AdminEmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

    useEffect(() => { fetchTemplates(); }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/admin/email-templates');
            const data = await res.json();
            setTemplates(data.templates || []);
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const toggleActive = async (t: EmailTemplate) => {
        await fetch('/api/admin/email-templates', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: t.id, is_active: !t.is_active }),
        });
        setTemplates(templates.map(x => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
        toast.success(`Template ${t.is_active ? 'désactivé' : 'activé'}`);
    };

    const deleteTemplate = async (t: EmailTemplate) => {
        if (!confirm(`Supprimer "${t.name}" ?`)) return;
        await fetch(`/api/admin/email-templates?id=${t.id}`, { method: 'DELETE' });
        setTemplates(templates.filter(x => x.id !== t.id));
        toast.success('Supprimé');
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            transactional: 'bg-blue-500/20 text-blue-400',
            marketing: 'bg-purple-500/20 text-purple-400',
            notification: 'bg-green-500/20 text-green-400',
        };
        return colors[cat] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="w-7 h-7 text-[#D4AF37]" />
                        Email Templates
                    </h1>
                    <p className="text-gray-500">Personnalisez vos emails</p>
                </div>
                <Button onClick={() => { setEditingTemplate(null); setShowEditor(true); }} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouveau
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map(t => (
                        <motion.div key={t.id} whileHover={{ scale: 1.02 }} className={`bg-zinc-900/50 border rounded-xl p-5 ${t.is_active ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(t.category)}`}>{t.category}</span>
                                <button onClick={() => toggleActive(t)}>
                                    {t.is_active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-gray-500" />}
                                </button>
                            </div>
                            <h3 className="font-bold">{t.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 truncate">{t.subject}</p>
                            <code className="text-xs text-gray-600 mt-2 block">{t.slug}</code>

                            {t.variables?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {t.variables.slice(0, 3).map((v, i) => (
                                        <span key={i} className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{`{{${v}}}`}</span>
                                    ))}
                                    {t.variables.length > 3 && <span className="text-xs text-gray-500">+{t.variables.length - 3}</span>}
                                </div>
                            )}

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(t)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingTemplate(t); setShowEditor(true); }}><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => deleteTemplate(t)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <TemplateEditor
                        template={editingTemplate}
                        onClose={() => setShowEditor(false)}
                        onSave={() => { setShowEditor(false); fetchTemplates(); }}
                    />
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewTemplate && (
                    <TemplatePreview template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function TemplateEditor({ template, onClose, onSave }: any) {
    const [form, setForm] = useState({
        slug: template?.slug || '',
        name: template?.name || '',
        subject: template?.subject || '',
        body_html: template?.body_html || '<h1>Titre</h1><p>Contenu</p>',
        variables: template?.variables?.join(', ') || '',
        category: template?.category || 'transactional',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.slug || !form.name || !form.subject) { toast.error('Champs requis'); return; }
        setSaving(true);
        try {
            const method = template ? 'PUT' : 'POST';
            const body = template ? { id: template.id, ...form, variables: form.variables.split(',').map((v: string) => v.trim()).filter(Boolean) }
                : { ...form, variables: form.variables.split(',').map((v: string) => v.trim()).filter(Boolean) };
            const res = await fetch('/api/admin/email-templates', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) { toast.success('Enregistré'); onSave(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{template ? 'Modifier' : 'Nouveau'} template</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Slug</label>
                            <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s/g, '_') })} placeholder="welcome_email" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Catégorie</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                                <option value="transactional">Transactionnel</option>
                                <option value="marketing">Marketing</option>
                                <option value="notification">Notification</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nom</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Sujet</label>
                        <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Variables (séparées par virgule)</label>
                        <input type="text" value={form.variables} onChange={e => setForm({ ...form, variables: e.target.value })} placeholder="user_name, reset_link" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contenu HTML</label>
                        <textarea value={form.body_html} onChange={e => setForm({ ...form, body_html: e.target.value })} rows={8} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm" />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8860B]">{saving ? '...' : 'Enregistrer'}</Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function TemplatePreview({ template, onClose }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white text-black rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={(e?: any) => e?.stopPropagation()}>
                <div className="p-4 border-b bg-gray-100">
                    <p className="text-sm text-gray-500">Sujet: <strong>{template.subject}</strong></p>
                </div>
                <div className="p-6" dangerouslySetInnerHTML={{ __html: template.body_html }} />
            </motion.div>
        </motion.div>
    );
}
