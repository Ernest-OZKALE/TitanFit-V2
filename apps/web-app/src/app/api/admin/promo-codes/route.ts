/**
 * Admin API - Promo Codes Management
 * Full CRUD + Stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';

interface PromoCode {
    id?: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed' | 'free_trial';
    discount_value: number;
    max_uses?: number;
    valid_from?: string;
    valid_until?: string;
    minimum_purchase?: number;
    applicable_plans?: string[];
    is_active?: boolean;
}

// Get all promo codes
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Check admin permission
        const isAdmin = await checkAdminPermission(supabase, user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const includeStats = url.searchParams.get('stats') === 'true';

        let query = supabase
            .from('promo_codes')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: codes, error } = await query;

        if (error) {
            console.error('Error fetching promo codes:', error);
            return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        }

        // Get usage stats if requested
        if (includeStats && codes) {
            const codesWithStats = await Promise.all(
                codes.map(async (code) => {
                    const { count } = await supabase
                        .from('promo_code_usage')
                        .select('*', { count: 'exact', head: true })
                        .eq('promo_code_id', code.id);

                    return {
                        ...code,
                        usage_count: count || 0,
                    };
                })
            );
            return NextResponse.json({ codes: codesWithStats });
        }

        return NextResponse.json({ codes: codes || [] });

    } catch (error) {
        console.error('Promo codes error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Create new promo code
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

        const body: PromoCode = await request.json();

        // Validate required fields
        if (!body.code || !body.discount_type || body.discount_value === undefined) {
            return NextResponse.json(
                { error: 'Code, type de réduction et valeur requis' },
                { status: 400 }
            );
        }

        // Normalize code to uppercase
        const code = body.code.toUpperCase().trim();

        // Check if code already exists
        const { data: existing } = await supabase
            .from('promo_codes')
            .select('id')
            .eq('code', code)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Ce code existe déjà' },
                { status: 409 }
            );
        }

        const { data: newCode, error } = await supabase
            .from('promo_codes')
            .insert({
                code,
                description: body.description,
                discount_type: body.discount_type,
                discount_value: body.discount_value,
                max_uses: body.max_uses,
                valid_from: body.valid_from,
                valid_until: body.valid_until,
                minimum_purchase: body.minimum_purchase || 0,
                applicable_plans: body.applicable_plans,
                is_active: body.is_active !== false,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating promo code:', error);
            return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
        }

        // Log admin action
        await logAdminAction(supabase, user.id, 'create', 'promo_code', newCode.id, {
            code: newCode.code,
            discount_type: newCode.discount_type,
            discount_value: newCode.discount_value,
        });

        return NextResponse.json({ code: newCode, message: 'Code promo créé' }, { status: 201 });

    } catch (error) {
        console.error('Create promo code error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Update promo code
export async function PUT(request: NextRequest) {
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
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Normalize code if provided
        if (updates.code) {
            updates.code = updates.code.toUpperCase().trim();
        }

        const { data: updated, error } = await supabase
            .from('promo_codes')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating promo code:', error);
            return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
        }

        await logAdminAction(supabase, user.id, 'update', 'promo_code', id, updates);

        return NextResponse.json({ code: updated, message: 'Code promo mis à jour' });

    } catch (error) {
        console.error('Update promo code error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Delete promo code
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
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Get code before deletion for logging
        const { data: codeToDelete } = await supabase
            .from('promo_codes')
            .select('code')
            .eq('id', id)
            .single();

        const { error } = await supabase
            .from('promo_codes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting promo code:', error);
            return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
        }

        await logAdminAction(supabase, user.id, 'delete', 'promo_code', id, {
            code: codeToDelete?.code,
        });

        return NextResponse.json({ message: 'Code promo supprimé' });

    } catch (error) {
        console.error('Delete promo code error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Helper: Check if user has admin permission
async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`
            role:user_roles(name)
        `)
        .eq('user_id', userId);

    if (!data) return false;

    const adminRoles = ['admin', 'super_admin'];
    return data.some((assignment: any) =>
        adminRoles.includes(assignment.role?.name)
    );
}

// Helper: Log admin action
async function logAdminAction(
    supabase: any,
    adminId: string,
    actionType: string,
    targetType: string,
    targetId: string,
    details: object
) {
    await supabase.from('admin_activity_logs').insert({
        admin_id: adminId,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details,
    });
}
