
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from '../types';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Copy, Utensils, Zap, Droplets, Wallet, Leaf } from 'lucide-react';

interface NutritionStepProps {
    data: OnboardingData['nutrition'];
    updateData: (data: Partial<OnboardingData['nutrition']>) => void;
}

export function NutritionStep({ data, updateData }: NutritionStepProps) {

    // Helper for multi-select arrays (supplements, etc.)
    const toggleItem = (field: keyof OnboardingData['nutrition'], item: string) => {
        const currentList = (data[field] as string[]) || [];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        updateData({ [field]: newList });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase relative inline-block">
                    Architecture <span className="text-[#D4AF37]">Nutritionnelle</span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                </h2>
                <p className="text-gray-400 font-mono text-sm">Calibration du carburant métabolique.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Diet Archetype */}
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                        <Leaf className="w-4 h-4" /> Archétype Alimentaire
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        {['classic', 'flexitarian', 'vegetarian', 'vegan', 'paleo', 'keto', 'pescatarian'].map((type) => (
                            <motion.button
                                key={type}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateData({ diet_type: type as any })}
                                className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${data.diet_type === type
                                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:bg-black/60'
                                    }`}
                            >
                                <span className="relative z-10 text-sm font-bold capitalize">{type}</span>
                                {data.diet_type === type && (
                                    <motion.div
                                        layoutId="activeDiet"
                                        className="absolute inset-0 bg-[#D4AF37]/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* 2. Cooking & Budget */}
                <div className="space-y-6">
                    {/* Cooking Skill */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                            <Utensils className="w-4 h-4" /> Compétence Culinaire
                        </Label>
                        <div className="flex gap-2">
                            {['none', 'basic', 'advanced', 'chef'].map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => updateData({ cooking_skill: skill as any })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${data.cooking_skill === skill
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Budget Mensuel
                        </Label>
                        <Select
                            value={data.budget}
                            onValueChange={(val: any) => updateData({ budget: val })}
                        >
                            <SelectTrigger className="w-full bg-black/40 border-white/10 text-white h-12">
                                <SelectValue placeholder="Selectionner budget" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                <SelectItem value="economy">Économique (Efficace)</SelectItem>
                                <SelectItem value="standard">Standard (Équilibré)</SelectItem>
                                <SelectItem value="premium">Premium (Bio / Local)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 3. Hydration & Habits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                {/* Hydration */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                        <Droplets className="w-4 h-4" /> Hydratation
                    </Label>
                    <div className="flex flex-col gap-2">
                        {['low', 'medium', 'high'].map((level) => (
                            <button
                                key={level}
                                onClick={() => updateData({ hydration: level as any })}
                                className={`w-full p-2 text-left px-4 rounded-lg border text-sm transition-colors ${data.hydration === level
                                        ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                                        : 'bg-black/20 border-white/5 text-gray-500 hover:bg-black/40'
                                    }`}
                            >
                                {level === 'low' && '< 1L / jour'}
                                {level === 'medium' && '1.5L - 2.5L / jour'}
                                {level === 'high' && '> 3L / jour'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meals per day */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                        Repas / Jour : {data.meals_per_day}
                    </Label>
                    <Slider
                        value={[data.meals_per_day]}
                        min={1}
                        max={6}
                        step={1}
                        onValueChange={(vals) => updateData({ meals_per_day: vals[0] })}
                        className="py-4"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase">
                        <span>OMAD</span>
                        <span>Standard</span>
                        <span>Bodybuilding</span>
                    </div>
                </div>

                {/* Supplements */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Stack Actuel
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {['Whey', 'Creatine', 'Vitamines', 'Pre-Workout', 'Omega-3', 'ZMA'].map((supp) => (
                            <Badge
                                key={supp}
                                variant="outline"
                                onClick={() => toggleItem('supplements', supp)}
                                className={`cursor-pointer transition-all hover:border-[#D4AF37]/50 ${data.supplements?.includes(supp)
                                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                        : 'bg-transparent text-gray-400 border-white/10'
                                    }`}
                            >
                                {supp}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Allergies & Dislikes */}
            <div className="pt-4 border-t border-white/5 space-y-4">
                <Label className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                    Allergies & Exclusions
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Allergies - Common Tags */}
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Allergies Communes</span>
                        <div className="flex flex-wrap gap-2">
                            {['Gluten', 'Lactose', 'Arachides', 'Oeufs', 'Sole', 'Crustacés'].map((allergy) => (
                                <Badge
                                    key={allergy}
                                    variant="outline"
                                    onClick={() => toggleItem('allergies', allergy)}
                                    className={`cursor-pointer ${data.allergies?.includes(allergy)
                                            ? 'bg-red-500/20 text-red-200 border-red-500'
                                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {allergy}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {/* Custom Input for Dislikes (Currently just handling as array of strings, maybe simple input for now) */}
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Aliments Détestés (Séparer par virgule)</span>
                        <Input
                            placeholder="ex: Brocolis, Foie..."
                            value={data.dislikes?.join(', ') || ''}
                            onChange={(e) => updateData({ dislikes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="bg-black/40 border-white/10 text-white placeholder:text-gray-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
