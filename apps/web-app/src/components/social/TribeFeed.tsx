'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, Trophy, Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { SocialAPI, type SocialPost } from '@/lib/api/social';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function TribeFeed() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // 1. Fetch Initial Posts & User
    const loadPosts = async () => {
        try {
            const [postsData, userResponse] = await Promise.all([
                SocialAPI.getFeedPosts(),
                supabase.auth.getUser()
            ]);

            setPosts(postsData);
            if (userResponse.data.user) {
                setCurrentUserId(userResponse.data.user.id);
            }
        } catch (error: any) {
            console.error('Feed error message:', error.message);
            console.error('Feed error details:', error.details);
            console.error('Feed error hint:', error.hint);
            toast.error(`Erreur Titan: ${error.message || 'Inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('tribe-feed-live')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'activity_feed'
                },
                (payload) => {
                    console.log('New post received!', payload);
                    // Optimistic update or reload? 
                    // For simplicity and accuracy with relations, we'll quick-reload the latest 1
                    // Or ideally, insert the payload if we had the user data included (which we don't in payload).
                    // Triggering a soft refresh for now.
                    loadPosts();
                    toast.success("Nouveau post détecté !");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 3. Handle Create Post
    const handlePost = async () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);

        try {
            await SocialAPI.createPost(newPostContent, 'status');
            setNewPostContent('');
            toast.success("Message transmis au Nexus.");
            // Subscription will pick it up, or we can reload manually to be safe immediately
            loadPosts();
        } catch (error) {
            console.error('Post error:', error);
            toast.error("Échec de la transmission.");
        } finally {
            setIsPosting(false);
        }
    };

    // 4. Handle Delete Post
    const handleDeletePost = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
        toast.info("Message supprimé.");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">

            {/* COMPOSER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-[#0F0F0F] border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors relative overflow-hidden"
            >
                {isPosting && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
                    </div>
                )}

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-black border border-white/10 shadow-[0_0_10px_#D4AF37]">
                        T
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Partagez votre conquête du jour..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 text-sm resize-none min-h-[60px]"
                        />
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-white/5 text-[#D4AF37] transition-colors"><ImageIcon className="w-5 h-5" /></button>
                                <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><Trophy className="w-5 h-5" /></button>
                            </div>
                            <Button
                                onClick={handlePost}
                                disabled={!newPostContent.trim() || isPosting}
                                className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold uppercase text-xs tracking-widest rounded-xl px-6 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPosting ? 'Envoi...' : 'Publier'}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* FEED */}
            <div className="space-y-6">
                {isLoading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
                    ))
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Le silence règne sur le Nexus.</p>
                        <p className="text-sm">Soyez le premier à parler.</p>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* END OF FEED */}
            {!isLoading && posts.length > 0 && (
                <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <span>Vous êtes à jour</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    </div>
                </div>
            )}
        </div>
    );
}
