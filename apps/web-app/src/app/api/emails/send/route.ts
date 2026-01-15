import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';
import { emailTemplates } from '@/lib/email-templates';

// POST /api/emails/send - Send email notifications
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { type, data } = body;

        // Get user profile for personalization
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', user.id)
            .single();

        const username = profile?.username || user.email?.split('@')[0] || 'Athlete';
        const email = user.email;

        if (!email) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        let subject = '';
        let html = '';

        switch (type) {
            case 'welcome':
                subject = `Bienvenue chez TitanFit, ${username} 💪`;
                html = emailTemplates.welcome(username);
                break;

            case 'subscription_confirmation':
                subject = `🔥 Tu es maintenant Titan Pro, ${username}`;
                html = emailTemplates.subscriptionConfirmation(username, data?.planName || 'Titan Pro');
                break;

            case 'subscription_cancellation':
                subject = `Ton abonnement Titan Pro a été annulé`;
                html = emailTemplates.subscriptionCancellation(username);
                break;

            case 'streak_reminder':
                subject = `⚠️ Ton streak de ${data?.currentStreak || 0} jours est en danger!`;
                html = emailTemplates.streakReminder(username, data?.currentStreak || 0);
                break;

            case 'workout_reminder':
                subject = `Ça fait ${data?.daysSince || 2} jours... On reprend?`;
                html = emailTemplates.workoutReminder(username, data?.daysSince || 2);
                break;

            case 'achievement_unlocked':
                subject = `🏆 Achievement Débloqué: ${data?.achievementName}`;
                html = emailTemplates.achievementUnlocked(
                    username,
                    data?.achievementName || 'Unknown',
                    data?.achievementDescription || '',
                    data?.xpEarned || 100
                );
                break;

            case 'weekly_digest':
                subject = `📊 Ton Bilan Hebdo TitanFit`;
                html = emailTemplates.weeklyDigest(username, {
                    workouts: data?.workouts || 0,
                    totalMinutes: data?.totalMinutes || 0,
                    caloriesBurned: data?.caloriesBurned || 0,
                    streak: data?.streak || 0,
                    weeklyGoalMet: data?.weeklyGoalMet || false
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        // Replace placeholders
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        html = html
            .replace(/{app_url}/g, appUrl)
            .replace(/{unsubscribe_url}/g, `${appUrl}/settings/notifications`)
            .replace(/{preferences_url}/g, `${appUrl}/settings/notifications`);

        const result = await sendEmail({
            to: email,
            subject,
            html
        });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Send Email Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
