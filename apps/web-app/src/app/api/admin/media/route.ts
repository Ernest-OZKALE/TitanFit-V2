import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Admin API: Media Library
 * GET: List all media assets
 * POST: Record a new upload (or handle upload)
 * DELETE: Remove an asset
 */

export async function GET(req: NextRequest) {
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

    // Params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '40');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || ''; // 'image', 'video', etc.

    let query = supabaseAdmin
        .from('cms_media_library')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (search) {
        query = query.or(`filename.ilike.%${search}%,original_filename.ilike.%${search}%`);
    }

    if (type) {
        query = query.ilike('mime_type', `${type}%`);
    }

    const { data: media, count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        media,
        total: count,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil((count || 0) / limit)
    });
}

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: In Next.js App Router, we handle FormData for file uploads
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileExt = file.name.split('.').pop();
        const cleanName = file.name.replace(/[^\w.-]/g, '');
        const filename = `${Date.now()}-${cleanName}`;
        const filePath = `uploads/${folder}/${filename}`;

        // 1. Upload to Supabase Storage (Bucket 'media' as per existing service)
        const { data: storageData, error: storageError } = await supabaseAdmin.storage
            .from('media')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            return NextResponse.json({ error: storageError.message }, { status: 500 });
        }

        // 2. Get Public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('media')
            .getPublicUrl(filePath);

        // 3. Save record in database
        const { data: mediaRecord, error: dbError } = await supabaseAdmin
            .from('cms_media_library')
            .insert({
                filename,
                original_filename: file.name,
                public_url: urlData.publicUrl,
                storage_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                uploaded_by: user.id
            })
            .select()
            .single();

        if (dbError) {
            // Rollback storage if DB fails
            await supabaseAdmin.storage.from('media').remove([filePath]);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ media: mediaRecord });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('id');

    if (!mediaId) {
        return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    // 1. Get media info for storage path
    const { data: media, error: fetchError } = await supabaseAdmin
        .from('cms_media_library')
        .select('*')
        .eq('id', mediaId)
        .single();

    if (fetchError || !media) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const storagePath = media.storage_path;

    // 2. Delete from database
    const { error: dbError } = await supabaseAdmin
        .from('cms_media_library')
        .delete()
        .eq('id', mediaId);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 3. Delete from storage
    if (storagePath) {
        await supabaseAdmin.storage.from('media').remove([storagePath]);
    }

    return NextResponse.json({ success: true });
}
