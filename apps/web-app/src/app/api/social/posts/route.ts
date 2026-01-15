import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/social/posts - Get social feed posts or specific post
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Single Post Mode
        if (id) {
            const { data: post, error } = await supabase
                .from('social_posts')
                .select(`
                    *,
                    profiles:user_id (id, username, avatar_url),
                    likes:post_likes (user_id),
                    comments:post_comments (
                        id, content, created_at,
                        profiles:user_id (id, username, avatar_url)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
                }
                throw error;
            }

            const transformedPost = {
                ...post,
                like_count: post.likes?.length || 0,
                comment_count: post.comments?.length || 0,
                user_liked: post.likes?.some((like: any) => like.user_id === user.id) || false,
                author: post.profiles
            };

            return NextResponse.json({ post: transformedPost });
        }

        // List Mode
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const filter = searchParams.get('filter') || 'all'; // all, following, mine

        let query = supabase
            .from('social_posts')
            .select(`
                *,
                profiles:user_id (id, username, avatar_url),
                likes:post_likes (user_id),
                comments:post_comments (id)
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (filter === 'mine') {
            query = query.eq('user_id', user.id);
        }

        const { data: posts, error } = await query;

        if (error) throw error;

        // Transform to include like count and user liked status
        const transformedPosts = posts?.map(post => ({
            ...post,
            like_count: post.likes?.length || 0,
            comment_count: post.comments?.length || 0,
            user_liked: post.likes?.some((like: any) => like.user_id === user.id) || false,
            author: post.profiles
        }));

        return NextResponse.json({ posts: transformedPosts });
    } catch (error: any) {
        console.error('Get Posts Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/social/posts - Create a new post
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { content, image_url, post_type, workout_id } = body;

        if (!content && !image_url) {
            return NextResponse.json({ error: 'Content or image is required' }, { status: 400 });
        }

        // Create post
        const { data: post, error } = await supabase
            .from('social_posts')
            .insert({
                user_id: user.id,
                content,
                image_url,
                post_type: post_type || 'status', // status, workout, progress, achievement
                workout_id
            })
            .select(`
                *,
                profiles:user_id (id, username, avatar_url)
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({
            post: {
                ...post,
                like_count: 0,
                comment_count: 0,
                user_liked: false,
                author: post.profiles
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create Post Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// DELETE /api/social/posts - Delete own post (requires ?id=)
export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Delete post (RLS ensures user can only delete their own)
        const { error } = await supabase
            .from('social_posts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        console.error('Delete Post Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
