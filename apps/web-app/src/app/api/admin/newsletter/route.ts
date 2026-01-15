/**
 * Admin API - Newsletter Campaigns
 * Full campaign management with drag-and-drop builder support
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);
    return data?.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name)) || false;
}

// GET: List campaigns or get single campaign
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        const status = url.searchParams.get('status');

        if (id) {
            const { data: campaign, error } = await supabase
                .from('newsletter_campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return NextResponse.json({ campaign });
        }

        let query = supabase
            .from('newsletter_campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);

        const { data: campaigns, error } = await query;
        if (error) throw error;

        // Get subscriber count
        const { count: subscriberCount } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Get stats
        const stats = {
            total: campaigns?.length || 0,
            draft: campaigns?.filter((c: any) => c.status === 'draft').length || 0,
            scheduled: campaigns?.filter((c: any) => c.status === 'scheduled').length || 0,
            sent: campaigns?.filter((c: any) => c.status === 'sent').length || 0,
            active_subscribers: subscriberCount || 0,
        };

        return NextResponse.json({ campaigns: campaigns || [], stats });

    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create campaign
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { name, subject, preview_text, content_html, content_json, target_segments, scheduled_at } = body;

        if (!name || !subject || !content_html) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
        }

        // Calculate recipient count
        let recipientCount = 0;
        if (target_segments && target_segments.length > 0) {
            const { count } = await supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            // In production: filter by segments
            recipientCount = count || 0;
        } else {
            const { count } = await supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            recipientCount = count || 0;
        }

        const { data: campaign, error } = await supabase
            .from('newsletter_campaigns')
            .insert({
                name,
                subject,
                preview_text,
                content_html,
                content_json,
                target_segments,
                scheduled_at,
                status: scheduled_at ? 'scheduled' : 'draft',
                total_recipients: recipientCount,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ campaign, message: 'Campagne créée' }, { status: 201 });

    } catch (error) {
        console.error('Create newsletter error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update campaign
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { id, action, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Handle special actions
        if (action === 'send_now') {
            // Mark as sending (in production: queue for sending)
            const { data: campaign, error } = await supabase
                .from('newsletter_campaigns')
                .update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // In production: trigger actual email sending job
            return NextResponse.json({ campaign, message: 'Campagne envoyée !' });
        }

        if (action === 'duplicate') {
            const { data: original } = await supabase
                .from('newsletter_campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (!original) {
                return NextResponse.json({ error: 'Campagne non trouvée' }, { status: 404 });
            }

            const { data: copy, error } = await supabase
                .from('newsletter_campaigns')
                .insert({
                    name: `${original.name} (copie)`,
                    subject: original.subject,
                    preview_text: original.preview_text,
                    content_html: original.content_html,
                    content_json: original.content_json,
                    target_segments: original.target_segments,
                    status: 'draft',
                    created_by: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ campaign: copy, message: 'Campagne dupliquée' });
        }

        // Regular update
        const { data: campaign, error } = await supabase
            .from('newsletter_campaigns')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ campaign, message: 'Campagne mise à jour' });

    } catch (error) {
        console.error('Update newsletter error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove campaign
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const { error } = await supabase
            .from('newsletter_campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Campagne supprimée' });

    } catch (error) {
        console.error('Delete newsletter error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
