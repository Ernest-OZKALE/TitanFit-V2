"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Trash2, Leaf, Beef, Milk, Cookie, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/premium-components";
import { cn } from "@/lib/utils";

// Mock Data (simulating aggregation from Meal Plan)
const MOCK_GROCERY = [
    { id: 1, name: "Bananes", category: "produce", quantity: "6", checked: false },
    { id: 2, name: "Epinards Frais", category: "produce", quantity: "500g", checked: false },
    { id: 3, name: "Blancs de Poulet", category: "protein", quantity: "1kg", checked: false },
    { id: 4, name: "Oeufs Bio", category: "protein", quantity: "12", checked: false },
    { id: 5, name: "Flocons d'Avoine", category: "pantry", quantity: "1kg", checked: true },
    { id: 6, name: "Beurre d'Amande", category: "pantry", quantity: "1 pot", checked: false },
    { id: 7, name: "Skyr", category: "dairy", quantity: "4 pots", checked: false },
];

const CATEGORIES: any = {
    produce: { label: "Fruits & Légumes", icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
    protein: { label: "Boucherie / Oeufs", icon: Beef, color: "text-red-500", bg: "bg-red-500/10" },
    dairy: { label: "Produits Laitiers", icon: Milk, color: "text-blue-500", bg: "bg-blue-500/10" },
    pantry: { label: "Épicerie Sec", icon: Cookie, color: "text-amber-500", bg: "bg-amber-500/10" },
};

export function SmartGroceryList() {
    const [items, setItems] = useState(MOCK_GROCERY);

    const toggleCheck = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const clearCompleted = () => {
        setItems(items.filter(i => !i.checked));
    };

    // Group by category
    const groupedItems = items.reduce((acc: any, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const totalItems = items.length;
    const checkedItems = items.filter(i => i.checked).length;
    const progress = totalItems === 0 ? 0 : (checkedItems / totalItems) * 100;

    return (
        <div className="space-y-6">

            {/* Header Control */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                        <ShoppingCart className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Grocery Auto-Pilot</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase">{checkedItems}/{totalItems} Articles • {Math.round(progress)}% Done</p>
                    </div>
                </div>
                {checkedItems > 0 && (
                    <button
                        onClick={clearCompleted}
                        className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Nettoyer
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Aisle Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {Object.keys(CATEGORIES).map(catKey => {
                    const categoryItems = groupedItems[catKey] || [];
                    if (categoryItems.length === 0) return null;

                    const CatConfig = CATEGORIES[catKey];
                    const CatIcon = CatConfig.icon;

                    return (
                        <GlassCard key={catKey} className="p-0 overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={cn("px-4 py-3 border-b border-slate-100 flex items-center gap-2", CatConfig.bg)}>
                                <CatIcon className={cn("w-4 h-4", CatConfig.color)} />
                                <span className={cn("text-xs font-black uppercase tracking-widest", CatConfig.color)}>
                                    {CatConfig.label}
                                </span>
                            </div>
                            <div className="p-2">
                                {categoryItems.map((item: any) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        onClick={() => toggleCheck(item.id)}
                                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                                item.checked ? "bg-slate-900 border-slate-900" : "border-slate-300 group-hover:border-[#D4AF37]"
                                            )}>
                                                {item.checked && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={cn(
                                                "text-sm font-bold transition-all",
                                                item.checked ? "text-slate-300 line-through decoration-slate-300" : "text-slate-700"
                                            )}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                            {item.quantity}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Add Manual Item (Mock) */}
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                <Plus className="w-5 h-5" /> Ajouter un article manuellement
            </button>

        </div>
    );
}
