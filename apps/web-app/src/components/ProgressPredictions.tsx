'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressPredictions() {
    // Generate prediction data (3 months ahead)
    const today = new Date();
    const historicalData = [
        { week: '4 sem', weight: 85, predicted: null },
        { week: '3 sem', weight: 84, predicted: null },
        { week: '2 sem', weight: 83.5, predicted: null },
        { week: '1 sem', weight: 82.8, predicted: null },
        { week: 'Aujourd\'hui', weight: 82, predicted: 82 },
    ];

    const futurePredictions = [
        { week: 'Aujourd\'hui', weight: 82, predicted: 82 },
        { week: '+1 sem', weight: null, predicted: 81.2 },
        { week: '+2 sem', weight: null, predicted: 80.5 },
        { week: '+4 sem', weight: null, predicted: 79.2 },
        { week: '+6 sem', weight: null, predicted: 78.1 },
        { week: '+8 sem', weight: null, predicted: 77.2 },
        { week: '+10 sem', weight: null, predicted: 76.5 },
        { week: '+12 sem', weight: null, predicted: 76 },
    ];

    const allData = [...historicalData, ...futurePredictions.slice(1)];

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors pointer-events-none" />

            <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-white font-black uppercase tracking-tighter">
                    <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                    Trajectoire Titan
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={allData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="week"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                axisLine={{ stroke: '#ffffff20' }}
                                tickLine={{ stroke: '#ffffff20' }}
                            />
                            <YAxis
                                domain={[75, 86]}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                axisLine={{ stroke: '#ffffff20' }}
                                tickLine={{ stroke: '#ffffff20' }}
                                orientation="right"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000000e0',
                                    borderColor: '#D4AF3740',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#D4AF37"
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#D4AF37', strokeWidth: 0 }}
                                name="Poids actuel"
                            />
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#ffffff40"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ r: 3, fill: '#ffffff40', strokeWidth: 0 }}
                                name="Trajectoire Alpha"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center group/item hover:border-[#D4AF37]/30 transition-colors">
                        <Target className="h-4 w-4 text-[#D4AF37] mx-auto mb-2" />
                        <p className="text-xl font-black text-white tracking-tighter">76kg</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Échéance</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center group/item hover:border-[#D4AF37]/30 transition-colors">
                        <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-2" />
                        <p className="text-xl font-black text-white tracking-tighter">-6kg</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Delta</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center group/item hover:border-[#D4AF37]/30 transition-colors">
                        <Calendar className="h-4 w-4 text-blue-400 mx-auto mb-2" />
                        <p className="text-xl font-black text-white tracking-tighter">12sm</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Window</p>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl border-l-2 border-[#D4AF37] text-[11px] text-gray-300">
                    <p className="font-black text-[#D4AF37] mb-2 uppercase tracking-widest">Modèle Prédictif Titan</p>
                    <ul className="space-y-1 opacity-80 font-medium">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Analyse biométrique active</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Corrélation Profils Élite</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> Trajectoire Linéaire</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
