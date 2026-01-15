import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// --- SENTINEL DEFENSE SYSTEM ---

// 1. Rate Limiting (In-Memory)
// Note: In a real cluster environment, use Redis (Upstash).
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const BLOCK_LIST = new Set<string>(); // Temporal IP blocks

const CONFIG = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: {
        default: 60,
        ai: 10,
        auth: 5, // Strict on login/signup
    },
    badBots: [
        'curl', 'python', 'wget', 'scrapy', 'go-http-client', 'libwww-perl',
        'axios', 'postman', 'insomnia', 'node-fetch' // Block dev tools in prod
    ]
};

function getIP(req: NextRequest): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function checkSentinel(req: NextRequest) {
    const ip = getIP(req);
    const ua = req.headers.get('user-agent')?.toLowerCase() || '';

    // A. Bot Blocking
    if (CONFIG.badBots.some(bot => ua.includes(bot))) {
        // Allow if API Key (e.g. valid machine-to-machine) is present? 
        // For now, strict block unless special header
        if (!req.headers.get('x-admin-bypass')) {
            return { blocked: true, reason: 'Bot detected' };
        }
    }

    // B. IP Blocking
    if (BLOCK_LIST.has(ip)) {
        return { blocked: true, reason: 'IP banned temporarily' };
    }

    // C. Rate Limiting
    const path = req.nextUrl.pathname;
    let limit = CONFIG.maxRequests.default;
    if (path.startsWith('/api/ai')) limit = CONFIG.maxRequests.ai;
    if (path.startsWith('/auth') || path.startsWith('/api/auth')) limit = CONFIG.maxRequests.auth;

    const key = `${ip}:${path}`; // Granular limit per path for auth
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || (now - record.timestamp) > CONFIG.windowMs) {
        rateLimitMap.set(key, { count: 1, timestamp: now });
        return { blocked: false };
    }

    if (record.count >= limit) {
        // Auto-ban IP for 10 mins if they exceed Auth limit by 3x
        if (limit === CONFIG.maxRequests.auth && record.count > limit * 3) {
            BLOCK_LIST.add(ip);
            setTimeout(() => BLOCK_LIST.delete(ip), 600 * 1000);
        }
        return { blocked: true, reason: 'Rate limit exceeded' };
    }

    record.count++;
    return { blocked: false };
}

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Run Sentinel Checks
    if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/auth')) {
        const { blocked, reason } = checkSentinel(request);
        if (blocked) {
            return new NextResponse(JSON.stringify({ error: reason }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // 2. Security Headers (Reinforcement)
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 3. Supabase Auth Logic
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return request.cookies.get(name)?.value; },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 4. Protected Routes
    const isAuthPage = ['/login', '/signup', '/forgot-password'].some(p => request.nextUrl.pathname.startsWith(p));
    const protectedRoutes = ['/dashboard', '/training', '/nutrition', '/admin', '/onboarding', '/settings'];
    const isProtectedPage = protectedRoutes.some(p => request.nextUrl.pathname.startsWith(p));

    if (!user && isProtectedPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Note: We don't redirect authenticated users away from /login or /signup anymore
    // to prevent redirect loops. The client-side will handle showing appropriate UI.

    // 5. Admin Route Protection (Middleware level check for extra safety)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Note: We can't easily check 'role' here without a DB call which is expensive in middleware.
        // We rely on RLS and Page-level checks. 
        // But we could decode the JWT if needed. For now, rely on Layout.
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
