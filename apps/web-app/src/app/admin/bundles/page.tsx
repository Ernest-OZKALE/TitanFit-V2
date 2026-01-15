'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Search, Edit2, Archive, DollarSign, Percent, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Bundle {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount_type: string;
    discount_value: number;
    is_active: boolean;
    items: {
        quantity: number;
        product: { name: string; price: number; }
    }[];
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => { fetchBundles(); }, []);

    const fetchBundles = async () => {
        try {
            const res = await fetch('/api/admin/bundles');
            const data = await res.json();
            setBundles(data.bundles || []);
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const deleteBundle = async (item: Bundle) => {
        if (!confirm('Supprimer ce pack ?')) return;
        await fetch(`/api/admin/bundles?id=${item.id}`, { method: 'DELETE' });
        setBundles(bundles.filter(b => b.id !== item.id));
        toast.success('Pack supprimé');
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-7 h-7 text-[#D4AF37]" />
                        Packs & Bundles
                    </h1>
                    <p className="text-gray-500">Créez des offres groupées pour augmenter le panier moyen</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouveau Pack
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : bundles.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 border border-white/10 rounded-xl">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-500">Aucun pack créé</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bundles.map(bundle => (
                        <motion.div
                            key={bundle.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl p-5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{bundle.name}</h3>
                                    <p className="text-2xl font-bold text-[#D4AF37]">{bundle.price}€</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${bundle.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20'}`}>
                                    {bundle.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {bundle.items?.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-zinc-800 p-2 rounded">
                                        <span>{item.quantity}x {item.product?.name || 'Produit'}</span>
                                        <span className="text-gray-500">{item.product?.price}€</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                <div className="flex-1 text-xs text-gray-500">
                                    {bundle.discount_type === 'percentage'
                                        ? `-${bundle.discount_value}%`
                                        : `-${bundle.discount_value}€`
                                    } de réduction
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => deleteBundle(bundle)} className="text-red-400 hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showCreate && <CreateBundleModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchBundles(); }} />}
            </AnimatePresence>
        </div>
    );
}

function CreateBundleModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        price: '',
        discount_value: '10',
        discount_type: 'percentage',
        // In reality, we would fetch products and allow selection
        // For simplicity, we just create the bundle shell
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.name || !form.price) { toast.error('Champs requis'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/bundles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    slug: form.slug || form.name.toLowerCase().replace(/\s/g, '-'),
                    items: [], // Would normally be selected items
                }),
            });
            if (res.ok) { toast.success('Pack créé'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Nouveau Pack</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nom du pack</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Pack Découverte" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Prix de vente</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg pl-10 pr-4 py-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type de réduction</label>
                            <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                                <option value="percentage">Pourcentage %</option>
                                <option value="fixed_amount">Montant fixe €</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Valeur réduction</label>
                            <input type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                        </div>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-500">
                        ⚠️ Note: La sélection des produits sera disponible après création (version démo).
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
