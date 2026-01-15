'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
                    <p className="animate-pulse text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Initialisation du Terrain...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="bg-black min-h-screen text-white relative overflow-hidden">
            {/* Ambient Base Layer */}
            <div className="fixed inset-0 bg-[#0a0a0a] -z-20" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 pointer-events-none" />

            {/* Content */}
            {children}
        </div>
    );
}
