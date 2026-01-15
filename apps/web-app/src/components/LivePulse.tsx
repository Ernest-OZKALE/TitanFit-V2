'use client';

import { motion } from 'framer-motion';
import { Activity, Zap, Users, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function LivePulse() {
    return (
        <section className="py-24 bg-[#0F172A] relative overflow-hidden">
            {/* Background Map Effect */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center bg-no-repeat grayscale mix-blend-overlay" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-6"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
                        </span>
                        <span className="font-bold tracking-widest text-xs uppercase">En Direct</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">L'Écosystème <span className="text-[#D4AF37]">Pulse</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Rejoignez une communauté mondiale qui ne dort jamais. Chaque seconde, un record est battu.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <PulseCard
                        icon={<Users className="h-6 w-6 text-blue-400" />}
                        value="12,405"
                        label="Athlètes Actifs"
                        delay={0}
                    />
                    <PulseCard
                        icon={<Zap className="h-6 w-6 text-yellow-400" />}
                        value="845,032"
                        label="Calories Brûlées (24h)"
                        delay={0.1}
                    />
                    <PulseCard
                        icon={<Activity className="h-6 w-6 text-green-400" />}
                        value="4,240"
                        label="Workouts Complétés"
                        delay={0.2}
                    />
                    <PulseCard
                        icon={<Trophy className="h-6 w-6 text-[#D4AF37]" />}
                        value="128"
                        label="Nouveaux PRs"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}

function PulseCard({ icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <Card className="bg-white/5 border-white/10 backdrop-blur-md p-6 text-center hover:bg-white/10 transition-colors group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-4 text-[#D4AF37] border border-white/10 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
            </Card>
        </motion.div>
    );
}
