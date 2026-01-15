'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Users, Trophy, Dumbbell, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingDock() {
    return (
        <>
            {/* Desktop Dock */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                <div className="flex items-end gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <DockIcon href="/" icon={<Home className="h-6 w-6" />} label="Accueil" />
                    <DockIcon href="/dashboard" icon={<LayoutDashboard className="h-6 w-6" />} label="App" />
                    <div className="w-px h-8 bg-white/20 mx-1" />
                    <DockIcon href="#features" icon={<Sparkles className="h-6 w-6" />} label="Features" />
                    <DockIcon href="#community" icon={<Users className="h-6 w-6" />} label="Communauté" />
                    <DockIcon href="#pricing" icon={<Trophy className="h-6 w-6" />} label="Premium" />
                    <div className="w-px h-8 bg-white/20 mx-1" />
                    <DockIcon href="/login" icon={<Dumbbell className="h-6 w-6" />} label="Login" highlight />
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
                <div className="flex items-center justify-around p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl text-slate-400">
                    <Link href="/" className="hover:text-[#D4AF37] transition-colors"><Home className="h-6 w-6" /></Link>
                    <Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors"><LayoutDashboard className="h-6 w-6" /></Link>
                    <div className="w-12 h-12 -mt-8 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border-4 border-[#FAFAFA]">
                        <Link href="/login"><Dumbbell className="h-6 w-6 text-slate-900" /></Link>
                    </div>
                    <Link href="#community" className="hover:text-[#D4AF37] transition-colors"><Users className="h-6 w-6" /></Link>
                    <Link href="#features" className="hover:text-[#D4AF37] transition-colors"><Sparkles className="h-6 w-6" /></Link>
                </div>
            </div>
        </>
    );
}

function DockIcon({ href, icon, label, highlight }: { href: string; icon: React.ReactNode; label: string; highlight?: boolean }) {
    const mouseX = useMotionValue(Infinity);

    return (
        <MotionLink
            href={href}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="group relative flex flex-col items-center gap-2"
        >
            <IconContainer mouseX={mouseX} highlight={highlight}>
                <span className={cn(
                    "relative z-10 transition-colors duration-300",
                    highlight ? "text-[#D4AF37]" : "text-slate-200 group-hover:text-white"
                )}>
                    {icon}
                </span>
            </IconContainer>
            <span className="absolute -top-10 px-2 py-1 rounded bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                {label}
            </span>
        </MotionLink>
    );
}

function IconContainer({ mouseX, highlight, children }: { mouseX: any; highlight?: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width, height: width }}
            className={cn(
                "aspect-square rounded-full flex items-center justify-center relative",
                highlight
                    ? "bg-[#0F172A] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "bg-slate-800/50 border border-slate-700 hover:bg-slate-700"
            )}
        >
            {children}
        </motion.div>
    );
}

const MotionLink = motion(Link);
