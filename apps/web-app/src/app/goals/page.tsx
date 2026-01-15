'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Target, ChevronLeft, Calculator, Shield, Activity, Flame } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { GlassCard } from '@/components/ui/premium-components';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GoalsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        goal_type: 'weight_loss',
        target_weight_kg: '',
        target_calories: '',
        target_protein_g: '',
        target_carbs_g: '',
        target_fat_g: '',
    });

    useEffect(() => {
        if (!user) return;
        fetchGoals();
    }, [user]);

    async function fetchGoals() {
        const { data } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', user?.id)
            .single();

        if (data) {
            setFormData({
                goal_type: data.goal_type || 'weight_loss',
                target_weight_kg: data.target_weight_kg || '',
                target_calories: data.target_calories || '',
                target_protein_g: data.target_protein_g || '',
                target_carbs_g: data.target_carbs_g || '',
                target_fat_g: data.target_fat_g || '',
            });
        }
    }

    async function updateGoals(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const goalsData = {
            user_id: user.id,
            goal_type: formData.goal_type,
            target_weight_kg: parseFloat(formData.target_weight_kg) || null,
            target_calories: parseInt(formData.target_calories) || 2000,
            target_protein_g: parseInt(formData.target_protein_g) || 150,
            target_carbs_g: parseInt(formData.target_carbs_g) || 200,
            target_fat_g: parseInt(formData.target_fat_g) || 70,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('user_goals')
            .upsert(goalsData)
            .select();

        setLoading(false);

        if (!error) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    }

    const autoCalculateMacros = () => {
        const cals = parseInt(formData.target_calories) || 2000;
        const p = Math.round((cals * 0.3) / 4);
        const c = Math.round((cals * 0.4) / 4);
        const f = Math.round((cals * 0.3) / 9);

        setFormData({
            ...formData,
            target_protein_g: p.toString(),
            target_carbs_g: c.toString(),
            target_fat_g: f.toString(),
        });
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden pb-24">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center gap-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-[#D4AF37]">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
                    Protocoles <span className="text-[#D4AF37]">Objectifs</span>
                </h1>
            </header>

            <main className="relative z-10 max-w-xl mx-auto px-6 py-8">
                <form onSubmit={updateGoals} className="space-y-8">

                    {/* Goal Configuration */}
                    <GlassCard className="border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-tight text-white">Cible Principale</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Définition de la mission</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Type d'Objectif</Label>
                                <Select
                                    value={formData.goal_type}
                                    onValueChange={(val) => setFormData({ ...formData, goal_type: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black/90 border-[#D4AF37]/20 text-white backdrop-blur-xl">
                                        <SelectItem value="weight_loss" className="focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]">Perte de Poids (Cut)</SelectItem>
                                        <SelectItem value="muscle_gain" className="focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]">Prise de Masse (Bulk)</SelectItem>
                                        <SelectItem value="maintenance" className="focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]">Maintenance</SelectItem>
                                        <SelectItem value="performance" className="focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]">Performance Athlétique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-gray-400 text-xs font-bold uppercase tracking-wider">Poids Cible (kg)</Label>
                                <div className="relative">
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        value={formData.target_weight_kg}
                                        onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                                        placeholder="ex: 80.5"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37] pl-10 text-lg font-bold"
                                    />
                                    <Activity className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Nutrition Config */}
                    <GlassCard className="border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Métabolisme</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Paramètres Macro</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={autoCalculateMacros}
                                className="text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] border border-[#D4AF37]/30 transition-all text-[10px] font-black uppercase tracking-wider h-8 px-3 rounded-lg flex items-center gap-2"
                            >
                                <Calculator className="h-3 w-3" />
                                Neural Optimize
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="calories" className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cible Calorique (Daily)</Label>
                                <div className="relative">
                                    <Input
                                        id="calories"
                                        type="number"
                                        value={formData.target_calories}
                                        onChange={(e) => setFormData({ ...formData, target_calories: e.target.value })}
                                        placeholder="ex: 2500"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37] pl-10 text-lg font-bold"
                                    />
                                    <Flame className="absolute left-3 top-3.5 h-5 w-5 text-[#D4AF37]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="protein" className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Protéines (g)</Label>
                                    <Input
                                        id="protein"
                                        type="number"
                                        value={formData.target_protein_g}
                                        onChange={(e) => setFormData({ ...formData, target_protein_g: e.target.value })}
                                        placeholder="180"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center font-bold focus:border-green-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carbs" className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Glucides (g)</Label>
                                    <Input
                                        id="carbs"
                                        type="number"
                                        value={formData.target_carbs_g}
                                        onChange={(e) => setFormData({ ...formData, target_carbs_g: e.target.value })}
                                        placeholder="250"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center font-bold focus:border-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fat" className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Lipides (g)</Label>
                                    <Input
                                        id="fat"
                                        type="number"
                                        value={formData.target_fat_g}
                                        onChange={(e) => setFormData({ ...formData, target_fat_g: e.target.value })}
                                        placeholder="70"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center font-bold focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-sm font-bold uppercase tracking-wide shadow-[0_0_20px_-5px_theme(colors.emerald.500)]"
                        >
                            Protocole mis à jour avec succès
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D4AF37] text-black h-14 text-lg font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_-5px_#D4AF37] hover:bg-[#F5C518] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Synchronisation...' : 'Enregistrer le Protocole'}
                        {!loading && <Save className="ml-2 h-5 w-5" />}
                    </Button>
                </form>
            </main>
        </div>
    );
}
