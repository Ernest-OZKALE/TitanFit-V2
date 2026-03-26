"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Dumbbell,
    Utensils,
    TrendingUp,
    LayoutDashboard,
    Search,
    Zap,
    LogOut,
    Trophy,
    Users
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function CommandCenter() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]/95 shadow-2xl shadow-gold/10 relative z-50 ring-1 ring-gold/20"
                    >
                        <Command className="w-full bg-transparent text-white">
                            <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
                                <Search className="mr-2 h-5 w-5 shrink-0 text-gold/70" />
                                <Command.Input
                                    placeholder="Tapez une commande ou recherchez..."
                                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-gray-500 text-white selection:bg-gold/30"
                                />
                                <div className="flex items-center gap-1">
                                    <span className="hidden sm:inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400">
                                        <span className="text-xs">ESC</span>
                                    </span>
                                </div>
                            </div>

                            <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden py-2 px-2 custom-scrollbar">
                                <Command.Empty className="py-6 text-center text-sm text-gray-500">
                                    Aucun résultat trouvé.
                                </Command.Empty>

                                <Command.Group heading="Navigation Rapide" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1 bg-transparent">
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/dashboard"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <LayoutDashboard className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Dashboard</span>
                                        <span className="ml-auto text-xs text-gray-600 group-hover:text-gold/60">G</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/training"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Dumbbell className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Entraînement</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/nutrition"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Utensils className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Nutrition</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/social"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Users className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Communauté</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Separator className="my-1 h-px bg-white/5" />

                                <Command.Group heading="Actions" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1">
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/log-workout"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Zap className="mr-3 h-4 w-4 text-gold group-hover:text-gold transition-colors" />
                                        <span className="font-semibold text-white group-hover:text-gold">Démarrer Session</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/log-meal"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Calculatormr className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Ajouter Repas</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/progress"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <TrendingUp className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Voir Progression</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Separator className="my-1 h-px bg-white/5" />

                                <Command.Group heading="Système" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1">
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/profile"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Mon Profil</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/settings"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-gray-200 transition-all hover:bg-gold/10 hover:text-gold aria-selected:bg-gold/10 aria-selected:text-gold data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold group"
                                    >
                                        <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
                                        <span>Paramètres</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push("/logout"))}
                                        className="flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 aria-selected:bg-red-500/10 aria-selected:text-red-300 data-[selected=true]:bg-red-500/10 data-[selected=true]:text-red-300 group"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-300 transition-colors" />
                                        <span>Déconnexion</span>
                                    </Command.Item>
                                </Command.Group>
                            </Command.List>

                            <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500">
                                <div className="flex gap-2">
                                    <span>TITANFIT V2</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Naviguer <kbd className="font-sans bg-white/10 px-1 rounded">↓</kbd> <kbd className="font-sans bg-white/10 px-1 rounded">↑</kbd></span>
                                    <span>Valider <kbd className="font-sans bg-white/10 px-1 rounded">↵</kbd></span>
                                </div>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Helper for icon
const Calculatormr = (props: any) => (
    <Calculator {...props} />
)
