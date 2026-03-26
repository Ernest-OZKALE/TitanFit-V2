'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, PenSquare, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SwipeableItem } from '@/components/ui/SwipeableItem';

interface Post {
    id: string;
    content: string;
    image_url?: string;
    created_at: string;
    likes: number;
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string;
    };
    is_liked_by_user?: boolean;
}

export default function EnhancedSocialFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUser(user.id);
    };

    const fetchPosts = async () => {
        setLoading(true);
        // Fetch posts with author profiles
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles (username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching posts:', error);
            toast.error("Impossible de charger le fil d'actualité.");
        } else {
            setPosts(data as any || []);
        }
        setLoading(false);
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !currentUser) return;

        const { error } = await supabase
            .from('posts')
            .insert({
                user_id: currentUser,
                content: newPostContent.trim()
            });

        if (error) {
            toast.error("Erreur lors de la publication.");
            console.error(error);
        } else {
            toast.success("Post publié !");
            setNewPostContent('');
            fetchPosts(); // Refresh feed
        }
    };

    const handleDeletePost = async (postId: string) => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) toast.error("Erreur suppression.");
        else {
            toast.success("Post supprimé.");
            setPosts(posts.filter(p => p.id !== postId));
        }
    };

    // Placeholder for "Like" logic (Optimistic UI would make it snappy)
    const handleLike = async (postId: string) => {
        toast.info("Likes pas encore connectés à la DB (Phase suivante)");
    };

    if (loading) return <div className="text-center p-8 text-gray-500 animate-pulse">Chargement du Social Feed...</div>;

    return (
        <div className="space-y-6">

            {/* Create Post Widget */}
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-4 space-y-3">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarFallback>MOI</AvatarFallback>
                        </Avatar>
                        <Input
                            placeholder="Quoi de neuf, Titan ?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="bg-white/5 border-transparent focus:border-[#D4AF37]"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className="bg-[#D4AF37] hover:bg-[#b0912d] text-black font-bold"
                        >
                            <Send className="w-4 h-4 mr-2" /> Publier
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun post pour le moment.</p>
                    <p className="text-sm">Soyez le premier à partager votre progression !</p>
                </div>
            )}

            {/* Posts Feed */}
            {posts.map(post => (
                <SwipeableItem
                    key={post.id}
                    onSwipeRight={() => handleLike(post.id)}
                    onSwipeLeft={currentUser === post.user_id ? () => handleDeletePost(post.id) : undefined}
                    leftColor="bg-red-500/20"
                    rightColor="bg-titan-gold/20"
                    leftIcon={<Trash2 size={24} className="text-red-500" />}
                    rightIcon={<Heart size={24} className="text-titan-gold" />}
                    className="group"
                >
                    <Card className="border-none bg-transparent">
                        <CardContent className="p-0 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.profiles?.avatar_url} />
                                        <AvatarFallback>{post.profiles?.username?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm text-white">{post.profiles?.username || 'Utilisateur inconnu'}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-300 leading-relaxed font-light">{post.content}</p>

                            {/* Footer (Actions) */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs" onClick={() => handleLike(post.id)}>
                                        <Heart className="w-4 h-4" /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs">
                                        <MessageCircle className="w-4 h-4" /> Commenter
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </SwipeableItem>
            ))}
        </div>
    );
}
