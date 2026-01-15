'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
    {
        name: "Marc D.",
        role: "Entrepreneur",
        quote: "Je n'avais pas besoin d'un énième programme PDF. J'avais besoin d'un système qui s'adapte à mon emploi du temps chaotique. TitanFit a tout changé.",
        stats: "-8kg en 12 semaines"
    },
    {
        name: "Sophie L.",
        role: "CrossFit Elite",
        quote: "La précision des macros est effrayante. Mes performances ont explosé dès que j'ai commencé à suivre le cycle nutritionnel. C'est du dopage légal.",
        stats: "+15% PR Squat"
    },
    {
        name: "Thomas V.",
        role: "Ex-Obèse",
        quote: "J'ai tout essayé pendant 10 ans. Céto, Paléo, Jeûne. Tout échouait après 2 mois. TitanFit est le seul truc qui a tenu sur la durée. J'ai une nouvelle vie.",
        stats: "-22kg maintenus"
    }
];

const faqs = [
    {
        q: "Est-ce adapté aux débutants ?",
        a: "Oui. Le Moteur Neural scanne votre niveau actuel. Si vous ne pouvez faire que 5 pompes, il ne vous en demandera pas 50. Il construira la route vers les 50."
    },
    {
        q: "Dois-je entrer mes données manuellement ?",
        a: "Non. TitanFit fusionne avec Apple Health et Google Fit. Plus vous avez de données, plus le Système est précis."
    },
    {
        q: "Pourquoi un abonnement et pas un achat unique ?",
        a: "Parce que votre corps n'est pas unique. Il change tous les jours. Un programme fixe devient obsolète en 3 semaines. TitanFit évolue avec vous, pour toujours."
    },
    {
        q: "Puis-je annuler à tout moment ?",
        a: "Absolument. Aucune chaîne, aucun contrat caché. Vous gérez votre abonnement en un clic depuis votre espace membre. Liberté totale."
    },
    {
        q: "Comment fonctionne l'IA exactement ?",
        a: "Elle analyse vos performances passées, votre sommeil et votre récupération pour générer l'entraînement optimal du JOUR MÊME. Pas de plan statique, c'est du coaching dynamique."
    },
    {
        q: "Est-ce que la nutrition est incluse ?",
        a: "Oui, et pas des plans PDF génériques. TitanFit calcule vos besoins caloriques au gramme près selon votre activité journalière réelle (calories actives)."
    },
    {
        q: "J'ai des blessures, est-ce compatible ?",
        a: "Vous pouvez exclure certains mouvements ou zones corporelles. L'algorithme contournera vos limitations pour vous faire progresser sans risque."
    }
];

export function Testimonials() {
    return (
        <section className="py-32 px-4 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">L'Avant-Garde</h2>
                    <p className="text-slate-500">Ceux qui ont franchi le pas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-[#D4AF37]/30 transition-colors shadow-sm">
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-slate-200 group-hover:text-[#D4AF37]/20 transition-colors" />
                            <div className="flex text-[#D4AF37] mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-600 mb-8 leading-relaxed">"{t.quote}"</p>
                            <div className="border-t border-slate-200 pt-6">
                                <div className="text-slate-900 font-bold text-lg">{t.name}</div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider mb-2">{t.role}</div>
                                <div className="inline-block px-3 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold">{t.stats}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-32 px-4 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Questions Fréquentes</h2>
                    <p className="text-slate-500">Logique Implacable.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-100 transition-colors"
                            >
                                <span className="font-bold text-slate-900 text-lg">{f.q}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{ height: open === i ? 'auto' : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-200">
                                    {f.a}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
