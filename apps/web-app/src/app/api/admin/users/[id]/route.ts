
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// DELETE: Delete a user (Auth + Profile)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Check if requester is Admin
        const supabase = await createSupabaseServerClient();
        const { data: { user: requester } } = await supabase.auth.getUser();

        if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', requester.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
        }

        const { id: targetUserId } = await params;

        // 2. Manual Cascade: Delete Profile first (triggers cascade to metrics, logs, etc.)
        // This is necessary because 'profiles' FK to 'auth.users' might not have ON DELETE CASCADE configured in DB.
        const { error: profileDeleteError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', targetUserId);

        if (profileDeleteError) {
            console.error('Profile delete error:', profileDeleteError);
            // We continue even if error, possibly it doesn't exist, but good to log.
        }

        // 3. Delete from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

        if (authError) {
            console.error('Auth delete error:', authError);
            return NextResponse.json({ error: authError.message || "Database error deleting user" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update user details (Role, Ban, Metadata)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Check Admin
        const supabase = await createSupabaseServerClient();
        const { data: { user: requester } } = await supabase.auth.getUser();

        if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', requester.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id: targetUserId } = await params;
        const body = await req.json();

        // 2. Handle Updates
        // Update Profile Table
        const updates: any = {};
        if (body.username) updates.username = body.username;
        if (body.role) updates.role = body.role;

        if (Object.keys(updates).length > 0) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update(updates)
                .eq('id', targetUserId);

            if (profileError) throw profileError;
        }

        // Handle Password Update (if provided)
        if (body.password) {
            const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                password: body.password
            });
            if (pwdError) throw pwdError;
        }

        // Handle Ban / Ban Duration (using auth.users banned_until)
        if (body.ban_duration) {
            const banUntil = body.ban_duration === 'forever'
                ? '9999-12-31T23:59:59Z'
                : body.ban_duration === 'none'
                    ? null
                    : new Date(Date.now() + body.ban_duration * 1000).toISOString(); // duration in seconds

            const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                ban_duration: banUntil as any
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
