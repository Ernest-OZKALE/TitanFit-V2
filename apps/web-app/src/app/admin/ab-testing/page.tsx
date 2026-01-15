'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical, Plus, Play, Pause, Trophy, BarChart3,
    TrendingUp, TrendingDown, Target, Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ABTest {
    id: string;
    name: string;
    description?: string;
    test_type: string;
    status: string;
    traffic_split: number;
    target_metric: string;
    started_at?: string;
    ended_at?: string;
    winner_variant_id?: string;
    created_at: string;
}

interface Variant {
    id: string;
    name: string;
    is_control: boolean;
    impressions: number;
    conversions: number;
    content: any;
}

interface Analysis {
    significant: boolean;
    confidenceLevel: number;
    winner: string | null;
    lift: number;
}

export default function ABTestingPage() {
    const [tests, setTests] = useState<ABTest[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);

    useEffect(() => { fetchTests(); }, []);

    const fetchTests = async () => {
        try {
            const res = await fetch('/api/admin/ab-tests');
            const data = await res.json();
            setTests(data.tests || []);
            setStats(data.stats || {});
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const updateStatus = async (test: ABTest, action: string) => {
        await fetch('/api/admin/ab-tests', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: test.id, action }),
        });
        fetchTests();
        toast.success(`Test ${action === 'start' ? 'démarré' : action === 'pause' ? 'en pause' : 'terminé'}`);
    };

    const getStatusColor = (s: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-500/20 text-gray-400',
            running: 'bg-green-500/20 text-green-400',
            paused: 'bg-yellow-500/20 text-yellow-400',
            completed: 'bg-blue-500/20 text-blue-400',
        };
        return colors[s] || 'bg-gray-500/20';
    };

    const getTypeLabel = (t: string) => {
        const labels: Record<string, string> = {
            email_subject: 'Sujet email',
            email_content: 'Contenu email',
            landing_page: 'Landing page',
            cta_button: 'Bouton CTA',
            pricing: 'Prix',
            feature: 'Fonctionnalité',
        };
        return labels[t] || t;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FlaskConical className="w-7 h-7 text-[#D4AF37]" />
                        A/B Testing
                    </h1>
                    <p className="text-gray-500">Optimisez vos conversions</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                    <Plus className="w-4 h-4 mr-2" />Nouveau Test
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<FlaskConical />} label="Total" value={stats.total || 0} />
                <StatCard icon={<Play />} label="En cours" value={stats.running || 0} color="text-green-400" />
                <StatCard icon={<Trophy />} label="Terminés" value={stats.completed || 0} color="text-blue-400" />
            </div>

            {/* Tests List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Chargement...</div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/50 border border-white/10 rounded-xl">
                        <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-gray-500">Aucun test A/B</p>
                    </div>
                ) : (
                    tests.map(test => (
                        <motion.div
                            key={test.id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl p-5 cursor-pointer"
                            onClick={() => setSelectedTest(test)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold">{test.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(test.status)}`}>{test.status}</span>
                                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{getTypeLabel(test.test_type)}</span>
                                    </div>
                                    {test.description && <p className="text-sm text-gray-500 mt-1">{test.description}</p>}
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span><Target className="w-3 h-3 inline mr-1" />{test.target_metric}</span>
                                        <span><Percent className="w-3 h-3 inline mr-1" />{test.traffic_split}% / {100 - test.traffic_split}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={(e?: any) => e?.stopPropagation()}>
                                    {test.status === 'draft' && (
                                        <Button size="sm" onClick={() => updateStatus(test, 'start')} className="bg-green-500/20 text-green-400">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {test.status === 'running' && (
                                        <Button size="sm" onClick={() => updateStatus(test, 'pause')} className="bg-yellow-500/20 text-yellow-400">
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {test.status === 'paused' && (
                                        <Button size="sm" onClick={() => updateStatus(test, 'start')} className="bg-green-500/20 text-green-400">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {test.winner_variant_id && <Trophy className="w-5 h-5 text-[#D4AF37]" />}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showCreate && <CreateTestModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchTests(); }} />}
            </AnimatePresence>

            <AnimatePresence>
                {selectedTest && <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} onUpdate={fetchTests} />}
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

function CreateTestModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        test_type: 'cta_button',
        traffic_split: 50,
        target_metric: 'conversion',
        control_content: { text: 'Version A' },
        variant_content: { text: 'Version B' },
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.name) { toast.error('Nom requis'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/ab-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) { toast.success('Test créé'); onSuccess(); }
            else { const d = await res.json(); toast.error(d.error); }
        } catch { toast.error('Erreur'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg" onClick={(e?: any) => e?.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Nouveau Test A/B</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nom</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Test bouton CTA" className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Type de test</label>
                        <select value={form.test_type} onChange={e => setForm({ ...form, test_type: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2">
                            <option value="cta_button">Bouton CTA</option>
                            <option value="email_subject">Sujet email</option>
                            <option value="landing_page">Landing page</option>
                            <option value="pricing">Prix</option>
                            <option value="feature">Fonctionnalité</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Répartition trafic: {form.traffic_split}% / {100 - form.traffic_split}%</label>
                        <input type="range" min="10" max="90" value={form.traffic_split} onChange={e => setForm({ ...form, traffic_split: Number(e.target.value) })} className="w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-800 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">Control</p>
                            <input type="text" value={form.control_content.text} onChange={e => setForm({ ...form, control_content: { text: e.target.value } })} className="w-full bg-zinc-700 rounded px-2 py-1 text-sm" />
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-xs text-blue-400 mb-2">Variant A</p>
                            <input type="text" value={form.variant_content.text} onChange={e => setForm({ ...form, variant_content: { text: e.target.value } })} className="w-full bg-blue-500/20 rounded px-2 py-1 text-sm" />
                        </div>
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

function TestDetailModal({ test, onClose, onUpdate }: any) {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await fetch(`/api/admin/ab-tests?id=${test.id}`);
            const data = await res.json();
            setVariants(data.variants || []);
            setAnalysis(data.analysis);
            setLoading(false);
        };
        fetchDetails();
    }, [test.id]);

    const control = variants.find(v => v.is_control);
    const variant = variants.find(v => !v.is_control);

    const controlRate = control && control.impressions > 0 ? ((control.conversions / control.impressions) * 100).toFixed(2) : '0.00';
    const variantRate = variant && variant.impressions > 0 ? ((variant.conversions / variant.impressions) * 100).toFixed(2) : '0.00';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl" onClick={(e?: any) => e?.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{test.name}</h2>
                    <span className={`text-sm px-3 py-1 rounded ${test.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20'}`}>{test.status}</span>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : (
                    <>
                        {/* Variants comparison */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-zinc-800 rounded-xl">
                                <p className="text-sm text-gray-400 mb-2">Control</p>
                                <p className="text-3xl font-bold">{controlRate}%</p>
                                <p className="text-xs text-gray-500">{control?.conversions || 0} / {control?.impressions || 0}</p>
                            </div>
                            <div className={`p-4 rounded-xl ${analysis?.winner === 'variant' ? 'bg-green-500/20 border border-green-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                                <p className="text-sm text-blue-400 mb-2">Variant A {analysis?.winner === 'variant' && <Trophy className="w-4 h-4 inline text-[#D4AF37]" />}</p>
                                <p className="text-3xl font-bold">{variantRate}%</p>
                                <p className="text-xs text-gray-500">{variant?.conversions || 0} / {variant?.impressions || 0}</p>
                            </div>
                        </div>

                        {/* Analysis */}
                        {analysis && (
                            <div className="p-4 bg-zinc-800/50 rounded-xl mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Significativité statistique</p>
                                        <p className="text-2xl font-bold">{analysis.confidenceLevel}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Lift</p>
                                        <p className={`text-2xl font-bold ${analysis.lift > 0 ? 'text-green-400' : analysis.lift < 0 ? 'text-red-400' : ''}`}>
                                            {analysis.lift > 0 ? '+' : ''}{analysis.lift}%
                                        </p>
                                    </div>
                                </div>
                                {analysis.significant && (
                                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-sm text-green-400">✓ Résultat statistiquement significatif (≥95%)</p>
                                    </div>
                                )}
                                {!analysis.significant && (
                                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-sm text-yellow-400">⚠ Pas encore assez de données pour conclure</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <Button variant="outline" onClick={onClose} className="w-full">Fermer</Button>
            </motion.div>
        </motion.div>
    );
}
