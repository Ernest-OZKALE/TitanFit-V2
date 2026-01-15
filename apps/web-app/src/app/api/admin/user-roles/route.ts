/**
 * Admin API - User Roles Management
 * Grant/Revoke roles, manage VIP and special permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

// Get all roles and user assignments
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const isAdmin = await checkAdminPermission(supabase, user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const userId = url.searchParams.get('user_id');

        // Get all available roles
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .order('priority', { ascending: false });

        if (rolesError) {
            console.error('Error fetching roles:', rolesError);
            return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        }

        // If user_id provided, get that user's roles
        if (userId) {
            const { data: assignments } = await supabase
                .from('user_role_assignments')
                .select(`
                    id,
                    granted_at,
                    expires_at,
                    reason,
                    role:user_roles(*)
                `)
                .eq('user_id', userId);

            return NextResponse.json({
                roles,
                user_roles: assignments || [],
            });
        }

        // Get role stats
        const rolesWithStats = await Promise.all(
            (roles || []).map(async (role) => {
                const { count } = await supabase
                    .from('user_role_assignments')
                    .select('*', { count: 'exact', head: true })
                    .eq('role_id', role.id);

                return {
                    ...role,
                    user_count: count || 0,
                };
            })
        );

        return NextResponse.json({ roles: rolesWithStats });

    } catch (error) {
        console.error('Roles error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Grant role to user
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const isAdmin = await checkAdminPermission(supabase, user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { user_id, role_id, reason, expires_at } = body;

        if (!user_id || !role_id) {
            return NextResponse.json(
                { error: 'user_id et role_id requis' },
                { status: 400 }
            );
        }

        // Check if role exists
        const { data: role } = await supabase
            .from('user_roles')
            .select('name, display_name')
            .eq('id', role_id)
            .single();

        if (!role) {
            return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
        }

        // Grant role
        const { data: assignment, error } = await supabase
            .from('user_role_assignments')
            .upsert({
                user_id,
                role_id,
                granted_by: user.id,
                granted_at: new Date().toISOString(),
                expires_at,
                reason,
            }, {
                onConflict: 'user_id,role_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error granting role:', error);
            return NextResponse.json({ error: 'Erreur lors de l\'attribution' }, { status: 500 });
        }

        // Get user email for logging
        const { data: targetUser } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user_id)
            .single();

        await logAdminAction(supabase, user.id, 'grant_role', 'user', user_id, {
            role: role.name,
            role_display: role.display_name,
            user_email: targetUser?.email,
            reason,
            expires_at,
        }, targetUser?.email);

        return NextResponse.json({
            assignment,
            message: `Rôle ${role.display_name} attribué`,
        }, { status: 201 });

    } catch (error) {
        console.error('Grant role error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Revoke role from user
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const isAdmin = await checkAdminPermission(supabase, user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const userId = url.searchParams.get('user_id');
        const roleId = url.searchParams.get('role_id');

        if (!userId || !roleId) {
            return NextResponse.json(
                { error: 'user_id et role_id requis' },
                { status: 400 }
            );
        }

        // Get role info before deletion
        const { data: role } = await supabase
            .from('user_roles')
            .select('name, display_name')
            .eq('id', roleId)
            .single();

        const { error } = await supabase
            .from('user_role_assignments')
            .delete()
            .eq('user_id', userId)
            .eq('role_id', roleId);

        if (error) {
            console.error('Error revoking role:', error);
            return NextResponse.json({ error: 'Erreur lors de la révocation' }, { status: 500 });
        }

        await logAdminAction(supabase, user.id, 'revoke_role', 'user', userId, {
            role: role?.name,
            role_display: role?.display_name,
        });

        return NextResponse.json({
            message: `Rôle ${role?.display_name || 'inconnu'} révoqué`,
        });

    } catch (error) {
        console.error('Revoke role error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Helper functions
async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);

    if (!data) return false;
    return data.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name));
}

async function logAdminAction(
    supabase: any,
    adminId: string,
    actionType: string,
    targetType: string,
    targetId: string,
    details: object,
    targetEmail?: string
) {
    await supabase.from('admin_activity_logs').insert({
        admin_id: adminId,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        target_email: targetEmail,
        details,
    });
}
