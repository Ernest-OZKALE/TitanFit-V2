
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();
        const email = user.email; // Force use of authenticated email

        const firstName = name?.split(' ')[0] || 'Titan';

        const subject = `Bienvenue dans l'Élite, ${firstName} ⚡`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur TitanFit</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #0c0a09; padding: 40px; text-align: center; }
        .logo { color: #D4AF37; font-size: 28px; font-weight: 800; letter-spacing: 2px; text-decoration: none; }
        .content { padding: 40px; }
        .h1 { color: #1c1917; font-size: 24px; font-weight: 700; margin-bottom: 20px; }
        .text { color: #57534e; font-size: 16px; margin-bottom: 24px; }
        .highlight { color: #D4AF37; font-weight: 600; }
        .btn { display: inline-block; background-color: #D4AF37; color: #0c0a09; padding: 14px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; margin-top: 10px; }
        .footer { background-color: #fafaf9; padding: 24px; text-align: center; font-size: 14px; color: #a8a29e; }
        .social { margin-top: 16px; }
        .social-link { color: #57534e; text-decoration: none; margin: 0 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TITANFIT</div>
        </div>
        <div class="content">
            <h1 class="h1">Le protocole est activé.</h1>
            <p class="text">Bonjour ${firstName},</p>
            <p class="text">Votre inscription au programme TitanFit est confirmée. Vous venez de faire le premier pas vers une transformation radicale.</p>
            <p class="text">Votre tableau de bord, propulsé par l'IA la plus avancée, est prêt :</p>
            <ul style="color: #57534e; margin-bottom: 24px;">
                <li>⚡ <strong>Programmes Adaptatifs</strong> : Générés en temps réel selon votre état.</li>
                <li>🍎 <strong>Chef IA Nutrition</strong> : Vos macros calculés au gramme près.</li>
                <li>📊 <strong>Analytics Élite</strong> : Suivez votre évolution comme un pro.</li>
            </ul>
            <p class="text">N'attendez pas demain. La discipline commence maintenant.</p>
            <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://titanfit.vercel.app'}/dashboard" class="btn">ACCÉDER AU DASHBOARD</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TitanFit Inc. Tous droits réservés.</p>
            <p>Paris • New York • Tokyo</p>
            <div class="social">
                 <a href="#" class="social-link">Instagram</a> • <a href="#" class="social-link">Twitter</a>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        const result = await sendEmail({
            to: email,
            subject,
            html,
        });

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
