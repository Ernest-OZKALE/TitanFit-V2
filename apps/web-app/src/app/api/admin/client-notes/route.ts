/**
 * Admin API - Client Notes
 * Internal notes on clients visible only to admin/staff
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin', 'moderator'].includes(a.role?.name)) || false;
}

// GET: Get notes for a client
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const clientId = url.searchParams.get('client_id');

        if (!clientId) {
            return NextResponse.json({ error: 'client_id requis' }, { status: 400 });
        }

        // Get notes (excluding private notes from other authors)
        const { data: notes, error } = await supabase
            .from('client_notes')
            .select(`
                id,
                content,
                note_type,
                is_pinned,
                is_private,
                created_at,
                updated_at,
                author:profiles!client_notes_author_id_fkey(id, display_name, email)
            `)
            .eq('client_id', clientId)
            .or(`is_private.eq.false,author_id.eq.${user.id}`)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Get note type counts
        const typeCounts: Record<string, number> = {};
        (notes || []).forEach((n: any) => {
            typeCounts[n.note_type] = (typeCounts[n.note_type] || 0) + 1;
        });

        return NextResponse.json({
            notes: notes || [],
            counts: typeCounts,
            total: notes?.length || 0,
        });

    } catch (error) {
        console.error('Client notes error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create note
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { client_id, content, note_type, is_pinned, is_private } = body;

        if (!client_id || !content) {
            return NextResponse.json({ error: 'client_id et content requis' }, { status: 400 });
        }

        const { data: note, error } = await supabase
            .from('client_notes')
            .insert({
                client_id,
                author_id: user.id,
                content,
                note_type: note_type || 'general',
                is_pinned: is_pinned || false,
                is_private: is_private || false,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ note, message: 'Note ajoutée' }, { status: 201 });

    } catch (error) {
        console.error('Create note error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update note
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Check ownership or admin
        const { data: existingNote } = await supabase
            .from('client_notes')
            .select('author_id')
            .eq('id', id)
            .single();

        if (!existingNote) {
            return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 });
        }

        // Only author or super_admin can edit
        const { data: userRoles } = await supabase
            .from('user_role_assignments')
            .select(`role:user_roles(name)`)
            .eq('user_id', user.id);

        const isSuperAdmin = userRoles?.some((r: any) => r.role?.name === 'super_admin');

        if (existingNote.author_id !== user.id && !isSuperAdmin) {
            return NextResponse.json({ error: 'Non autorisé à modifier cette note' }, { status: 403 });
        }

        const { data: note, error } = await supabase
            .from('client_notes')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ note, message: 'Note mise à jour' });

    } catch (error) {
        console.error('Update note error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove note
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

        // Check ownership
        const { data: note } = await supabase
            .from('client_notes')
            .select('author_id')
            .eq('id', id)
            .single();

        const { data: userRoles } = await supabase
            .from('user_role_assignments')
            .select(`role:user_roles(name)`)
            .eq('user_id', user.id);

        const isSuperAdmin = userRoles?.some((r: any) => r.role?.name === 'super_admin');

        if (note?.author_id !== user.id && !isSuperAdmin) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        await supabase.from('client_notes').delete().eq('id', id);

        return NextResponse.json({ message: 'Note supprimée' });

    } catch (error) {
        console.error('Delete note error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
