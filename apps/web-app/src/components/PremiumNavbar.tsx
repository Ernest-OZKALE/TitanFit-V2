
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export function PremiumNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent scrolling when mobile menu is open
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    // Handle keyboard navigation for mobile menu
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
            
            // Handle Tab navigation within mobile menu
            if (mobileMenuOpen && event.key === 'Tab' && mobileMenuRef.current) {
                const focusableElements = mobileMenuRef.current.querySelectorAll(
                    'a, button, input, textarea, select'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Communauté", href: "#community" },
        { name: "Premium", href: "#pricing" },
        { name: "Blog", href: "/blog" },
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
                        <button
                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                            className="p-2 text-slate-900 hover:text-[#D4AF37] transition-colors"
                            aria-label="Command Center"
                        >
                            <Search className="h-5 w-5" />
                        </button>
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

                    {/* Enhanced Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg p-1"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu-overlay"
                        aria-label="Toggle mobile menu"
                    >
                        <motion.div
                            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-8 w-8" />
                            ) : (
                                <Menu className="h-8 w-8" />
                            )}
                        </motion.div>
                    </button>
                </div>
            </motion.nav>

            {/* Enhanced Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        id="mobile-menu-overlay"
                        className="fixed inset-0 z-[60] bg-white text-slate-900 p-6 flex flex-col overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-menu-title"
                    >
                        <div className="flex justify-between items-center mb-10 pt-4">
                            <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                            <span className="font-black text-2xl tracking-tighter">
                                TITAN<span className="text-[#D4AF37]">FIT</span>
                            </span>
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                aria-label="Close menu"
                            >
                                <X className="h-8 w-8 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-2xl font-black mt-8">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="hover:text-[#D4AF37] transition-colors py-2 block"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-4 pb-8">
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
