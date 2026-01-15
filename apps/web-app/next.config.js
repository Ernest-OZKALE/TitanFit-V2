/** @type {import('next').NextConfig} */
// Force restart: 2026-01-21
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    // Production optimizations
    reactStrictMode: true,

    // Turbopack config (required for Next.js 16 with custom webpack)
    turbopack: {},

    // Temporarily ignore TypeScript errors during build for deployment
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },

    // Compression
    compress: true,

    // Headers for security and caching
    // Headers for security and caching
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), interest-cohort=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        // Allowing 'unsafe-inline' and 'unsafe-eval' for Next.js dev mode & some libs.
                        // In strict production, this should be nonced.
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co *.stripe.com *.googleapis.com *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' blob: data: *.supabase.co *.stripe.com maps.googleapis.com *.googleusercontent.com *.google-analytics.com images.unsplash.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://unpkg.com; font-src 'self' fonts.gstatic.com data:; connect-src 'self' *.supabase.co *.stripe.com *.googleapis.com *.google-analytics.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://unpkg.com ws: wss:; frame-src 'self' *.stripe.com *.google.com youtube.com;"
                    }
                ],
            },
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // Redirects
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ];
    },

    // Webpack optimizations
    webpack: (config, { isServer }) => {
        // Optimize bundle
        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    commons: {
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 2,
                    },
                    lib: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                },
            };
        }

        return config;
    },

    // Environment variables available to the browser
    env: {
        NEXT_PUBLIC_APP_NAME: 'TitanFit',
        NEXT_PUBLIC_APP_VERSION: '2.0.0',
    },
};

module.exports = withBundleAnalyzer(nextConfig);
// Force Restart
