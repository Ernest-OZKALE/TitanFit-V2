'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { StatsWidgetContent } from '@/types/cms';
import * as Icons from 'lucide-react';
import { variants } from '@/lib/animation-utils';

export default function StatsWidget({
    stats = [],
    no_data_text = "No Data",
    upgrade_prompt,
}: Partial<StatsWidgetContent>) {

    return (
        <section className="py-16 px-4 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto">

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={variants.staggerContainer}
                >
                    {stats.map((stat, index) => {
                        // Dynamic icon lookup
                        const IconComponent = (Icons as any)[stat.icon] || Icons.BarChart;
                        const colorMap: Record<string, string> = {
                            orange: 'text-orange-500',
                            violet: 'text-violet-500',
                            blue: 'text-blue-500',
                            green: 'text-green-500',
                            gold: 'text-[#D4AF37]',
                        };
                        const iconColor = colorMap[stat.color] || 'text-slate-500';

                        return (
                            <motion.div
                                key={index}
                                variants={variants.slideUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="relative p-6 bg-slate-900 border border-slate-800 shadow-xl overflow-hidden group hover:shadow-gold/20 hover:border-[#D4AF37]/30 transition-all duration-300">
                                    {/* Locked Overlay */}
                                    {stat.locked && (
                                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4">
                                            <Lock className="w-8 h-8 text-[#D4AF37] mb-2" />
                                            {upgrade_prompt && (
                                                <div className="text-center">
                                                    <h4 className="text-sm font-bold text-white mb-1">{upgrade_prompt.title}</h4>
                                                    <p className="text-xs text-slate-400 mb-3">{upgrade_prompt.description}</p>
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900 font-bold"
                                                    >
                                                        {upgrade_prompt.cta_text}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <IconComponent className={`w-6 h-6 ${iconColor}`} />
                                            <span className="text-xs text-slate-500">30 Days</span>
                                        </div>

                                        <div>
                                            <p className={`text-sm font-bold ${iconColor} uppercase tracking-wide`}>
                                                {stat.label}
                                            </p>
                                            <p className="text-4xl font-black text-white mt-2">{stat.value}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
