/**
 * Admin API - Email Templates Management
 * CRUD for customizable email templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

// Check admin permission
async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name)) || false;
}

// GET: List all email templates
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        let query = supabase
            .from('email_templates')
            .select('*')
            .order('category')
            .order('name');

        if (category) {
            query = query.eq('category', category);
        }

        const { data: templates, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            templates: templates || [],
            categories: ['transactional', 'marketing', 'notification'],
        });

    } catch (error) {
        console.error('Email templates error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create new template
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { slug, name, subject, body_html, body_text, variables, category } = body;

        if (!slug || !name || !subject || !body_html) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
        }

        const { data: template, error } = await supabase
            .from('email_templates')
            .insert({
                slug,
                name,
                subject,
                body_html,
                body_text,
                variables: variables || [],
                category: category || 'transactional',
                created_by: user.id,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json({ template, message: 'Template créé' }, { status: 201 });

    } catch (error) {
        console.error('Create template error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update template
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

        const { data: template, error } = await supabase
            .from('email_templates')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ template, message: 'Template mis à jour' });

    } catch (error) {
        console.error('Update template error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove template
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
            .from('email_templates')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Template supprimé' });

    } catch (error) {
        console.error('Delete template error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
