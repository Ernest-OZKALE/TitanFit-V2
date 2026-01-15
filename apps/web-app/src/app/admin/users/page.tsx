'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserManager } from '@/components/admin/UserManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LiquidGoldBg from '@/components/hero/LiquidBackground';

/**
 * Refactored Admin Users Page
 * Uses the premium UserManager component for a cleaner, high-performance experience.
 */
export default function AdminUsersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return null;
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="relative min-h-screen pb-24 pt-24 px-4 md:px-8 overflow-hidden bg-black text-white">
            <LiquidGoldBg />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <header className="mb-12">
                    <Link href="/admin">
                        <Button variant="ghost" className="text-gray-400 hover:text-white mb-6 -ml-4 transition-all hover:pl-2">
                            <ArrowLeft size={20} className="mr-2" />
                            Command Center
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-titan-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                        <span className="text-xs font-mono text-titan-gold uppercase tracking-widest">Database Alpha</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">User Management</h1>
                    <p className="text-gray-500 mt-2 font-mono text-xs uppercase tracking-wider">Accès total aux profils et permissions</p>
                </header>

                {/* USER MANAGER COMPONENT */}
                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <UserManager />
                </main>
            </div>
        </div>
    );
}
