'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Dumbbell, TrendingUp, MessageSquare, Users, User } from 'lucide-react';

const navigation = [
    { name: 'Accueil', href: '/dashboard', icon: Home },
    { name: 'Repas', href: '/food-log', icon: Utensils },
    { name: 'Gym', href: '/workout-log', icon: Dumbbell },
    { name: 'Stats', href: '/progress', icon: TrendingUp },
    { name: 'IA', href: '/ai-coach', icon: MessageSquare },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Don't show on admin pages or auth pages
    if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup' || pathname === '/') {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 md:hidden safe-area-pb">
            <div className="flex justify-around items-center h-16 px-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${isActive
                                ? 'text-[#D4AF37]'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#D4AF37]/10 scale-110' : ''}`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
