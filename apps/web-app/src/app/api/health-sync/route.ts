import { NextRequest, NextResponse } from 'next/server';

// API endpoint to receive health data from iOS Shortcuts
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Structure the health data
        const healthRecord = {
            userId: data.userId,
            timestamp: new Date().toISOString(),
            weight: data.weight || null, // kg
            bodyFat: data.bodyFat || null, // %
            bmi: data.bmi || null,
            steps: data.steps || null,
            activeEnergy: data.activeEnergy || null, // kcal
            restingEnergy: data.restingEnergy || null, // kcal
            heartRate: data.heartRate || null, // bpm
            sleepHours: data.sleepHours || null,
            waterIntake: data.waterIntake || null, // ml
            // Nutrition from Apple Health (if logged there)
            calories: data.calories || null,
            protein: data.protein || null,
            carbs: data.carbs || null,
            fat: data.fat || null,
        };

        // Get existing records from localStorage simulation (in real app, use database)
        // For now, we'll store in a server-side cache or return for client-side storage

        console.log('[Health Sync] Received data:', healthRecord);

        return NextResponse.json({
            success: true,
            message: 'Données synchronisées avec succès!',
            record: healthRecord
        });

    } catch (error) {
        console.error('[Health Sync] Error:', error);
        return NextResponse.json({
            error: 'Erreur lors de la synchronisation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to retrieve sync status and last sync time
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Return sync status (in production, query database)
    return NextResponse.json({
        userId,
        lastSync: null, // Would come from DB
        status: 'ready',
        message: 'Prêt à recevoir les données Apple Santé'
    });
}
