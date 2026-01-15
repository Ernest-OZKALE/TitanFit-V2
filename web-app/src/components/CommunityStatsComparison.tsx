'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Award } from 'lucide-react';

interface CommunityStatsProps {
    userStats: {
        workouts: number;
        avgCalories: number;
        avgProtein: number;
        streak: number;
    };
}

export default function CommunityStatsComparison({ userStats }: CommunityStatsProps) {
    // Mock community averages (would come from database)
    const communityAvg = {
        workouts: 3.2,
        avgCalories: 2100,
        avgProtein: 120,
        streak: 4.5
    };

    const getComparison = (userValue: number, communityValue: number) => {
        const diff = ((userValue - communityValue) / communityValue) * 100;
        return {
            percentage: Math.abs(diff).toFixed(1),
            isAbove: diff > 0,
            diff: diff
        };
    };

    const metrics = [
        {
            name: 'Entraînements/semaine',
            userValue: userStats.workouts,
            communityValue: communityAvg.workouts,
            icon: TrendingUp,
            unit: ''
        },
        {
            name: 'Calories moyennes',
            userValue: userStats.avgCalories,
            communityValue: communityAvg.avgCalories,
            icon: Users,
            unit: ' kcal'
        },
        {
            name: 'Protéines moyennes',
            userValue: userStats.avgProtein,
            communityValue: communityAvg.avgProtein,
            icon: Award,
            unit: 'g'
        },
        {
            name: 'Streak moyen',
            userValue: userStats.streak,
            communityValue: communityAvg.streak,
            icon: TrendingUp,
            unit: ' jours'
        }
    ];

    return (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Vous vs Communauté
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {metrics.map((metric) => {
                    const comparison = getComparison(metric.userValue, metric.communityValue);
                    return (
                        <div key={metric.name} className="bg-white p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <metric.icon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">{metric.name}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${comparison.isAbove ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {comparison.isAbove ? '↑' : '↓'} {comparison.percentage}%
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Vous</p>
                                    <p className="text-xl font-bold text-purple-600">
                                        {metric.userValue}{metric.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Moyenne</p>
                                    <p className="text-xl font-bold text-gray-600">
                                        {metric.communityValue}{metric.unit}
                                    </p>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${comparison.isAbove ? 'bg-green-500' : 'bg-orange-500'}`}
                                    style={{ width: `${Math.min(100, (metric.userValue / metric.communityValue) * 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
                <p className="text-xs text-gray-500 text-center mt-4">
                    📊 Statistiques anonymisées basées sur 2,000+ utilisateurs actifs
                </p>
            </CardContent>
        </Card>
    );
}
