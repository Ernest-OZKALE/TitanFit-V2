"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Dumbbell, Utensils, Eye, Users, Brain, LayoutGrid, Settings, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Tableau de Bord", icon: Home },
    { href: "/training", label: "Entraînement", icon: Dumbbell },
    { href: "/nutrition", label: "Nutrition", icon: Utensils },
    { href: "/vision", label: "Vision IA", icon: Eye },
    { href: "/progress", label: "Progression", icon: LayoutGrid },
    { href: "/social", label: "Communauté", icon: Users },
    { href: "/biohacking", label: "Bio-Hacking", icon: Brain },
];

export function TitanSidebar() {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 z-50 flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.03),1px_0_1px_rgba(0,0,0,0.01)]"
        >
            {/* Logo Area */}
            <div className="p-8 pb-4">
                <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
                    TITAN<span className="text-[#D4AF37]">FIT</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-1">Omega Protocol v3.0</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 group",
                                isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}>
                                <div className={cn("p-1.5 rounded-lg transition-colors", isActive ? "bg-[#D4AF37] text-slate-900" : "bg-transparent group-hover:bg-white")}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>

                                {isActive && (
                                    <motion.div layoutId="activeInd" className="absolute right-3">
                                        <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                                    </motion.div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <Link href="/settings">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-slate-500 uppercase">
                            S
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">Starwek</p>
                            <p className="text-xs text-[#D4AF37] font-bold uppercase">Titan Tier</p>
                        </div>
                        <Settings className="w-4 h-4 text-slate-400 hover:text-slate-900 transition-colors" />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}
