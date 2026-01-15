'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, TrendingUp, Dumbbell, Award, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import TitaniumBackground from '@/components/TitaniumBackground';
import { cn } from '@/lib/utils';

export default function FeedPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchFeed();
    }, [user]);

    async function fetchFeed() {
        const { data, error } = await supabase
            .from('activity_feed')
            .select(`
                *,
                profiles (username, avatar_url),
                activity_likes (count),
                activity_comments (count)
            `)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            setActivities(data);
        }
        setLoading(false);
    }

    async function handleLike(activityId: string) {
        const { error } = await supabase
            .from('activity_likes')
            .insert([{ activity_id: activityId, user_id: user?.id }]);

        if (!error) {
            fetchFeed();
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#D4AF37]"></div>
            </div>
        );
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'workout':
                return <Dumbbell className="h-5 w-5 text-[#D4AF37]" />;
            case 'achievement':
                return <Award className="h-5 w-5 text-yellow-500" />;
            case 'weight_update':
                return <TrendingUp className="h-5 w-5 text-emerald-500" />;
            default:
                return <Heart className="h-5 w-5 text-pink-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden text-gray-100">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 backdrop-blur-xl bg-black/60 border-b border-white/5 sticky top-0">
                <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-white p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                Titan <span className="text-[#D4AF37]">Feed</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Community Activity Stream</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
                {activities.length === 0 ? (
                    <div className="p-12 rounded-[2rem] bg-[#0F0F0F] border border-white/5 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="h-10 w-10 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase">No Activity Yet</h3>
                        <p className="text-gray-400 mb-6">Start following users to see their activity</p>
                        <Link href="/social">
                            <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl px-6">
                                Discover Titans
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activities.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-[2rem] bg-[#0F0F0F] border border-white/5 overflow-hidden hover:border-[#D4AF37]/30 transition-all group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-black text-lg shadow-lg">
                                            {activity.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{activity.profiles?.username || 'User'}</h3>
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase">
                                                    {getActivityIcon(activity.activity_type)}
                                                    <span>{activity.activity_type.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(activity.created_at).toLocaleDateString('fr-FR')} à{' '}
                                                {new Date(activity.created_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-200 mb-4 leading-relaxed">{activity.content}</p>

                                    {activity.image_url && (
                                        <img
                                            src={activity.image_url}
                                            alt="Activity"
                                            className="w-full rounded-xl mb-4 border border-white/5"
                                        />
                                    )}

                                    <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleLike(activity.id)}
                                            className="text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl"
                                        >
                                            <Heart className="h-4 w-4 mr-1.5" />
                                            {activity.activity_likes?.length || 0}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl">
                                            <MessageCircle className="h-4 w-4 mr-1.5" />
                                            {activity.activity_comments?.length || 0}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl">
                                            <Share2 className="h-4 w-4 mr-1.5" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
