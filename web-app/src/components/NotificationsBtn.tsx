'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationsBtn() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        fetchNotifications();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setNotifications((prev) => [payload.new, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    async function fetchNotifications() {
        const { data } = await supabase
            .from('notifications')
            .select(`
        *,
        actor:profiles!actor_id (username, avatar_url)
      `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.is_read).length);
        }
    }

    async function markAsRead() {
        if (unreadCount === 0) return;

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user?.id)
            .eq('is_read', false);

        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    }

    return (
        <DropdownMenu onOpenChange={(isOpen) => isOpen && markAsRead()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#D4AF37] border-2 border-black animate-pulse"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-black/90 backdrop-blur-xl border border-white/10 text-gray-100">
                <DropdownMenuLabel className="text-[#D4AF37]">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        Aucune nouvelle notification
                    </div>
                ) : (
                    notifications.map((n) => (
                        <DropdownMenuItem key={n.id} className="cursor-pointer p-3 hover:bg-white/5 focus:bg-white/5">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border border-white/10">
                                    {n.actor?.avatar_url ? (
                                        <img src={n.actor.avatar_url} alt="Actor" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#D4AF37] flex items-center justify-center text-black text-xs font-bold">
                                            {n.actor?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none text-gray-200">
                                        <span className="font-bold text-white">{n.actor?.username}</span> {n.content}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shadow-[0_0_5px_#D4AF37]"></div>}
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
