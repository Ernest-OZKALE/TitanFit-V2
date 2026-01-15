/**
 * Admin API - Upsells & Cross-sells
 * Manage product relationships for upselling
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

// GET: List all upsells or for specific product
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const productId = url.searchParams.get('product_id');

        let query = supabase
            .from('product_upsells')
            .select(`
                id,
                type,
                priority,
                is_active,
                parent:products!product_upsells_parent_product_id_fkey(id, name, price, images),
                upsell:products!product_upsells_upsell_product_id_fkey(id, name, price, images)
            `)
            .order('priority', { ascending: false });

        if (productId) {
            query = query.eq('parent_product_id', productId);
        }

        const { data: upsells, error } = await query;

        if (error) throw error;

        return NextResponse.json({ upsells: upsells || [] });

    } catch (error) {
        console.error('Upsells error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create upsell link
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { parent_product_id, upsell_product_id, type, priority, is_active } = body;

        if (!parent_product_id || !upsell_product_id) {
            return NextResponse.json({ error: 'Produits requis' }, { status: 400 });
        }

        const { data: upsell, error } = await supabase
            .from('product_upsells')
            .insert({
                parent_product_id,
                upsell_product_id,
                type: type || 'upsell',
                priority: priority || 0,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Ce lien existe déjà' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json({ upsell, message: 'Upsell créé' }, { status: 201 });

    } catch (error) {
        console.error('Create upsell error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove upsell link
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
            .from('product_upsells')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Upsell supprimé' });

    } catch (error) {
        console.error('Delete upsell error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
