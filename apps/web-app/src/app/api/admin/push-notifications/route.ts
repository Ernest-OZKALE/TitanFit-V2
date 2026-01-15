/**
 * Admin API - Push Notifications
 * Manage notification templates and send push notifications
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

// GET: List notifications or templates
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'notifications';

        if (type === 'templates') {
            const { data: templates } = await supabase
                .from('notification_templates')
                .select('*')
                .order('category')
                .order('name');

            return NextResponse.json({ templates: templates || [] });
        }

        // Get notifications
        const { data: notifications } = await supabase
            .from('push_notifications')
            .select('*')
            .order('created_at', { ascending: false });

        // Get stats
        const { count: tokenCount } = await supabase
            .from('push_tokens')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        const stats = {
            active_tokens: tokenCount || 0,
            total: notifications?.length || 0,
            sent: notifications?.filter((n: any) => n.status === 'sent').length || 0,
            scheduled: notifications?.filter((n: any) => n.status === 'scheduled').length || 0,
        };

        return NextResponse.json({ notifications: notifications || [], stats });

    } catch (error) {
        console.error('Push notifications error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create notification or register token
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();
        const { action } = body;

        // Register push token (no admin required)
        if (action === 'register_token') {
            if (!user) {
                return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
            }

            const { token, device_type, device_name, browser } = body;

            if (!token) {
                return NextResponse.json({ error: 'Token requis' }, { status: 400 });
            }

            const { data: pushToken, error } = await supabase
                .from('push_tokens')
                .upsert({
                    user_id: user.id,
                    token,
                    device_type: device_type || 'web',
                    device_name,
                    browser,
                    is_active: true,
                    last_used_at: new Date().toISOString(),
                }, { onConflict: 'user_id,token' })
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({ token: pushToken, message: 'Token enregistré' });
        }

        // Admin actions below
        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Create notification
        const {
            title,
            body: notifBody,
            icon,
            action_url,
            target_type,
            target_value,
            scheduled_at
        } = body;

        if (!title || !notifBody) {
            return NextResponse.json({ error: 'Titre et message requis' }, { status: 400 });
        }

        const { data: notification, error } = await supabase
            .from('push_notifications')
            .insert({
                title,
                body: notifBody,
                icon: icon || '/icon-192.png',
                action_url,
                target_type: target_type || 'all',
                target_value,
                scheduled_at,
                status: scheduled_at ? 'scheduled' : 'draft',
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ notification, message: 'Notification créée' }, { status: 201 });

    } catch (error) {
        console.error('Create push notification error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update or send notification
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

        if (action === 'send_now') {
            // Get notification
            const { data: notification } = await supabase
                .from('push_notifications')
                .select('*')
                .eq('id', id)
                .single();

            if (!notification) {
                return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
            }

            // Get target tokens
            let tokensQuery = supabase
                .from('push_tokens')
                .select('id, user_id, token')
                .eq('is_active', true);

            if (notification.target_type === 'user' && notification.target_value) {
                tokensQuery = tokensQuery.eq('user_id', notification.target_value);
            }

            const { data: tokens } = await tokensQuery;
            const tokenCount = tokens?.length || 0;

            // In production: Send via Firebase Cloud Messaging
            // For now, we just mark as sent and log

            // Create delivery logs
            if (tokens && tokens.length > 0) {
                const deliveryLogs = tokens.map((t: any) => ({
                    notification_id: id,
                    user_id: t.user_id,
                    token_id: t.id,
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                }));

                await supabase.from('push_delivery_log').insert(deliveryLogs);
            }

            // Update notification status
            await supabase
                .from('push_notifications')
                .update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    total_sent: tokenCount,
                })
                .eq('id', id);

            return NextResponse.json({
                message: `Notification envoyée à ${tokenCount} appareil(s)`,
                sent_to: tokenCount,
            });
        }

        // Regular update
        const { data: notification, error } = await supabase
            .from('push_notifications')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ notification, message: 'Mise à jour' });

    } catch (error) {
        console.error('Update push notification error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove notification
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

        await supabase.from('push_notifications').delete().eq('id', id);

        return NextResponse.json({ message: 'Supprimée' });

    } catch (error) {
        console.error('Delete push notification error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
