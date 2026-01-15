'use client';

import { ScannedProduct } from '@/lib/recipe-database';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Info, Leaf, Activity } from 'lucide-react';
import { useEffect } from 'react';

interface ProductDetailProps {
    product: ScannedProduct;
    onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {

    // Determine color based on verdict
    const getVerdictColor = (v: string) => {
        if (v === 'excellent') return 'text-green-500 bg-green-50 border-green-200';
        if (v === 'bon') return 'text-blue-500 bg-blue-50 border-blue-200';
        if (v === 'moyen') return 'text-yellow-500 bg-yellow-50 border-yellow-200';
        return 'text-red-500 bg-red-50 border-red-200';
    };

    const verdictColor = getVerdictColor(product.titanVerdict);

    return (
        <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
        >
            {/* Header Image */}
            <div className="h-64 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-slate-300 font-bold text-4xl uppercase tracking-widest">No Image</div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 -mt-10 relative">
                {/* Title Section */}
                <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{product.brand}</div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{product.name}</h2>

                    {/* SCORES ROW */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Nutri-Score */}
                        <div className={`px-3 py-1 rounded-lg font-black text-xl border-2 ${product.nutriScore === 'A' ? 'border-green-500 text-green-500' :
                                product.nutriScore === 'B' ? 'border-lime-500 text-lime-500' :
                                    product.nutriScore === 'C' ? 'border-yellow-500 text-yellow-500' :
                                        product.nutriScore === 'D' ? 'border-orange-500 text-orange-500' :
                                            'border-red-500 text-red-500'
                            }`}>
                            {product.nutriScore}
                        </div>

                        {/* NOVA */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">NOVA</span>
                            <span className={`text-lg font-black ${product.novaGroup === 4 ? 'text-red-500' : 'text-slate-700'}`}>
                                {product.novaGroup ?? '?'}
                            </span>
                        </div>

                        {/* Eco-Score */}
                        <div className="flex flex-col items-center">
                            <Leaf className="w-4 h-4 text-green-500 mb-0.5" />
                            <span className="text-xs font-bold text-slate-700">{product.ecoScore}</span>
                        </div>
                    </div>

                    {/* TITAN VERDICT */}
                    <div className={`p-4 rounded-2xl border ${verdictColor} mb-2`}>
                        <div className="flex items-center gap-2 font-black text-lg mb-1 uppercase">
                            <Activity className="w-5 h-5" />
                            VERDICT TITAN : {product.titanVerdict}
                        </div>
                        <p className="text-sm font-medium opacity-90 leading-snug">
                            {product.verdictReason}
                        </p>
                    </div>
                </div>

                {/* MACROS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Calories (100g)</div>
                        <div className="text-2xl font-black text-slate-900">{product.macrosPer100g.calories}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Protéines</div>
                        <div className="text-2xl font-black text-blue-600">{product.macrosPer100g.protein}g</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Glucides</div>
                        <div className="text-2xl font-black text-yellow-500">{product.macrosPer100g.carbs}g</div>
                        <div className="text-xs font-medium text-slate-400">dont {product.macrosPer100g.sugar}g sucres</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Lipides</div>
                        <div className="text-2xl font-black text-red-500">{product.macrosPer100g.fat}g</div>
                        <div className="text-xs font-medium text-slate-400">généralement saturés</div>
                    </div>
                </div>

                {/* ADDITIVES */}
                {product.additives.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            Additifs ({product.additives.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {product.additives.map((add, i) => (
                                <span key={i} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100">
                                    {add}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* BOTTOM ACTION */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-50">
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                    AJOUTER AU JOURNAL
                </button>
            </div>
        </motion.div>
    );
}
