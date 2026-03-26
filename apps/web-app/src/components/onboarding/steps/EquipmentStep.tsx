
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { OnboardingData } from '../types';
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Building2, Home, UserCheck, Settings2, Hammer } from 'lucide-react';

interface EquipmentStepProps {
    data: OnboardingData['equipment'];
    updateData: (data: Partial<OnboardingData['equipment']>) => void;
}

export function EquipmentStep({ data, updateData }: EquipmentStepProps) {

    const toggleItem = (listName: 'items' | 'machines', item: string) => {
        const currentList = data[listName] || [];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        updateData({ [listName]: newList });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase relative inline-block">
                    L'Arsenal <span className="text-gray-500">Logistique</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm">Inventaire des ressources matérielles disponibles.</p>
            </div>

            {/* 1. Location Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'commercial_gym', label: 'Commercial Gym', icon: Building2, desc: 'Accès complet machines' },
                    { id: 'home_gym', label: 'Home Gym', icon: Home, desc: 'Équipement personnel' },
                    { id: 'bodyweight_only', label: 'Street / Calisthenics', icon: UserCheck, desc: 'Poids du corps' },
                ].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => updateData({ location: option.id as any })}
                        className={`p-6 rounded-2xl border text-center transition-all group relative overflow-hidden ${data.location === option.id
                                ? 'bg-white text-black border-white'
                                : 'bg-black/40 border-white/10 text-gray-500 hover:bg-black/60 hover:border-white/30'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <option.icon className={`w-8 h-8 ${data.location === option.id ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
                            <div>
                                <div className="font-bold uppercase text-sm">{option.label}</div>
                                <div className={`text-[10px] uppercase tracking-wider mt-1 ${data.location === option.id ? 'text-gray-600' : 'text-gray-600'}`}>
                                    {option.desc}
                                </div>
                            </div>
                        </div>
                        {data.location === option.id && (
                            <motion.div
                                layoutId="activeLoc"
                                className="absolute inset-0 bg-white/10"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* 2. Dynamic Inventory */}
            <div className="min-h-[300px] p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* Commercial Gym View */}
                    {data.location === 'commercial_gym' && (
                        <motion.div
                            key="commercial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Settings2 className="w-5 h-5 text-[#D4AF37]" />
                                <Label className="text-lg font-bold text-white">Machinerie Disponible</Label>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Cochez les équipements auxquels vous avez accès dans votre salle.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    'Presse à Cuisses', 'Poulie Vis-à-Vis', 'Smith Machine (Cadre Guidé)',
                                    'Machine Ischio (Leg Curl)', 'Machine Quadriceps (Leg Ext)', 'Tirage Vertical (Lat Pull)',
                                    'Tirage Horizontal (Row)', 'Pec Deck / Butterfly', 'Station Dips / Tractions Assistes',
                                    'Hack Squat', 'Banc Développé Couché', 'Cage à Squat'
                                ].map((machine) => (
                                    <div
                                        key={machine}
                                        onClick={() => toggleItem('machines', machine)}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${data.machines?.includes(machine)
                                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                                                : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-sm border mr-2 flex items-center justify-center ${data.machines?.includes(machine) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600'
                                            }`}>
                                            {data.machines?.includes(machine) && <div className="w-2 h-2 bg-black rounded-[1px]" />}
                                        </div>
                                        <span className="text-xs font-bold uppercase">{machine}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Home Gym View */}
                    {data.location === 'home_gym' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Hammer className="w-5 h-5 text-[#D4AF37]" />
                                <Label className="text-lg font-bold text-white">Inventaire Personnel</Label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    'Haltères (Fixes)', 'Haltères (Ajustables)', 'Barre Olympique', 'Barre EZ',
                                    'Banc Plat', 'Banc Inclinable', 'Cage / Rack', 'Chandelles',
                                    'Barre de Traction', 'Bandes Élastiques', 'Kettlebells', 'Station Dips'
                                ].map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => toggleItem('items', item)}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${data.items?.includes(item)
                                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                                                : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-sm border mr-2 flex items-center justify-center ${data.items?.includes(item) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600'
                                            }`}>
                                            {data.items?.includes(item) && <div className="w-2 h-2 bg-black rounded-[1px]" />}
                                        </div>
                                        <span className="text-xs font-bold uppercase">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Calisthenics View */}
                    {data.location === 'bodyweight_only' && (
                        <motion.div
                            key="calisthenics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                        >
                            <UserCheck className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-white">Maîtrise Corporelle</h3>
                            <p className="text-gray-400 max-w-md">
                                Le programme se concentrera sur des mouvements au poids du corps et des variations d'intensité.
                            </p>

                            <div className="w-full max-w-md bg-black/20 p-4 rounded-xl border border-white/5 text-left mt-4">
                                <Label className="text-xs text-gray-500 mb-2 block uppercase">Avez-vous accès à ?</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Barre de Traction', 'Barres Parallèles (Dips)', 'Anneaux', 'Gilet Lesté'].map(item => (
                                        <Badge
                                            key={item}
                                            variant="outline"
                                            onClick={() => toggleItem('items', item)}
                                            className={`cursor-pointer justify-center py-2 ${data.items?.includes(item)
                                                    ? 'bg-white text-black border-white'
                                                    : 'text-gray-500 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
