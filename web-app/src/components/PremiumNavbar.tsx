'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function PremiumNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Communauté", href: "#community" },
        { name: "Premium", href: "#pricing" },
        { name: "App", href: "/dashboard" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                    scrolled
                        ? "bg-white/80 backdrop-blur-md border-slate-200/50 py-4 shadow-sm"
                        : "bg-transparent border-transparent py-6"
                )}
            >
                <div className="container px-4 mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                            T
                        </div>
                        <span className={cn(
                            "font-black text-xl tracking-tighter transition-colors",
                            scrolled ? "text-slate-900" : "text-slate-900"
                        )}>
                            TITAN<span className="text-[#D4AF37]">FIT</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-bold uppercase tracking-wide hover:text-[#D4AF37] transition-colors relative group",
                                    scrolled ? "text-slate-600" : "text-slate-600"
                                )}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-900 hover:text-[#D4AF37] font-bold">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="rounded-full bg-[#0F172A] text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white transition-all font-bold px-6 shadow-lg hover:shadow-[#D4AF37]/20">
                                Commencer
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-slate-900"
                    >
                        <Menu className="h-8 w-8" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white text-slate-900 p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <span className="font-black text-2xl tracking-tighter">
                                TITAN<span className="text-[#D4AF37]">FIT</span>
                            </span>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="h-8 w-8 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-2xl font-black">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:text-[#D4AF37] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full h-14 text-lg rounded-xl border-slate-200">
                                    Connexion
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full h-14 text-lg rounded-xl bg-[#D4AF37] text-black hover:bg-[#B8860B]">
                                    Créer un compte
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
