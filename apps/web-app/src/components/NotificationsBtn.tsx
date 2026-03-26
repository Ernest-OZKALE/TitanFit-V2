"use client";

import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationsBtn() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

    if (loading) return <Button variant="ghost" size="icon" disabled className="text-white/20"><Bell className="h-5 w-5 opacity-50" /></Button>;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors p-0 w-10 h-10 rounded-xl">
                    <Bell className={cn("h-5 w-5 transition-transform group-hover:rotate-12", unreadCount > 0 ? "text-[#D4AF37]" : "text-gray-400")} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#D4AF37] ring-2 ring-black animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 text-gray-200 p-0 shadow-2xl shadow-gold/20 mr-4 mt-2">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                    <DropdownMenuLabel className="text-white text-base font-bold flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#D4AF37]" /> Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllAsRead();
                            }}
                            className="text-xs h-7 hover:bg-white/5 text-gray-400 hover:text-[#D4AF37]"
                        >
                            <CheckCheck className="w-3 h-3 mr-1" /> Tout lu
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-sm">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <Bell className="w-6 h-6 opacity-30" />
                            </div>
                            <p>Tout est calme...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <DropdownMenuItem
                                    key={notif.id}
                                    className={cn(
                                        "p-4 focus:bg-white/5 cursor-pointer flex flex-col items-start gap-1 rounded-none border-b border-white/5 last:border-0",
                                        !notif.is_read ? "bg-[#D4AF37]/5" : ""
                                    )}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        if (notif.link) window.location.href = notif.link;
                                    }}
                                >
                                    <div className="flex justify-between w-full items-start gap-3">
                                        <span className={cn("font-bold text-sm", !notif.is_read ? "text-[#D4AF37]" : "text-gray-300")}>
                                            {notif.title}
                                        </span>
                                        {!notif.is_read && <span className="h-2 w-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0 shadow-[0_0_5px_#D4AF37]" />}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                        {notif.message}
                                    </p>
                                    <span className="text-[10px] text-slate-600 mt-2 font-mono uppercase tracking-wider">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 border-t border-white/5 text-center bg-black/40">
                    <Button variant="link" className="text-xs text-gray-500 hover:text-white h-auto p-0 decoration-transparent">
                        Historique complet
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
