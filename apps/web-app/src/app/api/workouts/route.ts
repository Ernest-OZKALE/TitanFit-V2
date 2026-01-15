import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/workouts - Get user's workouts or specific workout
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Single Workout Mode
        if (id) {
            const { data: workout, error } = await supabase
                .from('workouts')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
                }
                throw error;
            }

            return NextResponse.json({ workout });
        }

        // List Mode
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Fetch workouts for the authenticated user
        const { data: workouts, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({ workouts });
    } catch (error: any) {
        console.error('Get Workouts Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/workouts - Create a new workout
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, exercises, notes, duration_minutes } = body;

        if (!name || !exercises) {
            return NextResponse.json({ error: 'Name and exercises are required' }, { status: 400 });
        }

        // Create workout
        const { data: workout, error } = await supabase
            .from('workouts')
            .insert({
                user_id: user.id,
                name,
                exercises, // JSONB column
                notes,
                duration_minutes,
                completed_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ workout }, { status: 201 });
    } catch (error: any) {
        console.error('Create Workout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/workouts - Update a workout (requires ?id=)
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, exercises, notes, duration_minutes } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Update workout
        const { data: workout, error } = await supabase
            .from('workouts')
            .update({
                name,
                exercises,
                notes,
                duration_minutes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id) // Ensure user owns this workout
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ workout });
    } catch (error: any) {
        console.error('Update Workout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/workouts - Delete a workout (requires ?id=)
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
            .from('workouts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Ensure user owns this workout

        if (error) throw error;

        return NextResponse.json({ message: 'Workout deleted successfully' });
    } catch (error: any) {
        console.error('Delete Workout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
