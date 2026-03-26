'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Challenge {
    id: string;
    name: string;
    description: string;
    goal: string;
    start_date: string;
    end_date: string;
    participants_count: number;
    reward_points: number;
}

export default function MonthlyChallenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            const { data, error } = await supabase
                .from('challenges')
                .select('*')
                .order('end_date', { ascending: true }); // Most urgent first

            if (error) console.error(error);
            else setChallenges(data || []);
            setLoading(false);
        };
        fetchChallenges();
    }, []);

    const joinChallenge = async (challengeId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return toast.error("Connectez-vous pour rejoindre un challenge !");

        const { error } = await supabase.from('user_challenges').insert({
            user_id: user.id,
            challenge_id: challengeId,
            status: 'active'
        });

        if (error?.code === '23505') { // Unique violation
            toast.info("Déjà inscrit à ce challenge !");
        } else if (error) {
            toast.error("Erreur lors de l'inscription.");
        } else {
            toast.success("Challenge rejoint ! Bonne chance Titan.");
            // Refresh logic could be here (optimistic update better)
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Challenges & Concours</h2>
                <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Historique
                </Button>
            </div>

            {challenges.length === 0 && (
                <div className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                    Aucun challenge actif pour le moment. Revenez bientôt !
                </div>
            )}

            {challenges.map(challenge => (
                <Card key={challenge.id} className="overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 mb-2">
                                    <Trophy className="h-5 w-5 text-yellow-300" />
                                    {challenge.name}
                                </CardTitle>
                                <p className="text-sm text-purple-100">{challenge.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{challenge.reward_points}</p>
                                <p className="text-xs text-purple-100">points</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Objectif :</span>
                                <span className="font-semibold">{challenge.goal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Participants :
                                </span>
                                <span className="font-semibold px-2 py-0.5 bg-gray-100 rounded text-xs">
                                    {challenge.participants_count || 0} Titans
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Fin du challenge :</span>
                                <span className="font-semibold text-red-500">
                                    {new Date(challenge.end_date).toLocaleDateString()}
                                </span>
                            </div>

                            <Button
                                className="w-full bg-[#D4AF37] hover:bg-[#b0912d] text-black font-bold"
                                onClick={() => joinChallenge(challenge.id)}
                            >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Rejoindre le Combat
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
