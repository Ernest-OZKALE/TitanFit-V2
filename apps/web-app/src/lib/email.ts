import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Email simulation:', { to, subject });
        return { success: true, simulated: true };
    }

    try {
        const data = await resend.emails.send({
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || 'TitanFit <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
};
