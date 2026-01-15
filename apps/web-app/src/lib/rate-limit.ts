import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limiting Utility for TitanFit V2
 * Simple in-memory rate limiter for API routes
 */

// In-memory store for rate limiting (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Max requests per window
}

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean every minute

/**
 * Rate limit checker
 * @param identifier - Unique identifier (user ID or IP)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed and remaining requests
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetTime < now) {
        // New window
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
    }

    if (existing.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetTime: existing.resetTime };
    }

    existing.count++;
    rateLimitStore.set(key, existing);
    return { allowed: true, remaining: config.maxRequests - existing.count, resetTime: existing.resetTime };
}

/**
 * Rate limit response helper
 */
export function rateLimitExceeded(resetTime: number): NextResponse {
    return NextResponse.json(
        {
            error: 'Rate limit exceeded',
            message: 'Trop de requêtes. Réessayez plus tard.',
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        },
        {
            status: 429,
            headers: {
                'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
                'X-RateLimit-Limit': '60',
                'X-RateLimit-Remaining': '0',
            }
        }
    );
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

export const RATE_LIMITS = {
    // Standard API: 100 requests per minute
    STANDARD: { windowMs: 60 * 1000, maxRequests: 100 },

    // AI endpoints: 10 requests per minute (expensive)
    AI: { windowMs: 60 * 1000, maxRequests: 10 },

    // Auth endpoints: 5 attempts per 15 minutes (security)
    AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 },

    // Heavy operations: 20 per minute
    HEAVY: { windowMs: 60 * 1000, maxRequests: 20 },

    // Webhooks: 200 per minute (Stripe/etc)
    WEBHOOK: { windowMs: 60 * 1000, maxRequests: 200 },
};

// ============================================
// MIDDLEWARE HELPER
// ============================================

/**
 * Apply rate limiting to an API route
 * Usage in route handler:
 * 
 * const limit = await applyRateLimit(req, 'user-123', RATE_LIMITS.STANDARD);
 * if (limit.error) return limit.error;
 */
export async function applyRateLimit(
    req: NextRequest,
    identifier: string,
    config: RateLimitConfig
): Promise<{ error?: NextResponse }> {
    const result = checkRateLimit(identifier, config);

    if (!result.allowed) {
        return { error: rateLimitExceeded(result.resetTime) };
    }

    return {};
}

/**
 * Get client IP from request (for unauthenticated routes)
 */
export function getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip.trim();
}
