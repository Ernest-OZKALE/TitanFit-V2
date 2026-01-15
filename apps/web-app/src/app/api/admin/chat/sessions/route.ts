/**
 * ADMIN CHAT API
 * List active sessions for agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin', 'support'].includes(a.role?.name)) || false;
}

// GET: List all sessions
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const status = url.searchParams.get('status') || 'active';

        const { data: sessions, error } = await supabase
            .from('chat_sessions')
            .select(`
                *,
                user:users(email),
                last_message:chat_messages(content, created_at)
            `)
            .eq('status', status)
            .order('last_message_at', { ascending: false });

        if (error) throw error;

        // Process to get just the last message info efficiently for list view
        // (Supabase subquery limit 1 logic usually done slightly differently but this is decent for MVP)

        return NextResponse.json({ sessions: sessions || [] });

    } catch (error) {
        console.error('Admin Chat GET Error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
