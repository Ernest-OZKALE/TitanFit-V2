module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run build && npm run start',
            url: ['http://localhost:3000/', 'http://localhost:3000/login', 'http://localhost:3000/admin'],
            numberOfRuns: 3,
            settings: {
                preset: 'desktop',
            },
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],

                // Performance metrics
                'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
                'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['error', { maxNumericValue: 300 }],

                // Best practices
                'uses-http2': 'off',
                'uses-long-cache-ttl': 'warn',
                'uses-optimized-images': ['error', { maxLength: 0 }],
                'modern-image-formats': 'warn',

                // Accessibility
                'color-contrast': ['error', { maxLength: 0 }],
                'image-alt': ['error', { maxLength: 0 }],
                'label': ['error', { maxLength: 0 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
