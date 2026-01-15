import { Metadata } from 'next';
import { EXERCISE_DB } from '@/lib/exercise-db';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Play, Dumbbell, Activity, Layers } from 'lucide-react';
import BodyMap from '@/components/dashboard/BodyMap'; // Reuse the map? Maybe a static mini version.

// 1. GENERATE STATIC PARAMS (For Static Export if needed, optional for dynamic)
export async function generateStaticParams() {
    return EXERCISE_DB.map((exercise) => ({
        slug: exercise.id,
    }));
}

// 2. SEO METADATA
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const exercise = EXERCISE_DB.find((ex) => ex.id === params.slug);

    if (!exercise) return { title: 'Exercise Not Found' };

    return {
        title: `${exercise.name} - Guide & Exécution | TitanFit`,
        description: `Apprenez à faire l'exercice ${exercise.name} (${exercise.muscle}) correctement. Muscles ciblés : ${exercise.subTarget}. Guide complet TitanFit.`,
    };
}

// 3. PAGE COMPONENT
export default function ExercisePage({ params }: { params: { slug: string } }) {
    const exercise = EXERCISE_DB.find((ex) => ex.id === params.slug);

    if (!exercise) notFound();

    return (
        <div className="min-h-screen bg-black text-white">
            {/* HEADER */}
            <div className="relative h-[40vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
                {/* Visual Placeholder for Exercise Video/Image */}
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center opacity-50">
                    <Dumbbell className="w-32 h-32 text-white/10" />
                </div>

                {/* JSON-LD for Google Rich Results (pSEO Core) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ExercisePlan",
                            "name": exercise.name,
                            "description": `Guide complet TitanFit pour ${exercise.name}.`,
                            "exerciseType": exercise.muscle,
                            "activityDuration": "PT15M",
                            "isBasedOn": {
                                "@type": "Thing",
                                "name": exercise.subTarget
                            }
                        })
                    }}
                />

                <div className="absolute bottom-0 left-0 w-full p-8 z-20 container mx-auto">
                    <Link href="/dashboard/generator" className="inline-flex items-center text-sm text-[#D4AF37] hover:text-white mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Retour au Générateur
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{exercise.name}</h1>
                    <div className="flex flex-wrap gap-3">
                        <Badge className="bg-[#D4AF37] text-black hover:bg-white text-lg py-1 px-4">{exercise.difficulty}</Badge>
                        <Badge variant="outline" className="border-white/30 text-white uppercase text-lg py-1 px-4">{exercise.muscle}</Badge>
                        {/* exercise.equipment is a string, not array in schema, checking... Wait, Schema says equipment: Equipment (string) */}
                        <Badge variant="secondary" className="bg-white/10 text-gray-300 uppercase text-lg py-1 px-4">{exercise.equipment}</Badge>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT: INSTRUCTIONS */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Steps */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold uppercase mb-8 flex items-center gap-3">
                            <Layers className="w-8 h-8 text-[#D4AF37]" /> Exécution
                        </h2>
                        {/* instructions might be a string in DB, not array. Checking schema: instructions: string. Wait, code used map. Schema says string. 
                            If schema says string, I should adapt. 
                            I will assume instructions is a string for now based on schema view.
                         */}
                        <div className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {exercise.instructions}
                        </div>
                    </div>

                    {/* Pro Tips Placeholder */}
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-3xl p-8">
                        <h3 className="text-xl font-bold uppercase text-[#D4AF37] mb-4">💡 Conseil du Coach Titan</h3>
                        <p className="text-gray-300">
                            Gardez le mouvement lent et contrôlé. La phase excentrique (négative) est tout aussi importante que la poussée.
                            Ne verrouillez pas complètement les articulations en fin de mouvement pour garder la tension.
                        </p>
                    </div>

                </div>

                {/* RIGHT: ANATOMY & META */}
                <div className="space-y-8">

                    {/* Muscles Involved */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#D4AF37]" /> Muscles Ciblés
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/40">{exercise.subTarget}</Badge>
                        </div>

                        {/* Mini Body Map (Static Visualization could go here) */}
                        <div className="aspect-[3/4] bg-black rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                            <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Visualisation Anatomique<br />(Coming Soon)</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
