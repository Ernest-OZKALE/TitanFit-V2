'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';

interface Challenge {
    id: string;
    name: string;
    description: string;
    goal: string;
    startDate: string;
    endDate: string;
    participants: number;
    reward: number; // points
    progress: number; // 0-100
}

const mockChallenges: Challenge[] = [
    {
        id: '1',
        name: 'Janvier Titan',
        description: 'Entraînez-vous 20 jours en janvier',
        goal: '20 séances',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        participants: 1247,
        reward: 500,
        progress: 65
    },
    {
        id: '2',
        name: 'Roi des Protéines',
        description: 'Atteignez 150g de protéines pendant 7 jours',
        goal: '7 jours consécutifs',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        participants: 832,
        reward: 300,
        progress: 42
    },
    {
        id: '3',
        name: 'Distance 100km',
        description: 'Parcourez 100km ce mois-ci (course, vélo, marche)',
        goal: '100km',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        participants: 567,
        reward: 400,
        progress: 78
    }
];

export default function MonthlyChallenges() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Challenges du Mois</h2>
                <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Historique
                </Button>
            </div>

            {mockChallenges.map(challenge => (
                <Card key={challenge.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 mb-2">
                                    <Trophy className="h-5 w-5" />
                                    {challenge.name}
                                </CardTitle>
                                <p className="text-sm text-purple-100">{challenge.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{challenge.reward}</p>
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
                                <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Période :</span>
                                <span className="font-semibold">
                                    {new Date(challenge.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    {' - '}
                                    {new Date(challenge.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Votre progression</span>
                                    <span className="font-bold text-purple-600">{challenge.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                                        style={{ width: `${challenge.progress}%` }}
                                    />
                                </div>
                            </div>

                            {challenge.progress >= 100 ? (
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Challenge Complété ! 🎉
                                </Button>
                            ) : (
                                <Button className="w-full" variant="outline">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Continuer
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
