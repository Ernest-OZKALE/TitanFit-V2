'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, Apple, Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Train', path: '/training', icon: Dumbbell },
    { name: 'Fuel', path: '/nutrition', icon: Apple },
    { name: 'Tribe', path: '/social', icon: Users },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="relative flex flex-col items-center justify-center w-full h-full"
                        >
                            <motion.div
                                className="flex flex-col items-center"
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-[17px] w-12 h-[2px] bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <Icon
                                    className={`w-6 h-6 mb-1 transition-colors duration-300 ${isActive ? 'text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-gray-500 hover:text-white'
                                        }`}
                                />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-600'
                                    }`}>
                                    {item.name}
                                </span>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
