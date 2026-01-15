import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/progress-photos - Get user's progress photos or specific photo
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Single Photo Mode
        if (id) {
            const { data: photo, error } = await supabase
                .from('progress_photos')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Progress photo not found' }, { status: 404 });
                }
                throw error;
            }

            return NextResponse.json({ photo });
        }

        // List Mode
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Fetch progress photos for the authenticated user
        const { data: photos, error } = await supabase
            .from('progress_photos')
            .select('*')
            .eq('user_id', user.id)
            .order('taken_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({ photos });
    } catch (error: any) {
        console.error('Get Progress Photos Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/progress-photos - Upload a new progress photo
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { photo_url, weight_kg, body_fat_percentage, notes, taken_at } = body;

        if (!photo_url) {
            return NextResponse.json({ error: 'Photo URL is required' }, { status: 400 });
        }

        // Create progress photo record
        const { data: photo, error } = await supabase
            .from('progress_photos')
            .insert({
                user_id: user.id,
                photo_url,
                weight_kg,
                body_fat_percentage,
                notes,
                taken_at: taken_at || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ photo }, { status: 201 });
    } catch (error: any) {
        console.error('Create Progress Photo Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// PATCH /api/progress-photos - Update a progress photo (requires ?id=)
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, weight_kg, body_fat_percentage, notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { data: photo, error } = await supabase
            .from('progress_photos')
            .update({
                weight_kg,
                body_fat_percentage,
                notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Progress photo not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ photo });
    } catch (error: any) {
        console.error('Update Progress Photo Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/progress-photos - Delete a progress photo (requires ?id=)
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

        const { error } = await supabase
            .from('progress_photos')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ message: 'Progress photo deleted successfully' });
    } catch (error: any) {
        console.error('Delete Progress Photo Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
