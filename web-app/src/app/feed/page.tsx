'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, TrendingUp, Dumbbell, Award } from 'lucide-react';

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
            fetchFeed(); // Refresh feed
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'workout':
                return <Dumbbell className="h-5 w-5 text-orange-500" />;
            case 'achievement':
                return <Award className="h-5 w-5 text-yellow-500" />;
            case 'weight_update':
                return <TrendingUp className="h-5 w-5 text-green-500" />;
            default:
                return <Heart className="h-5 w-5 text-pink-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
                    <p className="text-sm text-gray-600">See what others are achieving</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {activities.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-12">
                            <div className="text-center">
                                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
                                <p className="text-gray-600 mb-4">Start following users to see their activity</p>
                                <Link href="/discover">
                                    <Button className="gradient-bg text-white">Discover Users</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <Card key={activity.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                                            {activity.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold text-gray-900">{activity.profiles?.username || 'User'}</h3>
                                                <Badge variant="outline" className="capitalize">
                                                    {getActivityIcon(activity.activity_type)}
                                                    <span className="ml-1">{activity.activity_type.replace('_', ' ')}</span>
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(activity.created_at).toLocaleDateString()} at{' '}
                                                {new Date(activity.created_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-900 mb-4">{activity.content}</p>

                                    {activity.image_url && (
                                        <img
                                            src={activity.image_url}
                                            alt="Activity"
                                            className="w-full rounded-lg mb-4"
                                        />
                                    )}

                                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleLike(activity.id)}
                                            className="text-gray-600 hover:text-pink-500"
                                        >
                                            <Heart className="h-4 w-4 mr-1" />
                                            {activity.activity_likes?.length || 0}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                                            <MessageCircle className="h-4 w-4 mr-1" />
                                            {activity.activity_comments?.length || 0}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                                            <Share2 className="h-4 w-4 mr-1" />
                                            Share
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
