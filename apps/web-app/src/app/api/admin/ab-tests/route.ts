/**
 * Admin API - A/B Testing
 * Create and manage A/B test experiments
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

// Calculate statistical significance
function calculateSignificance(
    controlConversions: number,
    controlImpressions: number,
    variantConversions: number,
    variantImpressions: number
): { significant: boolean; confidenceLevel: number; winner: string | null; lift: number } {
    if (controlImpressions < 30 || variantImpressions < 30) {
        return { significant: false, confidenceLevel: 0, winner: null, lift: 0 };
    }

    const controlRate = controlConversions / controlImpressions;
    const variantRate = variantConversions / variantImpressions;

    const pooledRate = (controlConversions + variantConversions) / (controlImpressions + variantImpressions);
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / controlImpressions + 1 / variantImpressions));

    if (se === 0) return { significant: false, confidenceLevel: 0, winner: null, lift: 0 };

    const zScore = Math.abs(variantRate - controlRate) / se;

    // Z-score to confidence level
    let confidenceLevel = 0;
    if (zScore >= 2.576) confidenceLevel = 99;
    else if (zScore >= 1.96) confidenceLevel = 95;
    else if (zScore >= 1.645) confidenceLevel = 90;
    else if (zScore >= 1.28) confidenceLevel = 80;
    else confidenceLevel = Math.round(zScore * 40);

    const lift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;
    const significant = confidenceLevel >= 95;
    const winner = significant ? (variantRate > controlRate ? 'variant' : 'control') : null;

    return { significant, confidenceLevel, winner, lift: Math.round(lift * 10) / 10 };
}

// GET: List tests or get single test
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (id) {
            // Get single test with variants
            const { data: test, error } = await supabase
                .from('ab_tests')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const { data: variants } = await supabase
                .from('ab_test_variants')
                .select('*')
                .eq('test_id', id)
                .order('is_control', { ascending: false });

            // Calculate stats
            const control = variants?.find((v: any) => v.is_control);
            const variant = variants?.find((v: any) => !v.is_control);

            let analysis = null;
            if (control && variant) {
                analysis = calculateSignificance(
                    control.conversions,
                    control.impressions,
                    variant.conversions,
                    variant.impressions
                );
            }

            return NextResponse.json({ test, variants: variants || [], analysis });
        }

        // List all tests
        const { data: tests, error } = await supabase
            .from('ab_tests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Get stats
        const stats = {
            total: tests?.length || 0,
            running: tests?.filter((t: any) => t.status === 'running').length || 0,
            completed: tests?.filter((t: any) => t.status === 'completed').length || 0,
        };

        return NextResponse.json({ tests: tests || [], stats });

    } catch (error) {
        console.error('A/B test error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Create test
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name,
            description,
            test_type,
            traffic_split,
            target_metric,
            min_sample_size,
            control_content,
            variant_content
        } = body;

        if (!name || !test_type || !control_content || !variant_content) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
        }

        // Create test
        const { data: test, error: testError } = await supabase
            .from('ab_tests')
            .insert({
                name,
                description,
                test_type,
                traffic_split: traffic_split || 50,
                target_metric: target_metric || 'conversion',
                min_sample_size: min_sample_size || 100,
                created_by: user.id,
            })
            .select()
            .single();

        if (testError) throw testError;

        // Create variants
        const { error: variantsError } = await supabase
            .from('ab_test_variants')
            .insert([
                {
                    test_id: test.id,
                    name: 'Control',
                    is_control: true,
                    content: control_content,
                    traffic_weight: traffic_split || 50,
                },
                {
                    test_id: test.id,
                    name: 'Variant A',
                    is_control: false,
                    content: variant_content,
                    traffic_weight: 100 - (traffic_split || 50),
                },
            ]);

        if (variantsError) throw variantsError;

        return NextResponse.json({ test, message: 'Test A/B créé' }, { status: 201 });

    } catch (error) {
        console.error('Create A/B test error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// PUT: Update test or record event
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();
        const { id, action, ...updates } = body;

        // Record events (no auth required for tracking)
        if (action === 'record_impression' || action === 'record_conversion') {
            const { variant_id, session_id, conversion_value } = updates;

            if (!variant_id) {
                return NextResponse.json({ error: 'variant_id requis' }, { status: 400 });
            }

            // Get variant info
            const { data: variant } = await supabase
                .from('ab_test_variants')
                .select('id, test_id, impressions, conversions, revenue')
                .eq('id', variant_id)
                .single();

            if (!variant) {
                return NextResponse.json({ error: 'Variant non trouvé' }, { status: 404 });
            }

            if (action === 'record_impression') {
                // Increment impressions
                await supabase
                    .from('ab_test_variants')
                    .update({ impressions: (variant.impressions || 0) + 1 })
                    .eq('id', variant_id);

                // Record participant
                await supabase
                    .from('ab_test_participants')
                    .upsert({
                        test_id: variant.test_id,
                        variant_id,
                        user_id: user?.id || null,
                        session_id,
                    }, { onConflict: user?.id ? 'test_id,user_id' : 'test_id,session_id' });

                return NextResponse.json({ recorded: 'impression' });
            }

            if (action === 'record_conversion') {
                // Increment conversions
                await supabase
                    .from('ab_test_variants')
                    .update({
                        conversions: (variant.conversions || 0) + 1,
                        revenue: conversion_value ? variant.revenue + conversion_value : variant.revenue,
                    })
                    .eq('id', variant_id);

                // Update participant
                await supabase
                    .from('ab_test_participants')
                    .update({
                        converted: true,
                        conversion_value,
                        converted_at: new Date().toISOString(),
                    })
                    .eq('variant_id', variant_id)
                    .eq(user?.id ? 'user_id' : 'session_id', user?.id || session_id);

                return NextResponse.json({ recorded: 'conversion' });
            }
        }

        // Admin actions
        if (!user || !(await checkAdminPermission(supabase, user.id))) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        if (action === 'start') {
            const { data: test } = await supabase
                .from('ab_tests')
                .update({ status: 'running', started_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            return NextResponse.json({ test, message: 'Test démarré' });
        }

        if (action === 'pause') {
            const { data: test } = await supabase
                .from('ab_tests')
                .update({ status: 'paused' })
                .eq('id', id)
                .select()
                .single();
            return NextResponse.json({ test, message: 'Test en pause' });
        }

        if (action === 'complete') {
            const { winner_variant_id } = updates;
            const { data: test } = await supabase
                .from('ab_tests')
                .update({
                    status: 'completed',
                    ended_at: new Date().toISOString(),
                    winner_variant_id,
                })
                .eq('id', id)
                .select()
                .single();
            return NextResponse.json({ test, message: 'Test terminé' });
        }

        // Regular update
        const { data: test, error } = await supabase
            .from('ab_tests')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ test, message: 'Test mis à jour' });

    } catch (error) {
        console.error('Update A/B test error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// DELETE: Remove test
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
            .from('ab_tests')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Test supprimé' });

    } catch (error) {
        console.error('Delete A/B test error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
