import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const { data, error } = await supabase
        .from('weight_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return data in chronological order for the chart, but fetched most recent first
    return NextResponse.json({
        data: data ? data.reverse() : [],
        count: data ? data.length : 0
    });
}

export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { weight_kg, body_fat_percentage, notes } = body;

        if (!weight_kg || weight_kg < 20 || weight_kg > 300) {
            return NextResponse.json({ error: 'Invalid weight value' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('weight_history')
            .insert({
                user_id: user.id,
                weight_kg,
                body_fat_percentage: body_fat_percentage || null,
                notes: notes || null,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Weight entry added successfully',
            data
        }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
