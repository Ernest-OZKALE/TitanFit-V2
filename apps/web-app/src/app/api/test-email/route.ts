import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) { // Only logged-in users can test simple emails for now, or restrict to Admin
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { to } = await req.json();

        // Default to sending to the current user if no 'to' address provided
        const recipient = to || user.email;

        const result = await sendEmail({
            to: recipient,
            subject: 'Test Email from TitanFit',
            html: `
                <h1>TitanFit Email Configuration</h1>
                <p>Hello, this is a test email to verify that your Resend integration is working correctly.</p>
                <p><strong>Status:</strong> Operational 🚀</p>
                <p>Sent to: ${recipient}</p>
            `
        });

        if (result.success) {
            return NextResponse.json({ message: 'Email sent successfully', data: result });
        } else {
            return NextResponse.json({ message: 'Failed to send email', error: result.error }, { status: 500 });
        }

    } catch (error: any) {
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
