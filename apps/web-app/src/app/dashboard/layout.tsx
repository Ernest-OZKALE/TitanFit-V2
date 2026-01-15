'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from "@/lib/use-profile";
import { DashboardOnboarding, triggerOnboarding } from "@/components/dashboard/DashboardOnboarding";
import { FloatingDock } from '@/components/layout/FloatingDock';
import { GlobalCommand } from '@/components/layout/GlobalCommand';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LogoutButton() {
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut();
        } catch (e) {
            console.error("Logout failed", e);
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoading}
            className="h-auto p-3 md:px-4 md:py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center gap-2 transition-all active:scale-95 touch-manipulation"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
                <LogOut className="w-5 h-5" />
            )}
            <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">
                {isLoading ? '...' : 'Se déconnecter'}
            </span>
        </Button>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth();
    const [isCmdOpen, setIsCmdOpen] = useState(false);

    // Global Key Listener for Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCmdOpen(prev => !prev);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#D4AF37]/20 relative">
            {/* --- GLOBAL TEXTURE --- */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-white" />

            <DashboardOnboarding />
            <GlobalCommand isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

            {/* --- DOCK NAVIGATION (New Sidebar Replacement) --- */}
            <FloatingDock />

            {/* --- MAIN CONTENT AREA --- */}
            <div className="relative z-10 pb-32"> {/* Extra padding for dock */}
                {/* Minimal Header (Logo + Identity Only) */}
                <header className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-40 pointer-events-none">
                    <Link href="/" className="pointer-events-auto">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-[#D4AF37]/20">
                            T
                        </div>
                    </Link>

                    <div className="pointer-events-auto flex items-center gap-4 relative z-[100]">
                        <LogoutButton />
                    </div>
                </header>

                <main className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

