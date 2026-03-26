'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { getRecipeById } from '@/lib/recipes/index';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
    checked: boolean;
    category: 'produce' | 'meat' | 'pantry' | 'dairy' | 'other';
    isManual?: boolean;
}

export function ShoppingList() {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [hasPlan, setHasPlan] = useState(false);
    const [manualInput, setManualInput] = useState('');

    const generateListFromPlan = () => {
        const planStr = localStorage.getItem('titan_meal_plan');
        if (!planStr) {
            setHasPlan(false);
            return;
        }

        const plan = JSON.parse(planStr);
        setHasPlan(true);

        const newItems: Record<string, ShoppingItem> = {};

        // 1. Gather all ingredients from plan
        plan.days.forEach((day: any) => {
            day.slots.forEach((slot: any) => {
                if (slot.recipeId) {
                    const recipe = getRecipeById(slot.recipeId);
                    if (recipe) {
                        recipe.ingredients.forEach((ing: any) => {
                            // Normalize name for aggregation (lowercase, simple trim)
                            const key = ing.name.toLowerCase().trim();

                            if (newItems[key]) {
                                newItems[key].amount += ing.amount;
                            } else {
                                newItems[key] = {
                                    id: key,
                                    name: ing.name,
                                    amount: ing.amount,
                                    unit: ing.unit,
                                    checked: false,
                                    category: guessCategory(ing.name)
                                };
                            }
                        });
                    }
                }
            });
        });

        // 2. Merge with existing checked state if re-generating (optional optimization)
        // For now, we simply overwrite or we could merge. 
        // Let's assume regeneration resets the list for the plan part, but keeps manual items?
        // Simpler approach: Just load them.
        setItems(Object.values(newItems).sort((a, b) => a.category.localeCompare(b.category)));
    };

    const guessCategory = (name: string): ShoppingItem['category'] => {
        const n = name.toLowerCase();
        if (n.includes('poulet') || n.includes('boeuf') || n.includes('oeuf') || n.includes('jambon') || n.includes('saumon')) return 'meat';
        if (n.includes('lait') || n.includes('fromage') || n.includes('yaourt') || n.includes('beurre')) return 'dairy';
        if (n.includes('riz') || n.includes('pâtes') || n.includes('pain') || n.includes('avoine') || n.includes('huile')) return 'pantry';
        if (n.includes('banane') || n.includes('pomme') || n.includes('avocat') || n.includes('salade') || n.includes('tomate')) return 'produce';
        return 'other';
    };

    useEffect(() => {
        generateListFromPlan();
        window.addEventListener('storage', generateListFromPlan);
        return () => window.removeEventListener('storage', generateListFromPlan);
    }, []);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const addManualItem = () => {
        if (!manualInput.trim()) return;
        const newItem: ShoppingItem = {
            id: Date.now().toString(),
            name: manualInput,
            amount: 1,
            unit: 'qté',
            checked: false,
            category: 'other',
            isManual: true
        };
        setItems(prev => [newItem, ...prev]);
        setManualInput('');
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    // Group by Category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ShoppingItem[]>);

    const categoryLabels = {
        meat: 'Viandes & Protéines',
        produce: 'Fruits & Légumes',
        dairy: 'Produits Laitiers',
        pantry: 'Épicerie',
        other: 'Divers'
    };

    if (!hasPlan && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                    <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Votre liste est vide</h3>
                <p className="text-slate-500 mb-8 max-w-sm">Générez un plan de repas dans l'onglet "Plan" pour créer automatiquement votre liste de courses.</p>
            </div>
        );
    }

    return (
        <div className="pb-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic">Ma Liste</h2>
                        <p className="text-slate-500 text-sm font-medium">{items.filter(i => !i.checked).length} articles restants</p>
                    </div>
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                </div>

                {/* Add Manual */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                        placeholder="Ajouter un article..."
                        className="flex-1 h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-[#D4AF37] focus:ring-0 font-bold text-slate-700 bg-slate-50"
                    />
                    <button
                        onClick={addManualItem}
                        className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                    {(Object.keys(groupedItems) as Array<keyof typeof categoryLabels>).sort().map(cat => (
                        <div key={cat} className="space-y-3">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                                {categoryLabels[cat]}
                            </h3>
                            <div className="space-y-2">
                                {groupedItems[cat]!.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: item.checked ? 0.5 : 1, y: 0 }}
                                        className={`flex items-center justify-between p-3 rounded-xl border-b border-dashed border-slate-100 ${item.checked ? 'bg-slate-50' : 'bg-white'
                                            }`}
                                    >
                                        <div
                                            className="flex items-center gap-3 flex-1 cursor-pointer"
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            {item.checked ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                            )}
                                            <div className={item.checked ? 'line-through text-slate-400' : 'text-slate-900'}>
                                                <span className="font-bold">{item.name}</span>
                                                <span className="text-xs font-medium text-slate-400 ml-2">
                                                    {item.amount > 0 && `${item.amount} ${item.unit}`}
                                                </span>
                                            </div>
                                        </div>
                                        {item.isManual && (
                                            <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500 px-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
