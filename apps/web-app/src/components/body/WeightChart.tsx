'use client';

import { motion } from 'framer-motion';

interface DataPoint {
    date: string;
    value: number;
}

interface WeightChartProps {
    data: DataPoint[];
}

export function WeightChart({ data }: WeightChartProps) {
    if (!data || data.length < 2) return null;

    // Normalisation basique
    const values = data.map(d => d.value);
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const range = max - min;

    // SVG Config
    const width = 800;
    const height = 300;
    const padding = 20;

    // Convert Data to Points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const normalizedVal = (d.value - min) / range;
        const y = height - (normalizedVal * (height - padding * 2)) - padding;
        return { x, y, val: d.value, date: d.date };
    });

    // Create Path (Simple Line for now, could be Bezier)
    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');

    // Area Path
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm p-6 relative">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Trajectoire</h3>

            <div className="relative w-full h-[200px] md:h-[300px]">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0.2, 0.4, 0.6, 0.8].map(h => (
                        <line
                            key={h}
                            x1="0"
                            y1={h * height}
                            x2={width}
                            y2={h * height}
                            stroke="#f1f5f9"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Area Fill */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        d={areaPath}
                        fill="url(#chartGradient)"
                    />

                    {/* Main Line */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={linePath}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    {/* Dots */}
                    {points.map((p, i) => (
                        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }}>
                            <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#D4AF37" strokeWidth="3" />
                            {/* Label on Hover - Simplified to static for now or last item */}
                            <text
                                x={p.x}
                                y={p.y - 15}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-500 uppercase"
                            >
                                {p.val}kg
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between mt-4 px-2">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-300 uppercase">{d.date.slice(5)}</span>
                ))}
            </div>
        </div>
    );
}
