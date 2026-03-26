'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Heart,
    Moon,
    Flame,
    Map,
    Plus,
    Save,
    TrendingUp,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HealthEntry {
    date: string;
    steps: number;
    calories: number;
    distance: number;
    heartRate: number;
    sleepHours: number;
}

export default function ManualHealthEntry() {
    const [entry, setEntry] = useState<HealthEntry>({
        date: new Date().toISOString().split('T')[0],
        steps: 0,
        calories: 0,
        distance: 0,
        heartRate: 0,
        sleepHours: 0,
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (field: keyof HealthEntry, value: string | number) => {
        setEntry(prev => ({
            ...prev,
            [field]: typeof value === 'string' && field !== 'date' ? parseFloat(value) || 0 : value,
        }));
    };

    const saveEntry = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/wearables/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });

            if (response.ok) {
                toast.success('Données enregistrées !');
                // Reset form
                setEntry(prev => ({
                    ...prev,
                    steps: 0,
                    calories: 0,
                    distance: 0,
                    heartRate: 0,
                    sleepHours: 0,
                }));
            } else {
                toast.error('Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { key: 'steps', label: 'Pas', icon: <Activity className="w-5 h-5" />, unit: '', placeholder: '10000', color: 'text-blue-400' },
        { key: 'calories', label: 'Calories brûlées', icon: <Flame className="w-5 h-5" />, unit: 'kcal', placeholder: '2500', color: 'text-orange-400' },
        { key: 'distance', label: 'Distance', icon: <Map className="w-5 h-5" />, unit: 'km', placeholder: '5.5', color: 'text-green-400' },
        { key: 'heartRate', label: 'Fréquence cardiaque moy.', icon: <Heart className="w-5 h-5" />, unit: 'bpm', placeholder: '72', color: 'text-red-400' },
        { key: 'sleepHours', label: 'Heures de sommeil', icon: <Moon className="w-5 h-5" />, unit: 'heures', placeholder: '7.5', color: 'text-purple-400' },
    ];

    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" />
                Saisie Manuelle
            </h3>

            {/* Date picker */}
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                </label>
                <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 
                             focus:border-[#D4AF37]/50 focus:outline-none"
                />
            </div>

            {/* Metric fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {fields.map((field) => (
                    <motion.div
                        key={field.key}
                        whileHover={{ scale: 1.01 }}
                        className="bg-zinc-800/30 rounded-xl p-4"
                    >
                        <label className={`block text-sm mb-2 flex items-center gap-2 ${field.color}`}>
                            {field.icon}
                            {field.label}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                step={field.key === 'sleepHours' || field.key === 'distance' ? '0.1' : '1'}
                                min="0"
                                value={entry[field.key as keyof HealthEntry] || ''}
                                onChange={(e) => handleChange(field.key as keyof HealthEntry, e.target.value)}
                                placeholder={field.placeholder}
                                className="flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5
                                         focus:border-[#D4AF37]/50 focus:outline-none text-lg"
                            />
                            {field.unit && (
                                <span className="text-gray-500 text-sm min-w-[40px]">{field.unit}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Save button */}
            <Button
                onClick={saveEntry}
                disabled={saving}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#B8860B] font-bold py-3"
            >
                {saving ? (
                    <span className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <TrendingUp className="w-5 h-5" />
                        </motion.div>
                        Enregistrement...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Enregistrer les données
                    </span>
                )}
            </Button>

            {/* Quick tips */}
            <div className="mt-4 p-4 bg-zinc-800/20 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500">
                    💡 <strong>Astuce :</strong> Tu peux récupérer ces données depuis ton téléphone :
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• iPhone : App Santé → Parcourir → Voir les chiffres</li>
                    <li>• Android : Google Fit → Profil → Activité quotidienne</li>
                </ul>
            </div>
        </div>
    );
}
