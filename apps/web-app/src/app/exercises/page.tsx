import Link from 'next/link';
import { EXERCISE_DB } from '@/lib/exercise-db';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Dumbbell, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Annuaire des Exercices | TitanFit',
    description: 'Explorez la bibliothèque complète des exercices TitanFit. Musculation, étirements, et guides techniques.',
};

export default function ExerciseIndexPage() {
    // Basic alphabetical sort
    const exercises = [...EXERCISE_DB].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="min-h-screen bg-black text-white">
            {/* HERO */}
            <div className="py-24 px-4 text-center bg-gradient-to-b from-gray-900 to-black border-b border-white/10">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                    Bibliothèque <span className="text-[#D4AF37]">Titan</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                    L'encyclopédie biomécanique ultime. {exercises.length} mouvements référencés pour sculpter votre physique.
                </p>

                {/* Search Placeholder (Functional in future with Client Component wrapper) */}
                <div className="max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-black border border-white/20 rounded-full flex items-center px-4 py-3">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Rechercher un exercice..."
                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600"
                            disabled // Static page for now
                        />
                    </div>
                </div>
            </div>

            {/* DIRECTORY GRID */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map((ex) => (
                        <Link key={ex.id} href={`/exercises/${ex.id}`} className="group">
                            <Card className="bg-white/5 border-white/10 p-6 hover:border-[#D4AF37] transition-all h-full flex flex-col items-start backdrop-blur-sm group-hover:bg-white/10">
                                <div className="flex justify-between w-full mb-4">
                                    <div className="p-3 bg-black rounded-lg border border-white/10 text-[#D4AF37]">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="border-white/20 text-gray-400 text-xs uppercase self-start">
                                        {ex.muscle}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-[#D4AF37] transition-colors">
                                    {ex.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 w-full">
                                    <Badge className="bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] uppercase">
                                        {ex.difficulty}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-[10px]">
                                        {ex.subTarget}
                                    </Badge>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
