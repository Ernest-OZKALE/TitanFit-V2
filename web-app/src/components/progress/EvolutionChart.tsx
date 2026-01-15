"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2, Plus, AlertCircle } from "lucide-react";

type WeightEntry = {
    id: string;
    weight_kg: number;
    body_fat_percentage: number | null;
    recorded_at: string;
};

export function EvolutionChart() {
    const [data, setData] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newWeight, setNewWeight] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch weight data
    const fetchData = async () => {
        try {
            const res = await fetch('/api/metrics/weight?limit=30');
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to fetch data');
            }

            setData(json.data || []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add new weight entry
    const handleAddWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWeight) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/metrics/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight_kg: parseFloat(newWeight) }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error);
            }

            setNewWeight("");
            fetchData(); // Refresh data
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    // No data state
    if (data.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900">Aucune donnée</h3>
                    <p className="text-sm text-slate-500">Entrez votre premier poids pour commencer le suivi</p>
                </div>

                {/* Add Weight Form */}
                <form onSubmit={handleAddWeight} className="flex gap-3">
                    <input
                        type="number"
                        step="0.1"
                        min="20"
                        max="300"
                        placeholder="Ex: 75.5"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        );
    }

    // Chart calculations
    const weights = data.map(d => d.weight_kg);
    const max = Math.max(...weights) + 1;
    const min = Math.min(...weights) - 1;
    const range = max - min;

    const getY = (val: number) => 200 - ((val - min) / range) * 200;
    const getX = (index: number) => (index / Math.max(data.length - 1, 1)) * 100;

    const points = weights.map((val, i) => `${getX(i)},${getY(val)}`).join(" ");
    const fillPath = `0,200 ${points} 100,200`;

    const startWeight = weights[0];
    const currentWeight = weights[weights.length - 1];
    const diff = (currentWeight - startWeight).toFixed(1);
    const isLoss = currentWeight < startWeight;

    // Generate labels from dates
    const labels = data.map((d, i) => {
        if (i === data.length - 1) return "Now";
        const date = new Date(d.recorded_at);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Current Weight</p>
                    <h3 className="text-3xl font-black text-slate-900">{currentWeight} kg</h3>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isLoss ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    {isLoss ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    <span className="font-bold text-lg">{diff} kg</span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-[250px] w-full pt-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map(p => (
                        <line key={p} x1="0" y1={p * 2} x2="100" y2={p * 2} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                    ))}

                    <motion.polygon
                        points={fillPath}
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    <motion.polyline
                        points={points}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {weights.map((val, i) => (
                        <motion.circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(val)}
                            r="1.5"
                            className="fill-white stroke-[#D4AF37] stroke-[0.5]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                        />
                    ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-slate-300">
                    {labels.slice(0, 10).map((l, i) => (
                        <span key={i}>{l}</span>
                    ))}
                </div>
            </div>

            {/* Add Weight Form */}
            <form onSubmit={handleAddWeight} className="flex gap-3">
                <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="Nouveau poids (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span className="hidden sm:inline">Ajouter</span>
                </button>
            </form>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
