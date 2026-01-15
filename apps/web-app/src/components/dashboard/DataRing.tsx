'use client';

import { motion } from 'framer-motion';

interface DataRingProps {
    value: number; // 0 to 100
    color: string;
    icon?: any;
    label: string;
    subValue: string;
    suffix?: string;
    delay?: number;
}

export function DataRing({ value, color, icon: Icon, label, subValue, suffix, delay = 0 }: DataRingProps) {
    const radius = 40;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.1)' }}
            className="group relative p-4 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-between overflow-hidden shadow-lg backdrop-blur-md"
        >
            {/* Background Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
            />

            {/* Label Top */}
            <div className="w-full flex justify-between items-center mb-2 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{label}</span>
                {Icon && <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />}
            </div>

            {/* The Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center my-2 z-10">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90 overflow-visible w-full h-full"
                >
                    {/* Ring Background */}
                    <circle
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Ring Progress */}
                    <motion.circle
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                    />
                </svg>

                {/* Center Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 20px ${color}66` }}>
                        {subValue}
                    </span>
                    {suffix && <span className="text-[9px] font-bold text-gray-500 uppercase">{suffix}</span>}
                </div>
            </div>

            {/* Bottom Status (Optional) */}
            <div className="w-full text-center z-10">
                <div className="text-[9px] text-gray-600 font-mono group-hover:text-gray-400 transition-colors">
                    OPTIMAL
                </div>
            </div>
        </motion.div>
    );
}
