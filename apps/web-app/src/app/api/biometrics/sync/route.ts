import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side Supabase Client (Admin access may be needed if verify auth manually, 
// but here we rely on the RLS or an API Key approach for Shortcuts)

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, apiKey, metrics } = body;

    // 1. Basic Security: Check "Secret Key" (simulated for now, or match User ID)
    // In a real Shortcut, you'd pass a generated API Key. 
    // For this v1, we accept user_id if valid.

    if (!userId || !metrics) {
        return NextResponse.json({ error: 'Missing userId or metrics data' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 2. Insert Data into biometric_samples
    // Expected metrics format: [{ type: 'hrv', value: 45, unit: 'ms', date: '...' }]

    const samples = metrics.map((m: any) => ({
        user_id: userId,
        source: 'ios_shortcut', // Tagging the source
        metric_type: m.type,
        value: m.value,
        unit: m.unit,
        measured_at: m.date || new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('biometric_samples')
        .insert(samples)
        .select();

    if (error) {
        console.error('Supabase Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Trigger Energy Bank Recalculation (Optional: could be a DB trigger)
    // For now, we just confirm receipt.

    return NextResponse.json({ success: true, count: data.length });
}
