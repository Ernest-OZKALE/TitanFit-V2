import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Admin API: Manage Users
 * GET: List all users (profiles)
 * PATCH: Update user status or role
 */

export async function GET(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Check if user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role (assuming admin emails or a specific metadata)
    // In production, check a 'roles' table or user metadata
    const isAdmin = user.email?.endsWith('@titanfit.app') || user.id === process.env.NEXT_PUBLIC_ADMIN_ID;
    if (!isAdmin) {
        // Fallback check against profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    // Fetch profiles (publicly accessible user data)
    let query = supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: profiles, count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        users: profiles,
        total: count,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil((count || 0) / limit)
    });
}

export async function PATCH(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Auth check
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !adminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, ...updates } = body;

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update profile in public schema
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
}
