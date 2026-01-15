'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket,
    Plus,
    Trash2,
    Edit2,
    Copy,
    Check,
    ToggleLeft,
    ToggleRight,
    Percent,
    DollarSign,
    Gift,
    Calendar,
    Users,
    TrendingUp,
    Search,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PromoCode {
    id: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed' | 'free_trial';
    discount_value: number;
    max_uses?: number;
    current_uses: number;
    valid_from?: string;
    valid_until?: string;
    is_active: boolean;
    usage_count?: number;
    created_at: string;
}

export default function AdminPromoCodesPage() {
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const response = await fetch('/api/admin/promo-codes?stats=true');
            const data = await response.json();
            setCodes(data.codes || []);
        } catch (error) {
            console.error('Error fetching codes:', error);
            toast.error('Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (code: PromoCode) => {
        try {
            await fetch('/api/admin/promo-codes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: code.id, is_active: !code.is_active }),
            });
            setCodes(codes.map(c =>
                c.id === code.id ? { ...c, is_active: !c.is_active } : c
            ));
            toast.success(`Code ${code.is_active ? 'désactivé' : 'activé'}`);
        } catch {
            toast.error('Erreur');
        }
    };

    const deleteCode = async (code: PromoCode) => {
        if (!confirm(`Supprimer le code ${code.code} ?`)) return;

        try {
            await fetch(`/api/admin/promo-codes?id=${code.id}`, { method: 'DELETE' });
            setCodes(codes.filter(c => c.id !== code.id));
            toast.success('Code supprimé');
        } catch {
            toast.error('Erreur');
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copié !');
    };

    const filteredCodes = codes.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: codes.length,
        active: codes.filter(c => c.is_active).length,
        totalUsage: codes.reduce((sum, c) => sum + (c.usage_count || c.current_uses || 0), 0),
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="w-7 h-7 text-[#D4AF37]" />
                        Codes Promo
                    </h1>
                    <p className="text-gray-500">Gérez vos codes promotionnels</p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Code
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<Ticket />} label="Total codes" value={stats.total} />
                <StatCard icon={<Check />} label="Actifs" value={stats.active} color="text-green-400" />
                <StatCard icon={<Users />} label="Utilisations" value={stats.totalUsage} color="text-blue-400" />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Rechercher un code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-white/10 rounded-xl
                             focus:border-[#D4AF37]/50 focus:outline-none"
                />
            </div>

            {/* Codes List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Chargement...</div>
                    ) : filteredCodes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Aucun code promo</p>
                        </div>
                    ) : (
                        filteredCodes.map((code) => (
                            <PromoCodeRow
                                key={code.id}
                                code={code}
                                onToggle={() => toggleActive(code)}
                                onEdit={() => setEditingCode(code)}
                                onDelete={() => deleteCode(code)}
                                onCopy={() => copyCode(code.code)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreate || editingCode) && (
                    <PromoCodeModal
                        code={editingCode}
                        onClose={() => {
                            setShowCreate(false);
                            setEditingCode(null);
                        }}
                        onSave={() => {
                            setShowCreate(false);
                            setEditingCode(null);
                            fetchCodes();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon, label, value, color = 'text-[#D4AF37]' }: any) {
    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
            <div className={`${color} mb-2`}>{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function PromoCodeRow({ code, onToggle, onEdit, onDelete, onCopy }: any) {
    const discountLabel = code.discount_type === 'percentage'
        ? `${code.discount_value}%`
        : code.discount_type === 'fixed'
            ? `${code.discount_value}€`
            : 'Essai gratuit';

    const isExpired = code.valid_until && new Date(code.valid_until) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`bg-zinc-800/50 border rounded-xl p-4 ${!code.is_active || isExpired ? 'border-white/5 opacity-60' : 'border-white/10'
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Code & Copy */}
                    <div
                        className="bg-zinc-900 px-4 py-2 rounded-lg font-mono text-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                        onClick={onCopy}
                        title="Cliquer pour copier"
                    >
                        {code.code}
                        <Copy className="w-4 h-4 inline ml-2 opacity-50" />
                    </div>

                    {/* Discount Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${code.discount_type === 'percentage' ? 'bg-green-500/20 text-green-400' :
                        code.discount_type === 'fixed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                        }`}>
                        {discountLabel}
                    </span>

                    {/* Usage */}
                    <span className="text-sm text-gray-500">
                        {code.current_uses || 0}{code.max_uses ? `/${code.max_uses}` : ''} utilisations
                    </span>

                    {/* Expiry */}
                    {isExpired && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">Expiré</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title={code.is_active ? 'Désactiver' : 'Activer'}
                    >
                        {code.is_active ? (
                            <ToggleRight className="w-6 h-6 text-green-400" />
                        ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-500" />
                        )}
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {code.description && (
                <p className="text-sm text-gray-500 mt-2">{code.description}</p>
            )}
        </motion.div>
    );
}

function PromoCodeModal({ code, onClose, onSave }: any) {
    const [form, setForm] = useState({
        code: code?.code || '',
        description: code?.description || '',
        discount_type: code?.discount_type || 'percentage',
        discount_value: code?.discount_value || 10,
        max_uses: code?.max_uses || '',
        valid_until: code?.valid_until ? code.valid_until.split('T')[0] : '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.code || !form.discount_value) {
            toast.error('Code et valeur requis');
            return;
        }

        setSaving(true);
        try {
            const method = code ? 'PUT' : 'POST';
            const body = code ? { id: code.id, ...form } : form;

            const response = await fetch('/api/admin/promo-codes', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                toast.success(code ? 'Code mis à jour' : 'Code créé');
                onSave();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erreur');
            }
        } catch {
            toast.error('Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                onClick={(e?: any) => e?.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">
                    {code ? 'Modifier le code' : 'Nouveau code promo'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Code</label>
                        <input
                            type="text"
                            value={form.code}
                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            placeholder="SUMMER2026"
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Réduction été 2026"
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                value={form.discount_type}
                                onChange={e => setForm({ ...form, discount_type: e.target.value })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                            >
                                <option value="percentage">Pourcentage</option>
                                <option value="fixed">Montant fixe</option>
                                <option value="free_trial">Essai gratuit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Valeur</label>
                            <input
                                type="number"
                                value={form.discount_value}
                                onChange={e => setForm({ ...form, discount_value: Number(e.target.value) })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Max utilisations</label>
                            <input
                                type="number"
                                value={form.max_uses}
                                onChange={e => setForm({ ...form, max_uses: e.target.value })}
                                placeholder="Illimité"
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Expire le</label>
                            <input
                                type="date"
                                value={form.valid_until}
                                onChange={e => setForm({ ...form, valid_until: e.target.value })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                    >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
