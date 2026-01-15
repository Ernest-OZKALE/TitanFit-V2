import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/notifications - Get user's notifications
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const unreadOnly = searchParams.get('unread') === 'true';

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (unreadOnly) {
            query = query.eq('read', false);
        }

        const { data: notifications, error } = await query;

        if (error) throw error;

        // Get unread count
        const { count: unreadCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);

        return NextResponse.json({
            notifications,
            unread_count: unreadCount || 0
        });
    } catch (error: any) {
        console.error('Get Notifications Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/notifications - Create a notification (internal use)
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, message, type, link, icon } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        const { data: notification, error } = await supabase
            .from('notifications')
            .insert({
                user_id: user.id,
                title,
                message,
                type: type || 'info', // info, success, warning, achievement, social
                link,
                icon,
                read: false
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ notification }, { status: 201 });
    } catch (error: any) {
        console.error('Create Notification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, notification_id } = body;

        if (action === 'mark_read' && notification_id) {
            // Mark single notification as read
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notification_id)
                .eq('user_id', user.id);

            if (error) throw error;
            return NextResponse.json({ message: 'Marked as read' });
        }

        if (action === 'mark_all_read') {
            // Mark all as read
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            return NextResponse.json({ message: 'All notifications marked as read' });
        }

        if (action === 'clear_all') {
            // Delete all notifications
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;
            return NextResponse.json({ message: 'All notifications cleared' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Update Notifications Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
