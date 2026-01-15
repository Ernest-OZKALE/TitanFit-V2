import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/meals - Get user's meal logs
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Single Meal Mode
        if (id) {
            const { data: meal, error } = await supabase
                .from('meals')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
                }
                throw error;
            }

            return NextResponse.json({ meal });
        }

        // List Mode
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const date = searchParams.get('date'); // Optional: filter by specific date

        let query = supabase
            .from('meals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (date) {
            // Filter by date (assuming logged_at column)
            query = query.gte('logged_at', `${date}T00:00:00`)
                .lte('logged_at', `${date}T23:59:59`);
        }

        const { data: meals, error } = await query.range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({ meals });
    } catch (error: any) {
        console.error('Get Meals Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/meals - Log a new meal
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, calories, protein, carbs, fat, meal_type, notes, logged_at } = body;

        if (!name || calories === undefined) {
            return NextResponse.json({ error: 'Name and calories are required' }, { status: 400 });
        }

        // Create meal log
        const { data: meal, error } = await supabase
            .from('meals')
            .insert({
                user_id: user.id,
                name,
                calories,
                protein: protein || 0,
                carbs: carbs || 0,
                fat: fat || 0,
                meal_type: meal_type || 'other', // breakfast, lunch, dinner, snack, other
                notes,
                logged_at: logged_at || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ meal }, { status: 201 });
    } catch (error: any) {
        console.error('Create Meal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/meals - Update a meal (requires ?id=)
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, calories, protein, carbs, fat, meal_type, notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { data: meal, error } = await supabase
            .from('meals')
            .update({
                name,
                calories,
                protein,
                carbs,
                fat,
                meal_type,
                notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ meal });
    } catch (error: any) {
        console.error('Update Meal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/meals - Delete a meal (requires ?id=)
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
            .from('meals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ message: 'Meal deleted successfully' });
    } catch (error: any) {
        console.error('Delete Meal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
