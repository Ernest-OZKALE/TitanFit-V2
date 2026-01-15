/**
 * Admin API - Product Bundles
 * Manage bundles and packs
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

// GET: List bundles
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { data: bundles, error } = await supabase
            .from('product_bundles')
            .select(`
                *,
                items:bundle_items(
                    quantity,
                    product:products(id, name, price, images)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ bundles: bundles || [] });

    } catch (error) {
        console.error('Bundles error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create bundle
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { name, slug, description, discount_type, discount_value, price, items, is_active } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Nom et slug requis' }, { status: 400 });
        }

        // Create bundle
        const { data: bundle, error: bundleError } = await supabase
            .from('product_bundles')
            .insert({
                name,
                slug,
                description,
                discount_type: discount_type || 'percentage',
                discount_value: discount_value || 0,
                price,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (bundleError) throw bundleError;

        // Add items
        if (items && items.length > 0) {
            const bundleItems = items.map((item: any) => ({
                bundle_id: bundle.id,
                product_id: item.product_id,
                quantity: item.quantity || 1,
            }));

            const { error: itemsError } = await supabase
                .from('bundle_items')
                .insert(bundleItems);

            if (itemsError) throw itemsError;
        }

        return NextResponse.json({ bundle, message: 'Bundle créé' }, { status: 201 });

    } catch (error) {
        console.error('Create bundle error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove bundle
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
            .from('product_bundles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Bundle supprimé' });

    } catch (error) {
        console.error('Delete bundle error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
