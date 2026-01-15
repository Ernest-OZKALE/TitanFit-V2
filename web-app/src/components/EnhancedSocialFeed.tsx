'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Post {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    type: 'workout' | 'meal' | 'progress' | 'story';
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
    isLiked: boolean;
}

interface Comment {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

const mockPosts: Post[] = [
    {
        id: '1',
        user: { name: 'Marie Dubois', avatar: 'MD' },
        type: 'workout',
        content: 'Séance Push incroyable aujourd\'hui ! 💪 Nouveau PR au développé couché : 80kg x 5',
        image: '/workout-progress.jpg',
        timestamp: 'Il y a 2h',
        likes: 24,
        comments: [
            { id: 'c1', user: 'Jean', text: 'Bravo ! Continue comme ça 🔥', timestamp: 'Il y a 1h' }
        ],
        isLiked: false
    },
    {
        id: '2',
        user: { name: 'Thomas Martin', avatar: 'TM' },
        type: 'meal',
        content: 'Meal prep du dimanche ✅ Prêt pour la semaine !',
        image: '/meal-prep.jpg',
        timestamp: 'Il y a 4h',
        likes: 18,
        comments: [],
        isLiked: true
    }
];

export default function EnhancedSocialFeed() {
    const [posts, setPosts] = useState(mockPosts);
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

    const toggleLike = (postId: string) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
                : post
        ));
    };

    const addComment = (postId: string) => {
        if (!newComment[postId]?.trim()) return;

        setPosts(posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    comments: [
                        ...post.comments,
                        {
                            id: `c${Date.now()}`,
                            user: 'Vous',
                            text: newComment[postId],
                            timestamp: 'À l\'instant'
                        }
                    ]
                }
                : post
        ));
        setNewComment({ ...newComment, [postId]: '' });
    };

    return (
        <div className="space-y-6">
            {/* Stories Section */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <Avatar>
                                        <AvatarFallback>+</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            <span className="text-xs text-gray-600">Votre story</span>
                        </div>
                        {['Alice', 'Bob', 'Charlie', 'Diana'].map(name => (
                            <div key={name} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <Avatar>
                                            <AvatarFallback>{name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600">{name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Posts Feed */}
            {posts.map(post => (
                <Card key={post.id}>
                    <CardContent className="p-4 space-y-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{post.user.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{post.user.name}</p>
                                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Post Content */}
                        <p className="text-sm">{post.content}</p>

                        {/* Post Image */}
                        {post.image && (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Image: {post.image}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleLike(post.id)}
                                    className={post.isLiked ? 'text-red-500' : ''}
                                >
                                    <Heart className={`h-5 w-5 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                                    {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MessageCircle className="h-5 w-5 mr-1" />
                                    {post.comments.length}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Comments */}
                        {post.comments.length > 0 && (
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="text-sm">
                                        <span className="font-semibold">{comment.user}</span>{' '}
                                        <span className="text-gray-700">{comment.text}</span>
                                        <p className="text-xs text-gray-500 mt-0.5">{comment.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Comment */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ajouter un commentaire..."
                                value={newComment[post.id] || ''}
                                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                                className="flex-1"
                            />
                            <Button size="sm" onClick={() => addComment(post.id)}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
