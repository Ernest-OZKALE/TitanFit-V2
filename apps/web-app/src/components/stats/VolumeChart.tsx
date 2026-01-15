'use client';

import { GlassCard } from '@/components/ui/premium-components';
import { MOCK_WORKOUT_VOLUME } from '@/lib/mock-stats-data';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Dumbbell } from 'lucide-react';

export function VolumeChart() {
    const data = MOCK_WORKOUT_VOLUME;

    return (
        <GlassCard className="h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-[#D4AF37]" />
                        Volume & Intensité
                    </h3>
                    <p className="text-slate-500 text-sm">Tonnage vs RPE moyen</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="date"
                            stroke="#94A3B8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#94A3B8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#94A3B8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 10]}
                            label={{ value: 'RPE', angle: 90, position: 'insideRight', fill: '#94A3B8', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                            labelStyle={{ color: '#94A3B8' }}
                        />
                        <Bar yAxisId="left" dataKey="volume" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.8} name="Volume" />
                        <Line yAxisId="right" type="monotone" dataKey="intensity" stroke="#4F46E5" strokeWidth={2} dot={false} name="Intensité (RPE)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
