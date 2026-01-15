'use client';

import { GlassCard } from '@/components/ui/premium-components';
import { MOCK_MUSCLE_DISTRIBUTION } from '@/lib/mock-stats-data';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

export function MuscleRadarChart() {
    const data = MOCK_MUSCLE_DISTRIBUTION;

    return (
        <GlassCard className="h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#D4AF37]" />
                        Analyse Musculaire
                    </h3>
                    <p className="text-slate-500 text-sm">Focus d'entraînement (30 jours)</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis
                            dataKey="muscle"
                            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 'bold' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Intensité"
                            dataKey="score"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            fill="#D4AF37"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 text-center">
                <p className="text-xs text-slate-400">
                    <span className="font-bold text-[#D4AF37]">Point Fort : </span> Jambes
                    <span className="mx-2">•</span>
                    <span className="font-bold text-slate-500">À travailler : </span> Épaules
                </p>
            </div>
        </GlassCard>
    );
}
