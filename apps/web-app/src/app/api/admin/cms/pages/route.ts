import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Admin API: CMS Page Management
 * GET: List all pages
 * POST: Create a new page
 */

export async function GET(req: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role check (Admin only)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Single Page Mode
    if (id) {
        // 1. Get Page
        const { data: page, error: pageError } = await supabaseAdmin
            .from('cms_pages')
            .select('*')
            .eq('id', id)
            .single();

        if (pageError || !page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // 2. Get Sections
        const { data: sections, error: sectionError } = await supabaseAdmin
            .from('cms_sections')
            .select('*')
            .eq('page_id', id)
            .order('order_index', { ascending: true });

        return NextResponse.json({
            page,
            sections: sections || []
        });
    }

    // List Mode
    const { data: pages, error } = await supabaseAdmin
        .from('cms_pages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role check (Admin only)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { title, slug } = body;

        if (!title || !slug) {
            return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
        }

        const { data: page, error } = await supabaseAdmin
            .from('cms_pages')
            .insert({
                title,
                slug,
                is_published: false
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ page });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { data: page, error } = await supabaseAdmin
            .from('cms_pages')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ page });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from('cms_pages')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
