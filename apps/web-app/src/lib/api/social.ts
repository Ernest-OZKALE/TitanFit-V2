import { supabase } from '@/lib/supabase';

export type SocialPost = {
    id: string;
    user_id: string;
    content: string;
    image_url?: string;
    type: 'workout' | 'meal' | 'status' | 'achievement'; // Front-end type
    activity_type: string; // DB column
    created_at: string;
    user: {
        username: string;
        avatar_url?: string;
        level?: string;
    };
    likes_count: number;
    comments_count: number;
    has_liked: boolean; // Computed by query
    metadata?: any;
};



export const SocialAPI = {
    /**
     * Fetch the global feed (or specific user feed)
     */
    async getFeedPosts(limit = 20, offset = 0) {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch posts with user info
        const { data, error } = await supabase
            .from('activity_feed')
            .select(`
        *,
        user:profiles(username, avatar_url),
        likes:activity_likes(count),
        comments:activity_comments(count)
      `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // 2. Enrich with "isLiked" state if user is logged in
        // Note: In a real app with millions of posts, this might need a more optimized query (e.g. .rpc)
        // but for now, checking client-side or separate query is fine for MVP.
        const enrichedPosts = await Promise.all(data.map(async (post) => {
            let hasLiked = false;
            if (user) {
                const { count } = await supabase
                    .from('activity_likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('activity_id', post.id)
                    .eq('user_id', user.id);
                hasLiked = (count || 0) > 0;
            }

            return {
                ...post,
                type: post.activity_type || 'status', // Map DB column to frontend type
                likes_count: post.likes?.[0]?.count || 0,
                comments_count: post.comments?.[0]?.count || 0,
                has_liked: hasLiked,
                // Map profile data correctly if it comes as an array or object depending on relation
                user: {
                    ...(Array.isArray(post.user) ? post.user[0] : post.user),
                    level: 'Titan V2' // Placeholder until gamification system is linked
                }
            } as SocialPost;
        }));

        return enrichedPosts;
    },

    /**
     * Create a new post
     */
    async createPost(content: string, type: SocialPost['type'] = 'status', imageUrl?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('activity_feed')
            .insert({
                user_id: user.id,
                content,
                activity_type: type, // Correct column mapping
                image_url: imageUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Toggle Like status
     */
    async toggleLike(postId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if already liked
        const { data: existing } = await supabase
            .from('activity_likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('activity_id', postId)
            .single();

        if (existing) {
            // Unlike
            await supabase
                .from('activity_likes')
                .delete()
                .eq('id', existing.id);
            return false; // Liked = false
        } else {
            // Like
            await supabase
                .from('activity_likes')
                .insert({
                    user_id: user.id,
                    activity_id: postId
                });
            return true; // Liked = true
        }
    },

    async deletePost(postId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('activity_feed')
            .delete()
            .eq('id', postId)
            .eq('user_id', user.id); // Security check handled by RLS too, but good practice

        if (error) throw error;
    },

    async getComments(postId: string) {
        const { data, error } = await supabase
            .from('activity_comments')
            .select(`
                *,
                user:profiles(username, avatar_url)
            `)
            .eq('activity_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    async addComment(postId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('activity_comments')
            .insert({
                activity_id: postId,
                user_id: user.id,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteComment(commentId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('activity_comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', user.id);

        if (error) throw error;
    }
};
