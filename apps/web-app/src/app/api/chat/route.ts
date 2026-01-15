/**
 * LIVE CHAT API
 * Handle sessions and messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

// POST: Send a message (Start session if needed)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const guestId = request.headers.get('x-guest-id');

        const body = await request.json();
        const { content, session_id, sender_type } = body; // sender_type: 'user' | 'agent'

        if (!content) return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });

        let sessionId = session_id;

        // If no session ID, create one (User starting chat)
        if (!sessionId) {
            if (sender_type === 'agent') {
                return NextResponse.json({ error: 'Agent cannot start session without context' }, { status: 400 });
            }

            const { data: session, error: sessionError } = await supabase
                .from('chat_sessions')
                .insert({
                    user_id: user?.id || null,
                    guest_id: !user ? guestId : null,
                    status: 'active',
                    last_message_at: new Date().toISOString()
                })
                .select()
                .single();

            if (sessionError) throw sessionError;
            sessionId = session.id;
        }

        // Insert message
        const { data: message, error: messageError } = await supabase
            .from('chat_messages')
            .insert({
                session_id: sessionId,
                sender_type: sender_type || (user ? 'user' : 'user'), // Default to user if not specified
                sender_id: user?.id || null,
                content,
                is_read: false
            })
            .select()
            .single();

        if (messageError) throw messageError;

        // Update session last_message_at
        await supabase
            .from('chat_sessions')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', sessionId);

        return NextResponse.json({ message, session_id: sessionId });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// GET: Get messages for a session
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('session_id');

        if (!sessionId) return NextResponse.json({ error: 'Session ID requis' }, { status: 400 });

        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ messages: messages || [] });

    } catch (error) {
        console.error('Chat GET Error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
