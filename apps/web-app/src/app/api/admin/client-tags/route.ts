/**
 * Admin API - Client Tags (Segmentation)
 * Manage client tags for segmentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name)) || false;
}

// GET: List all tags
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const userId = url.searchParams.get('user_id');

        // Get all tags with counts
        const { data: tags } = await supabase
            .from('client_tags')
            .select('*')
            .order('name');

        // Get user count per tag
        const tagsWithCounts = await Promise.all(
            (tags || []).map(async (tag: any) => {
                const { count } = await supabase
                    .from('user_tags')
                    .select('*', { count: 'exact', head: true })
                    .eq('tag_id', tag.id);
                return { ...tag, user_count: count || 0 };
            })
        );

        // If user_id provided, get that user's tags
        if (userId) {
            const { data: userTags } = await supabase
                .from('user_tags')
                .select('tag:client_tags(*)')
                .eq('user_id', userId);

            return NextResponse.json({
                tags: tagsWithCounts,
                user_tags: userTags?.map((ut: any) => ut.tag) || [],
            });
        }

        return NextResponse.json({ tags: tagsWithCounts });

    } catch (error) {
        console.error('Client tags error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create tag or assign to user
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { action, ...data } = body;

        if (action === 'create') {
            const { name, color, description } = data;
            if (!name) {
                return NextResponse.json({ error: 'Nom requis' }, { status: 400 });
            }

            const { data: tag, error } = await supabase
                .from('client_tags')
                .insert({ name, color: color || '#D4AF37', description })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    return NextResponse.json({ error: 'Ce tag existe déjà' }, { status: 409 });
                }
                throw error;
            }

            return NextResponse.json({ tag, message: 'Tag créé' }, { status: 201 });

        } else if (action === 'assign') {
            const { user_id, tag_id } = data;
            if (!user_id || !tag_id) {
                return NextResponse.json({ error: 'user_id et tag_id requis' }, { status: 400 });
            }

            const { error } = await supabase
                .from('user_tags')
                .upsert({
                    user_id,
                    tag_id,
                    assigned_by: user.id,
                }, { onConflict: 'user_id,tag_id' });

            if (error) throw error;

            return NextResponse.json({ message: 'Tag assigné' });

        } else {
            return NextResponse.json({ error: 'Action invalide (create|assign)' }, { status: 400 });
        }

    } catch (error) {
        console.error('Create/assign tag error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove tag or unassign from user
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const tagId = url.searchParams.get('tag_id');
        const userId = url.searchParams.get('user_id');

        if (userId && tagId) {
            // Unassign tag from user
            const { error } = await supabase
                .from('user_tags')
                .delete()
                .eq('user_id', userId)
                .eq('tag_id', tagId);

            if (error) throw error;
            return NextResponse.json({ message: 'Tag retiré de l\'utilisateur' });

        } else if (tagId) {
            // Delete tag entirely
            const { error } = await supabase
                .from('client_tags')
                .delete()
                .eq('id', tagId);

            if (error) throw error;
            return NextResponse.json({ message: 'Tag supprimé' });

        } else {
            return NextResponse.json({ error: 'tag_id requis' }, { status: 400 });
        }

    } catch (error) {
        console.error('Delete tag error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
