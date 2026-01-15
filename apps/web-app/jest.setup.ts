import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            pathname: '/',
            query: {},
            asPath: '/',
        };
    },
    usePathname() {
        return '/';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(),
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } },
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        })),
        storage: {
            from: jest.fn(() => ({
                upload: jest.fn(),
                download: jest.fn(),
                remove: jest.fn(),
                getPublicUrl: jest.fn(),
            })),
        },
    },
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
    motion: {
        div: 'div',
        section: 'section',
        button: 'button',
        span: 'span',
        p: 'p',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Mock Three.js
jest.mock('three', () => ({
    Scene: jest.fn(),
    PerspectiveCamera: jest.fn(),
    WebGLRenderer: jest.fn(() => ({
        setSize: jest.fn(),
        render: jest.fn(),
        domElement: document.createElement('canvas'),
    })),
    BoxGeometry: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    Mesh: jest.fn(),
    AmbientLight: jest.fn(),
    PointLight: jest.fn(),
    TextureLoader: jest.fn(() => ({
        load: jest.fn(),
    })),
    Color: jest.fn(),
    Vector3: jest.fn(),
}));

// Mock Lucide-react
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        // Override components with simple div or span if needed, but usually icons are fine in JSDOM
    };
});

// Mock Sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
    },
}));

// Suppress console errors in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
