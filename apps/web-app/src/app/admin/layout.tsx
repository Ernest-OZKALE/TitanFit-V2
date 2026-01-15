'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    ShoppingCart,
    BarChart3,
    Settings,
    Menu,
    X,
    Shield,
    Image as ImageIcon,
    Bot,
    Sparkles,
    Ticket,
    Crown,
    Tag,
    Mail,
    MessageSquare,
    FlaskConical,
    Send,
    Bell,
    Shuffle,
    Box
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { I18nProvider } from '@/contexts/i18n-context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Agents & IA', href: '/admin/agents', icon: Bot },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Rôles & VIP', href: '/admin/user-roles', icon: Crown },
    { name: 'Codes Promo', href: '/admin/promo-codes', icon: Ticket },
    { name: 'Segmentation', href: '/admin/client-tags', icon: Tag },
    { name: 'Emails', href: '/admin/email-templates', icon: Mail },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Send },
    { name: 'Push Notifs', href: '/admin/push-notifications', icon: Bell },
    { name: 'A/B Testing', href: '/admin/ab-testing', icon: FlaskConical },
    { name: 'Live Chat', href: '/admin/chat', icon: MessageSquare },
    { name: 'Tickets', href: '/admin/tickets', icon: FileText },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Packs/Bundles', href: '/admin/bundles', icon: Box },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Redirections', href: '/admin/redirects', icon: Shuffle },
    { name: 'Contenu', href: '/admin/content', icon: FileText },
    { name: 'Médias', href: '/admin/media', icon: ImageIcon },
    { name: 'Analytique', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <I18nProvider>
            <div className="min-h-screen bg-white text-slate-900 selection:bg-[#D4AF37] selection:text-white font-sans overflow-x-hidden">
                {/* Background Texture */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

                {/* Ambient Glow */}
                <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none z-0" />

                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar (Glassmorphic) */}
                <aside className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl",
                    "transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)", // Apple-like easing
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    "lg:translate-x-0"
                )}>
                    {/* Logo Area */}
                    <div className="h-24 flex items-center justify-between px-8 border-b border-slate-100 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        <Link href="/" className="flex items-center space-x-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center text-white shadow-[0_0_20px_-5px_#D4AF37] group-hover:scale-105 transition-transform duration-300">
                                <Sparkles className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">Titan<span className="text-[#D4AF37]">Fit</span></span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-1">Nexus Admin</span>
                            </div>
                        </Link>
                        <div className="hidden lg:block"><LanguageSwitcher /></div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-6 space-y-1.5 overflow-y-auto h-[calc(100vh-180px)] scrollbar-none">
                        <div className="px-3 py-2 text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-2 opacity-60">
                            Command Center
                        </div>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-6'
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AF37] rounded-r-full shadow-sm" />
                                    )}
                                    <item.icon className={cn("h-5 w-5 transition-colors duration-300", isActive ? "text-[#D4AF37]" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span className="relative z-10">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Status Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 bg-white/60 backdrop-blur-xl">
                        <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group shadow-sm">
                            <div className="relative">
                                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Système Sécurisé</p>
                                <p className="text-[10px] text-slate-400 font-mono">v2.1.0 • Stable</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content wrapper */}
                <div className="lg:pl-72 transition-all duration-300 min-h-screen flex flex-col relative z-10">
                    {/* Top bar (Floating Glass) */}
                    <header className="h-24 sticky top-0 z-30 flex items-center justify-between px-8 py-4 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

                        {/* Search Bar Container */}
                        <div className="pointer-events-auto flex-1 max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl px-2 h-14 flex items-center gap-2 shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-slate-400 hover:text-slate-900"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden lg:block" />
                            <Bot className="w-5 h-5 text-[#D4AF37] hidden sm:block animate-pulse" />
                            <input
                                type="search"
                                placeholder="Demander à l'IA ou rechercher..."
                                className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 font-medium"
                            />
                            <div className="flex items-center gap-2 pr-2">
                                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono">
                                    <span className="text-xs">⌘</span>K
                                </div>
                                <Link href="/dashboard">
                                    <Button size="sm" className="bg-[#D4AF37] text-black hover:bg-[#B8860B] font-bold rounded-xl h-9 px-4 shadow-[0_0_20px_-5px_#D4AF37]">
                                        App
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="pointer-events-auto ml-6 flex items-center gap-4">

                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-8 pt-4 pb-12 space-y-10 animate-fade-in-up">
                        {children}
                    </main>
                </div>
            </div>
        </I18nProvider>
    );
}
