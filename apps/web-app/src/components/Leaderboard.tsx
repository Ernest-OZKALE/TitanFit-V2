'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

interface LeaderboardProfile {
    id: string;
    username: string;
    avatar_url: string;
    points: number;
}

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // Fetch top 5 profiles ordered by points
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, points')
                .order('points', { ascending: false })
                .limit(5);

            if (data) setLeaders(data);
            setLoading(false);
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="h-64 bg-white/5 animate-pulse rounded-xl" />;

    return (
        <Card className="bg-gradient-to-b from-black/80 to-black/40 border-white/10 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                    <Crown className="h-5 w-5 fill-[#D4AF37]" />
                    Classement Titan
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {leaders.length === 0 && (
                    <p className="text-gray-500 text-sm text-center">Aucun classement disponible.</p>
                )}

                {leaders.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${index === 0
                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_15px_-5px_#D4AF37]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${index === 0 ? 'text-[#D4AF37] bg-black' :
                                    index === 1 ? 'text-gray-300 bg-gray-600' :
                                        index === 2 ? 'text-amber-700 bg-amber-900' : 'text-gray-500'
                                }`}>
                                {index + 1}
                            </div>
                            <Avatar className="w-10 h-10 border-2 border-white/10">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{user.username?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <span className={`font-bold ${index === 0 ? 'text-white text-lg' : 'text-gray-300'}`}>
                                {user.username || 'Anonyme'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-[#D4AF37]">{user.points || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Pts</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
