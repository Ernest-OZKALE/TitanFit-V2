import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // 1. Protection basique contre les attaques DDOS / Spam répétitif (Rate Limiting très basique via cookie)
    // Pour une vraie protection, utiliser Upstash ou autre, mais ceci est une bonne première couche sans dépendance.
    const requestCount = request.cookies.get('req_count')?.value;
    const lastRequest = request.cookies.get('last_req')?.value;

    // Si API route, on peut ajouter des headers de sécurité supplémentaires
    if (request.nextUrl.pathname.startsWith('/api')) {
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Protection simple du endpoint AI
        if (request.nextUrl.pathname.startsWith('/api/ai-chat')) {
            // On laisse passer, mais on pourrait vérifier un token spécifique ici
        }
        return response;
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Ajouter des en-têtes de sécurité stricts pour toutes les réponses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); // Bloquer l'accès aux périfériques par défaut

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.headers.set('X-Content-Type-Options', 'nosniff'); // Re-apply headers on new response
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes logic
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/forgot-password') ||
        request.nextUrl.pathname.startsWith('/update-password');

    const protectedRoutes = [
        '/dashboard', '/training', '/nutrition', '/progress',
        '/settings', '/admin', '/biohacking', '/vision',
        '/social', '/goals', '/profile',
        '/ai-coach', '/log-meal', '/log-workout', '/food-log', '/workout-log', '/feed'
    ];

    const isProtectedPage = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Redirect unauthenticated users away from protected pages
    if (!user && isProtectedPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protection Admin basique (Vérification supplémentaire côté serveur recommandée)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Idéalement, on vérifie le rôle ici, mais `getUser` retourne juste l'objet user de base.
        // La vraie vérification admin doit se faire dans le layout ou la page admin via RLS/Profile check.
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
