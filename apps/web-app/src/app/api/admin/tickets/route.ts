/**
 * Admin API - Support Tickets
 * Customer support ticket system
 * Updated: 2026-01-21
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

function generateTicketNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TF${year}${month}-${random}`;
}

async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin', 'moderator'].includes(a.role?.name)) || false;
}

// GET: List tickets
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const isAdmin = await checkAdminPermission(supabase, user.id);
        const url = new URL(request.url);
        const ticketId = url.searchParams.get('id');
        const status = url.searchParams.get('status');

        // If specific ticket requested
        if (ticketId) {
            const { data: ticket, error } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('id', ticketId)
                .single();

            if (error) throw error;

            // Check access
            if (!isAdmin && ticket.user_id !== user.id) {
                return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
            }

            // Get messages
            let messagesQuery = supabase
                .from('ticket_messages')
                .select('*')
                .eq('ticket_id', ticketId)
                .order('created_at');

            // Hide internal notes for non-admins
            if (!isAdmin) {
                messagesQuery = messagesQuery.eq('is_internal', false);
            }

            const { data: messages } = await messagesQuery;

            return NextResponse.json({ ticket, messages: messages || [] });
        }

        // List tickets
        let query = supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        // Non-admins can only see their own tickets
        if (!isAdmin) {
            query = query.eq('user_id', user.id);
        }

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: tickets, error } = await query.limit(100);

        if (error) throw error;

        // Get stats for admin
        let stats: Record<string, number> | null = null;
        if (isAdmin) {
            const statuses = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];
            stats = {};
            for (const s of statuses) {
                const { count } = await supabase
                    .from('support_tickets')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', s);
                stats[s] = count || 0;
            }
        }

        return NextResponse.json({ tickets: tickets || [], stats, is_admin: isAdmin });

    } catch (error) {
        console.error('Tickets error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create ticket or add message
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body;

        if (action === 'create_ticket') {
            const { subject, message, category, priority } = body;

            if (!subject || !message) {
                return NextResponse.json({ error: 'Sujet et message requis' }, { status: 400 });
            }

            // Get user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('email, display_name')
                .eq('id', user.id)
                .single();

            // Create ticket
            const { data: ticket, error } = await supabase
                .from('support_tickets')
                .insert({
                    ticket_number: generateTicketNumber(),
                    user_id: user.id,
                    user_email: profile?.email || user.email,
                    user_name: profile?.display_name,
                    subject,
                    category: category || 'general',
                    priority: priority || 'medium',
                })
                .select()
                .single();

            if (error) throw error;

            // Add initial message
            await supabase.from('ticket_messages').insert({
                ticket_id: ticket.id,
                sender_id: user.id,
                sender_type: 'customer',
                message,
            });

            return NextResponse.json({
                ticket,
                message: `Ticket ${ticket.ticket_number} créé`
            }, { status: 201 });

        } else if (action === 'add_message') {
            const { ticket_id, message, is_internal } = body;

            if (!ticket_id || !message) {
                return NextResponse.json({ error: 'ticket_id et message requis' }, { status: 400 });
            }

            // Check access
            const { data: ticket } = await supabase
                .from('support_tickets')
                .select('user_id')
                .eq('id', ticket_id)
                .single();

            if (!ticket) {
                return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
            }

            const isAdmin = await checkAdminPermission(supabase, user.id);
            if (!isAdmin && ticket.user_id !== user.id) {
                return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
            }

            // Add message
            const { data: msg, error } = await supabase
                .from('ticket_messages')
                .insert({
                    ticket_id,
                    sender_id: user.id,
                    sender_type: isAdmin ? 'agent' : 'customer',
                    message,
                    is_internal: isAdmin ? (is_internal || false) : false,
                })
                .select()
                .single();

            if (error) throw error;

            // Update ticket status and first response time
            const updates: any = { updated_at: new Date().toISOString() };
            if (isAdmin && !(ticket as any).first_response_at) {
                updates.first_response_at = new Date().toISOString();
                updates.status = 'in_progress';
            }
            if (!isAdmin) {
                updates.status = 'open';
            }

            await supabase
                .from('support_tickets')
                .update(updates)
                .eq('id', ticket_id);

            return NextResponse.json({ message: msg });

        } else {
            return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
        }

    } catch (error) {
        console.error('Create ticket/message error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update ticket status
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { id, status, priority, assigned_to } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const updates: any = { updated_at: new Date().toISOString() };
        if (status) {
            updates.status = status;
            if (status === 'resolved') updates.resolved_at = new Date().toISOString();
            if (status === 'closed') updates.closed_at = new Date().toISOString();
        }
        if (priority) updates.priority = priority;
        if (assigned_to) updates.assigned_to = assigned_to;

        const { data: ticket, error } = await supabase
            .from('support_tickets')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ ticket, message: 'Ticket mis à jour' });

    } catch (error) {
        console.error('Update ticket error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
