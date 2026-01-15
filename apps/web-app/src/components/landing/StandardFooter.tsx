
import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';

export default function StandardFooter() {
    return (
        <footer className="relative z-20 py-16 px-8 bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">TITAN<span className="text-[#D4AF37]">FIT</span></h3>
                    <p className="text-slate-500 text-xs uppercase tracking-widest max-w-xs">
                        TitanFit Industries // Est. 2026
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                        L'architecture ultime de la performance humaine.
                        Bio-données, Algorithmes, Résultats.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-col md:items-center gap-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">App</Link>
                    <Link href="/login" className="hover:text-slate-900 transition-colors">Connexion</Link>
                    <Link href="/signup" className="hover:text-[#D4AF37] transition-colors">S'inscrire</Link>
                    <Link href="#" className="hover:text-[#D4AF37] transition-colors">Support</Link>
                </div>

                {/* Social & Legal */}
                <div className="flex flex-col md:items-end gap-6">
                    <div className="flex gap-4">
                        <a href="#" className="p-3 rounded-full bg-slate-50 hover:bg-[#D4AF37] hover:text-white transition-all text-slate-900 border border-slate-200 hover:border-[#D4AF37]">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-3 rounded-full bg-slate-50 hover:bg-[#D4AF37] hover:text-white transition-all text-slate-900 border border-slate-200 hover:border-[#D4AF37]">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-3 rounded-full bg-slate-50 hover:bg-[#D4AF37] hover:text-white transition-all text-slate-900 border border-slate-200 hover:border-[#D4AF37]">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[10px] text-slate-500 uppercase tracking-widest">
                        <span>© 2026 TitanFit Corp.</span>
                        <div className="flex gap-4">
                            <Link href="/legal/privacy" className="hover:text-slate-900">Politique</Link>
                            <Link href="/legal/terms" className="hover:text-slate-900">Conditions</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
