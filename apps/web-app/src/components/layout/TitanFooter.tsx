"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TitanFooter() {
    const pathname = usePathname();
    const isApp = pathname?.startsWith('/dashboard');

    // Don't show footer inside the main app dashboard to avoid clutter
    if (isApp) return null;

    return (
        <footer className="bg-white py-12 border-t border-slate-100 relative overflow-hidden">
            {/* Background Glow - Golden Touch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-[#D4AF37]/20 blur-3xl z-0" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">
                                T
                            </div>
                            <span className="font-black text-xl tracking-tighter text-slate-900">
                                TITAN<span className="text-[#D4AF37]">FIT</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            L'optimisation humaine par la donnée. L'élite du fitness connecté, propulsé par l'intelligence artificielle.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs mb-4">Produit</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</Link></li>
                            <li><Link href="/#features" className="hover:text-[#D4AF37] transition-colors">Fonctionnalités</Link></li>
                            <li><Link href="/#pricing" className="hover:text-[#D4AF37] transition-colors">Premium</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/legal/terms" className="hover:text-[#D4AF37] transition-colors">Conditions (CGU)</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-[#D4AF37] transition-colors">Confidentialité</Link></li>
                            <li><Link href="/legal/privacy#cookies" className="hover:text-[#D4AF37] transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs">
                        © {new Date().getFullYear()} TitanFit Technologies. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
