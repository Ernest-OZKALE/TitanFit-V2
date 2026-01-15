/**
 * Admin API - SEO Redirects
 * Manage 301/302 redirects
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

// GET: List redirects
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { data: redirects, error } = await supabase
            .from('url_redirects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ redirects: redirects || [] });

    } catch (error) {
        console.error('Redirects error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create redirect
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { source_path, target_path, status_code, is_active } = body;

        if (!source_path || !target_path) {
            return NextResponse.json({ error: 'URLs requises' }, { status: 400 });
        }

        const { data: redirect, error } = await supabase
            .from('url_redirects')
            .insert({
                source_path: source_path.startsWith('/') ? source_path : `/${source_path}`,
                target_path: target_path.startsWith('/') ? target_path : `/${target_path}`,
                status_code: status_code || 301,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Cette redirection existe déjà' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json({ redirect, message: 'Redirection créée' }, { status: 201 });

    } catch (error) {
        console.error('Create redirect error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove redirect
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const { error } = await supabase
            .from('url_redirects')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Redirection supprimée' });

    } catch (error) {
        console.error('Delete redirect error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
