'use client';

import { useState, useEffect } from 'react';
import { ROUTINES, generateWeekPlan, getRandomRecipe } from '@/lib/meal-templates';
import { getRecipeById, getRecipesByCategory, ALL_RECIPES } from '@/lib/recipes/index';
import { CalendarRange, Sparkles, ChevronLeft, ChevronRight, RefreshCw, Plus, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { RecipeFull } from '@/lib/recipe-database';

// Type for week plan
type WeekPlanType = ReturnType<typeof generateWeekPlan>;
type DayPlanType = WeekPlanType['days'][0];

// Recipe Picker Modal Component
function RecipePicker({
    isOpen,
    onClose,
    onSelect,
    slotType
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (recipeId: string) => void;
    slotType: string;
}) {
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    // Map slot type to recipe category
    const categoryMap: Record<string, string> = {
        'breakfast': 'breakfast',
        'morning-snack': 'snack',
        'lunch': 'lunch',
        'afternoon-snack': 'snack',
        'dinner': 'dinner',
        'evening-snack': 'dessert'
    };

    const category = categoryMap[slotType] || 'lunch';
    let recipes = getRecipesByCategory(category);

    // Also include shakes for snacks
    if (slotType.includes('snack')) {
        recipes = [...recipes, ...getRecipesByCategory('shake')];
    }

    // Filter by search
    if (search) {
        const normalizedSearch = search.toLowerCase();
        recipes = recipes.filter(r =>
            r.name.toLowerCase().includes(normalizedSearch) ||
            r.description.toLowerCase().includes(normalizedSearch)
        );
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990]"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-4 md:inset-auto md:top-10 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white rounded-3xl z-[9999] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-slate-900 uppercase">Choisir une recette</h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {/* Recipe List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {recipes.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    Aucune recette trouvée
                                </div>
                            ) : (
                                recipes.map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => {
                                            onSelect(recipe.id);
                                            onClose();
                                        }}
                                        className="w-full p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl text-left transition-colors border border-transparent hover:border-indigo-200"
                                    >
                                        <h4 className="font-bold text-slate-900 mb-1">{recipe.name}</h4>
                                        <div className="flex gap-3 text-xs font-medium text-slate-500">
                                            <span>{recipe.macros.calories} kcal</span>
                                            <span>•</span>
                                            <span>{recipe.macros.protein}g Prot</span>
                                            <span>•</span>
                                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

export function MealPlanner() {
    const [selectedRoutine, setSelectedRoutine] = useState(ROUTINES[0].id);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [weekPlan, setWeekPlan] = useState<WeekPlanType | null>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // Recipe Picker State
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
    const [pickerSlotType, setPickerSlotType] = useState('lunch');

    // Category Filter State
    const [selectedCategory, setSelectedCategory] = useState('bulk');

    // Custom Goals State (user can override routine defaults)
    const [customGoals, setCustomGoals] = useState({
        calories: 2500,
        protein: 150,
        carbs: 250,
        fat: 80
    });
    const [showGoalsEditor, setShowGoalsEditor] = useState(false);

    // Sync custom goals when routine changes
    useEffect(() => {
        const routine = ROUTINES.find(r => r.id === selectedRoutine);
        if (routine) {
            setCustomGoals({
                calories: routine.targetCalories,
                protein: Math.round(routine.targetCalories * 0.3 / 4), // 30% from protein
                carbs: Math.round(routine.targetCalories * 0.4 / 4), // 40% from carbs
                fat: Math.round(routine.targetCalories * 0.3 / 9) // 30% from fat
            });
        }
    }, [selectedRoutine]);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('titan_meal_plan');
        if (saved) {
            setWeekPlan(JSON.parse(saved));
        }
    }, []);

    // Persist Plan
    useEffect(() => {
        if (weekPlan) {
            localStorage.setItem('titan_meal_plan', JSON.stringify(weekPlan));
            window.dispatchEvent(new Event('storage')); // Notify Shopping List
        }
    }, [weekPlan]);

    const handleGenerate = () => {
        const plan = generateWeekPlan(currentWeekStart, selectedRoutine);
        setWeekPlan(plan);
        setSelectedDayIndex(0);
    };

    // SWAP MEAL - Randomly replace a single slot
    const handleSwapMeal = (slotIndex: number) => {
        if (!weekPlan) return;

        const slot = weekPlan.days[selectedDayIndex].slots[slotIndex];
        const categoryMap: Record<string, string> = {
            'breakfast': 'breakfast',
            'morning-snack': 'snack',
            'lunch': 'lunch',
            'afternoon-snack': 'snack',
            'dinner': 'dinner',
            'evening-snack': 'dessert'
        };

        const category = categoryMap[slot.type] || 'lunch';
        const newRecipe = getRandomRecipe(category, weekPlan.goal);

        if (newRecipe) {
            const updatedPlan = { ...weekPlan };
            updatedPlan.days = [...updatedPlan.days];
            updatedPlan.days[selectedDayIndex] = { ...updatedPlan.days[selectedDayIndex] };
            updatedPlan.days[selectedDayIndex].slots = [...updatedPlan.days[selectedDayIndex].slots];
            updatedPlan.days[selectedDayIndex].slots[slotIndex] = {
                ...slot,
                recipeId: newRecipe.id
            };
            setWeekPlan(updatedPlan);
        }
    };

    // PICK MEAL - Open picker to manually select
    const handleOpenPicker = (slotIndex: number, slotType: string) => {
        setPickerSlotIndex(slotIndex);
        setPickerSlotType(slotType);
        setPickerOpen(true);
    };

    const handleSelectRecipe = (recipeId: string) => {
        if (!weekPlan || pickerSlotIndex === null) return;

        const updatedPlan = { ...weekPlan };
        updatedPlan.days = [...updatedPlan.days];
        updatedPlan.days[selectedDayIndex] = { ...updatedPlan.days[selectedDayIndex] };
        updatedPlan.days[selectedDayIndex].slots = [...updatedPlan.days[selectedDayIndex].slots];
        updatedPlan.days[selectedDayIndex].slots[pickerSlotIndex] = {
            ...updatedPlan.days[selectedDayIndex].slots[pickerSlotIndex],
            recipeId: recipeId
        };
        setWeekPlan(updatedPlan);
        setPickerSlotIndex(null);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(date);
    };

    const getSlotLabel = (type: string) => {
        switch (type) {
            case 'breakfast': return 'Petit-Déjeuner';
            case 'morning-snack': return 'Collation Matin';
            case 'lunch': return 'Déjeuner';
            case 'afternoon-snack': return 'Collation Après-midi';
            case 'dinner': return 'Dîner';
            case 'evening-snack': return 'Collation Soir';
            default: return type;
        }
    };

    // Calculate total cals for the selected day
    const calculateDayTotals = (day: DayPlanType) => {
        let calories = 0;
        let protein = 0;
        day.slots.forEach(slot => {
            if (slot.recipeId) {
                const r = getRecipeById(slot.recipeId);
                if (r) {
                    calories += r.macros.calories;
                    protein += r.macros.protein;
                }
            }
        });
        return { calories, protein };
    };

    return (
        <div className="space-y-6 pb-40">
            {/* Recipe Picker Modal */}
            <RecipePicker
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleSelectRecipe}
                slotType={pickerSlotType}
            />

            {/* HEADER & ROUTINE SELECTOR */}
            {!weekPlan ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                            <CalendarRange className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-1">PLANIFICATEUR INTELLIGENT</h2>
                        <p className="text-slate-500 text-sm">Choisissez votre objectif et générez une semaine de repas.</p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['bulk', 'cut', 'maintain', 'special'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? cat === 'bulk' ? 'bg-green-500 text-white'
                                        : cat === 'cut' ? 'bg-red-500 text-white'
                                            : cat === 'maintain' ? 'bg-blue-500 text-white'
                                                : 'bg-purple-500 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {cat === 'bulk' ? '💪 Masse' :
                                    cat === 'cut' ? '🔥 Sèche' :
                                        cat === 'maintain' ? '⚖️ Maintenance' :
                                            '⚡ Spécial'}
                            </button>
                        ))}
                    </div>

                    {/* Routines Grid */}
                    <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3">
                        {ROUTINES
                            .filter(r => {
                                if (selectedCategory === 'special') {
                                    return r.id.startsWith('special');
                                }
                                return r.goal === selectedCategory && !r.id.startsWith('special');
                            })
                            .map(routine => (
                                <button
                                    key={routine.id}
                                    onClick={() => setSelectedRoutine(routine.id)}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedRoutine === routine.id
                                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                                        : 'border-slate-100 hover:border-slate-200 bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-900">{routine.name}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${routine.goal === 'bulk' ? 'bg-green-100 text-green-600' :
                                            routine.goal === 'cut' ? 'bg-red-100 text-red-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            ~{routine.targetCalories} kcal
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{routine.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        {routine.structure.breakfast && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Petit-déj</span>}
                                        {routine.structure.morningSnack && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Snack AM</span>}
                                        {routine.structure.lunch && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Déj</span>}
                                        {routine.structure.afternoonSnack && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Snack PM</span>}
                                        {routine.structure.dinner && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Dîner</span>}
                                        {routine.structure.eveningSnack && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Snack Soir</span>}
                                    </div>
                                </button>
                            ))}
                    </div>

                    {/* Custom Goals Editor */}
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4">
                        <button
                            onClick={() => setShowGoalsEditor(!showGoalsEditor)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <div>
                                <h3 className="font-bold text-slate-900">⚙️ Mes Objectifs Personnalisés</h3>
                                <p className="text-xs text-slate-500">
                                    {customGoals.calories} kcal • {customGoals.protein}g prot • {customGoals.carbs}g carbs • {customGoals.fat}g lip
                                </p>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showGoalsEditor ? 'rotate-90' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showGoalsEditor && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Calories</label>
                                            <input
                                                type="number"
                                                value={customGoals.calories}
                                                onChange={(e) => setCustomGoals(g => ({ ...g, calories: parseInt(e.target.value) || 0 }))}
                                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Protéines (g)</label>
                                            <input
                                                type="number"
                                                value={customGoals.protein}
                                                onChange={(e) => setCustomGoals(g => ({ ...g, protein: parseInt(e.target.value) || 0 }))}
                                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Glucides (g)</label>
                                            <input
                                                type="number"
                                                value={customGoals.carbs}
                                                onChange={(e) => setCustomGoals(g => ({ ...g, carbs: parseInt(e.target.value) || 0 }))}
                                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Lipides (g)</label>
                                            <input
                                                type="number"
                                                value={customGoals.fat}
                                                onChange={(e) => setCustomGoals(g => ({ ...g, fat: parseInt(e.target.value) || 0 }))}
                                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-3 text-center">
                                        Ces valeurs sont vos objectifs quotidiens. Le plan généré s'en approchera au maximum.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleGenerate}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        GÉNÉRER MON PLAN
                    </button>
                </div>
            ) : (
                <>
                    {/* WEEK NAVIGATION */}
                    <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100">
                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-slate-900">Semaine du {new Date(weekPlan.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* DAYS SCROLL */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {weekPlan.days.map((day, idx) => {
                            const isSelected = selectedDayIndex === idx;
                            return (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDayIndex(idx)}
                                    className={`min-w-[4.5rem] py-3 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${isSelected
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                        : 'bg-white text-slate-400 border-slate-100'
                                        }`}
                                >
                                    <span className="text-[10px] uppercase font-bold mb-1">{formatDate(day.date).split(' ')[0]}</span>
                                    <span className="text-xl font-black mb-1">{formatDate(day.date).split(' ')[1]}</span>
                                    {isSelected && (
                                        <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* DAILY VIEW */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDayIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {/* DAY STATS */}
                            <div className="flex gap-4 mb-2">
                                <div className="flex-1 bg-indigo-50 p-3 rounded-2xl flex items-center justify-between px-4">
                                    <span className="text-xs font-bold text-indigo-400 uppercase">Calories</span>
                                    <span className="text-lg font-black text-indigo-700">{calculateDayTotals(weekPlan.days[selectedDayIndex]).calories}</span>
                                </div>
                                <div className="flex-1 bg-blue-50 p-3 rounded-2xl flex items-center justify-between px-4">
                                    <span className="text-xs font-bold text-blue-400 uppercase">Protéines</span>
                                    <span className="text-lg font-black text-blue-700">{calculateDayTotals(weekPlan.days[selectedDayIndex]).protein}g</span>
                                </div>
                            </div>

                            {/* MEAL SLOTS */}
                            {weekPlan.days[selectedDayIndex].slots.map((slot, idx) => {
                                const recipe = slot.recipeId ? getRecipeById(slot.recipeId) : null;
                                return (
                                    <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative group">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{getSlotLabel(slot.type)}</span>
                                            <button
                                                onClick={() => handleSwapMeal(idx)}
                                                className="p-1.5 hover:bg-indigo-50 rounded-full text-slate-300 hover:text-indigo-600 transition-colors"
                                                title="Changer aléatoirement"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {recipe ? (
                                            <div
                                                className="flex gap-4 cursor-pointer hover:bg-slate-50 -m-2 p-2 rounded-xl transition-colors"
                                                onClick={() => handleOpenPicker(idx, slot.type)}
                                            >
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold ${recipe.category === 'breakfast' ? 'bg-orange-100 text-orange-500' :
                                                    recipe.category === 'lunch' ? 'bg-blue-100 text-blue-500' :
                                                        'bg-green-100 text-green-500'
                                                    }`}>
                                                    IMG
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 leading-tight mb-1">{recipe.name}</h4>
                                                    <div className="flex gap-3 text-xs font-medium text-slate-500">
                                                        <span>{recipe.macros.calories} kcal</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{recipe.macros.protein}g Prot</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => handleOpenPicker(idx, slot.type)}
                                                className="h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Ajouter un repas
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    <div className="pt-4 pb-8">
                        <button
                            onClick={() => setWeekPlan(null)}
                            className="w-full py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50"
                        >
                            Changer de routine
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
