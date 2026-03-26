
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { OnboardingData, InjuryRecord } from '../types';
import { Activity, AlertTriangle, Cross, HeartPulse, Plus, Trash2, X, Check } from 'lucide-react';

interface InjuriesStepProps {
    data: OnboardingData;
    updateData: (section: keyof OnboardingData, payload: any) => void;
}

const BODY_PARTS = [
    "Épaules", "Coudes", "Poignets", "Dos (Haut)", "Dos (Bas / Lombaires)",
    "Hanches", "Genoux", "Chevilles", "Cou"
];

const HEALTH_CONDITIONS = [
    "Asthme", "Hypertension", "Diabète", "Problèmes Cardiaques", "Hernie Discale", "Scoliose"
];

export function InjuriesStep({ data, updateData }: InjuriesStepProps) {
    const [addingInjury, setAddingInjury] = useState<boolean>(false);
    const [newInjury, setNewInjury] = useState<Partial<InjuryRecord>>({
        body_part: "",
        severity: "mild",
        description: "",
        is_chronic: false,
        movements_to_avoid: []
    });

    const handleAddInjury = () => {
        if (!newInjury.body_part) return;
        const injury: InjuryRecord = {
            id: Math.random().toString(36).substr(2, 9),
            body_part: newInjury.body_part,
            severity: newInjury.severity as any || "mild",
            description: newInjury.description || "",
            is_chronic: newInjury.is_chronic || false,
            movements_to_avoid: newInjury.movements_to_avoid || []
        };
        updateData('injuries', [...(data.injuries || []), injury]);
        setAddingInjury(false);
        setNewInjury({ severity: "mild", is_chronic: false, movements_to_avoid: [] });
    };

    const removeInjury = (id: string) => {
        updateData('injuries', data.injuries.filter(i => i.id !== id));
    };

    const toggleCondition = (condition: string) => {
        const current = data.health_conditions || [];
        const updated = current.includes(condition)
            ? current.filter(c => c !== condition)
            : [...current, condition];
        updateData('health_conditions', updated);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase relative inline-block">
                    Scan <span className="text-red-500">Pathologique</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm">Détection des contraintes structurelles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Injury List & Add Form */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Blessures Actives
                        </Label>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAddingInjury(true)}
                            className="bg-red-500/10 border-red-500/50 text-red-200 hover:bg-red-500/20"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Ajouter
                        </Button>
                    </div>

                    {/* Injury List */}
                    <div className="space-y-3 min-h-[100px]">
                        {data.injuries?.length === 0 && !addingInjury && (
                            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-black/20">
                                <Activity className="w-8 h-8 text-green-500/50 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Aucune blessure signalée. Machine opérationnelle à 100%.</p>
                            </div>
                        )}

                        <AnimatePresence>
                            {data.injuries?.map((injury) => (
                                <motion.div
                                    key={injury.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 rounded-xl bg-red-900/10 border border-red-500/20 flex justify-between items-start"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white">{injury.body_part}</span>
                                            <Badge variant="outline" className={`
                                                ${injury.severity === 'severe' ? 'border-red-500 text-red-500' :
                                                    injury.severity === 'moderate' ? 'border-orange-500 text-orange-500' :
                                                        'border-yellow-500 text-yellow-500'}
                                            `}>
                                                {injury.severity === 'severe' ? 'Sévère' : injury.severity === 'moderate' ? 'Modérée' : 'Légère'}
                                            </Badge>
                                            {injury.is_chronic && <Badge variant="secondary" className="bg-white/10 text-gray-300">Chronique</Badge>}
                                        </div>
                                        <p className="text-sm text-gray-400">{injury.description}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-500" onClick={() => removeInjury(injury.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Add Injury Modal / Form */}
                    <AnimatePresence>
                        {addingInjury && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-4 shadow-2xl relative"
                            >
                                <Button size="icon" variant="ghost" className="absolute right-2 top-2" onClick={() => setAddingInjury(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                                <h3 className="font-bold text-white">Nouvelle Limitation</h3>

                                <div className="space-y-3">
                                    <Label>Zone Touchée</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BODY_PARTS.map(part => (
                                            <button
                                                key={part}
                                                onClick={() => setNewInjury({ ...newInjury, body_part: part })}
                                                className={`text-xs p-2 rounded border transition-colors ${newInjury.body_part === part
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-black/40 text-gray-400 border-white/10'
                                                    }`}
                                            >
                                                {part}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Gravité: {newInjury.severity}</Label>
                                    <div className="flex gap-2">
                                        {['mild', 'moderate', 'severe'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setNewInjury({ ...newInjury, severity: s as any })}
                                                className={`flex-1 py-2 text-xs uppercase font-bold rounded border ${newInjury.severity === s
                                                    ? (s === 'severe' ? 'bg-red-600 border-red-600 text-white' :
                                                        s === 'moderate' ? 'bg-orange-500 border-orange-500 text-black' :
                                                            'bg-yellow-400 border-yellow-400 text-black')
                                                    : 'bg-transparent border-white/10 text-gray-500'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Est-ce chronique ?</Label>
                                        <Switch
                                            checked={newInjury.is_chronic || false}
                                            onCheckedChange={(c: boolean) => setNewInjury({ ...newInjury, is_chronic: c })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description / Mouvements Douloureux</Label>
                                    <Textarea
                                        value={newInjury.description}
                                        onChange={(e) => setNewInjury({ ...newInjury, description: e.target.value })}
                                        placeholder="Douleur au développer couché, ne peux pas lever le bras..."
                                        className="bg-black/40 border-white/10"
                                    />
                                </div>

                                <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={handleAddInjury}>
                                    Confirmer la Blessure
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Col: Medical Conditions */}
                <div className="space-y-6 pt-4 md:pt-0 md:border-l md:border-white/5 md:pl-8">
                    <Label className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <HeartPulse className="w-4 h-4" /> Conditions Médicales
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                        {HEALTH_CONDITIONS.map(condition => (
                            <div
                                key={condition}
                                onClick={() => toggleCondition(condition)}
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${data.health_conditions?.includes(condition)
                                    ? 'bg-blue-500/20 border-blue-500'
                                    : 'bg-black/20 border-white/5 hover:bg-black/40'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${data.health_conditions?.includes(condition)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-600'
                                    }`}>
                                    {data.health_conditions?.includes(condition) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={data.health_conditions?.includes(condition) ? 'text-blue-100 font-bold' : 'text-gray-400'}>
                                    {condition}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mt-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                            <p className="text-xs text-yellow-200/80 leading-relaxed">
                                <strong>Note Importante :</strong> TitanFit génère des programmes basés sur vos données. En cas de doute médical, consultez toujours un professionnel de santé avant de commencer un entraînement intensif.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
