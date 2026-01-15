'use client';

import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PaywallContent } from '@/types/cms';

export default function PaywallSection({
    heading = "Libérez votre plein potentiel",
    benefits = ["Créez des routines illimitées", "Accès aux programmes", "Suivez des statistiques avancées"],
    rating = 5.0,
    testimonial = { author: "User10", text: "Incroyable", rating: 5 },
    cta_text = "Commencer mon parcours",
    pricing = { amount: "2,91", period: "mois", trial_text: "Seulement 2,91 € par mois (34,99 €/an)" },
}: Partial<PaywallContent>) {

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-20">
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37] opacity-5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-md w-full space-y-8">

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black text-white text-center leading-tight"
                >
                    {heading}
                </motion.h1>

                {/* Benefits List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 text-white">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                            <span className="text-base font-medium text-slate-200">{benefit}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Rating Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-[#D4AF37] text-[#D4AF37]" />
                        ))}
                    </div>
                    <span className="text-6xl font-black text-white">{rating.toFixed(1)}</span>
                    <p className="text-sm text-slate-400">Ce que les autres Forgers ont à dire</p>
                </motion.div>

                {/* Testimonial Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-xl">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-white">{testimonial.author}</span>
                                <div className="flex gap-0.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{testimonial.text}</p>
                        </div>
                    </Card>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <Button
                        size="lg"
                        className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold rounded-full shadow-2xl shadow-white/20"
                    >
                        {cta_text}
                    </Button>

                    {/* Pricing */}
                    <p className="text-center text-sm text-slate-400">{pricing.trial_text}</p>
                </motion.div>

                {/* Legal Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-slate-500 text-sm"
                >
                    <Check className="w-4 h-4" />
                    <span>Sans engagement - Annulez à tout moment</span>
                </motion.div>

            </div>
        </section>
    );
}
