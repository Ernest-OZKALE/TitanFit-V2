/**
 * Admin API - Two-Factor Authentication (2FA)
 * TOTP-based 2FA for admin accounts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase-server';
import * as crypto from 'crypto';

const TOTP_PERIOD = 30; // seconds
const TOTP_DIGITS = 6;

// Helper to generate random base32 secret
function generateSecret(): string {
    const bytes = crypto.randomBytes(20);
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < bytes.length; i++) {
        secret += base32Chars[bytes[i] % 32];
    }
    return secret;
}

// Helper to decode base32
function base32Decode(encoded: string): Buffer {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const char of encoded.toUpperCase()) {
        const val = base32Chars.indexOf(char);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return Buffer.from(bytes);
}

// Generate TOTP code
function generateTOTP(secret: string, counter: number): string {
    const secretBuffer = base32Decode(secret);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', secretBuffer);
    hmac.update(counterBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, TOTP_DIGITS);
    return otp.toString().padStart(TOTP_DIGITS, '0');
}

// Verify TOTP code (with 1 period tolerance)
function verifyTOTP(secret: string, code: string): boolean {
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / TOTP_PERIOD);

    for (let i = -1; i <= 1; i++) {
        if (generateTOTP(secret, counter + i) === code) {
            return true;
        }
    }
    return false;
}

// Generate QR code URL for authenticator apps
function generateQRCodeURL(secret: string, email: string, issuer: string = 'TitanFit'): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedEmail = encodeURIComponent(email);
    const otpauth = `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
    // Use Google Charts API to generate QR (or use a library in production)
    return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauth)}`;
}

// Check admin permission
async function checkAdminPermission(supabase: any, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_role_assignments')
        .select(`role:user_roles(name)`)
        .eq('user_id', userId);

    if (!data) return false;
    return data.some((a: any) => ['admin', 'super_admin'].includes(a.role?.name));
}

// GET: Get 2FA status for current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Get user's 2FA status from user_metadata or a separate table
        const twoFAEnabled = user.user_metadata?.two_factor_enabled || false;

        return NextResponse.json({
            enabled: twoFAEnabled,
            can_setup: true,
        });

    } catch (error) {
        console.error('2FA status error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

// POST: Setup or verify 2FA
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { action, code } = body as { action: 'setup' | 'verify' | 'enable' | 'disable'; code?: string };

        switch (action) {
            case 'setup': {
                // Generate new secret
                const secret = generateSecret();
                const qrCodeURL = generateQRCodeURL(secret, user.email || 'user@titanfit.app');

                // Store secret temporarily (in production, encrypt and store securely)
                await supabase.auth.updateUser({
                    data: {
                        two_factor_secret_temp: secret,
                        two_factor_setup_at: new Date().toISOString(),
                    }
                });

                return NextResponse.json({
                    secret,
                    qr_code_url: qrCodeURL,
                    manual_entry: secret,
                    message: 'Scannez le QR code avec votre app authenticator',
                });
            }

            case 'verify':
            case 'enable': {
                if (!code) {
                    return NextResponse.json({ error: 'Code requis' }, { status: 400 });
                }

                const tempSecret = user.user_metadata?.two_factor_secret_temp;
                if (!tempSecret) {
                    return NextResponse.json({ error: 'Lancez d\'abord la configuration' }, { status: 400 });
                }

                if (!verifyTOTP(tempSecret, code)) {
                    return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
                }

                // Enable 2FA
                await supabase.auth.updateUser({
                    data: {
                        two_factor_enabled: true,
                        two_factor_secret: tempSecret,
                        two_factor_secret_temp: null,
                        two_factor_enabled_at: new Date().toISOString(),
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: 'Double authentification activée',
                });
            }

            case 'disable': {
                if (!code) {
                    return NextResponse.json({ error: 'Code requis pour désactiver' }, { status: 400 });
                }

                const secret = user.user_metadata?.two_factor_secret;
                if (!secret || !verifyTOTP(secret, code)) {
                    return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
                }

                await supabase.auth.updateUser({
                    data: {
                        two_factor_enabled: false,
                        two_factor_secret: null,
                        two_factor_disabled_at: new Date().toISOString(),
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: 'Double authentification désactivée',
                });
            }

            default:
                return NextResponse.json(
                    { error: 'Action invalide', valid_actions: ['setup', 'verify', 'enable', 'disable'] },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('2FA error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// PUT: Verify 2FA code during login
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body as { code: string };

        if (!code) {
            return NextResponse.json({ error: 'Code requis' }, { status: 400 });
        }

        const secret = user.user_metadata?.two_factor_secret;
        const isEnabled = user.user_metadata?.two_factor_enabled;

        if (!isEnabled || !secret) {
            return NextResponse.json({
                success: true,
                message: '2FA non activé',
                requires_2fa: false,
            });
        }

        if (!verifyTOTP(secret, code)) {
            return NextResponse.json({
                success: false,
                error: 'Code invalide'
            }, { status: 400 });
        }

        // Mark session as 2FA verified
        await supabase.auth.updateUser({
            data: {
                two_factor_verified_at: new Date().toISOString(),
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Authentification réussie',
            verified: true,
        });

    } catch (error) {
        console.error('2FA verify error:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
