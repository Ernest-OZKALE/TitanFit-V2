import { Ban, RefreshCw, Mail, ShieldAlert, UserPlus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function AdminQuickActions() {
    const actions = [
        { label: "Manage Users", icon: UserPlus, href: "/admin/users" },
        { label: "Refund User", icon: RefreshCw },
        { label: "Ban Account", icon: Ban, color: "text-red-400 hover:text-red-300" },
        { label: "Send Blast", icon: Mail },
    ];

    return (
        <GlassCard className="h-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Command Deck</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, i) => {
                    const content = (
                        <>
                            <action.icon size={20} />
                            <span className="text-xs font-medium">{action.label}</span>
                        </>
                    );
                    const className = `flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all w-full ${action.color || "text-gray-400 hover:text-white"}`;

                    if (action.href) {
                        return (
                            <Link key={i} href={action.href} className={className}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button key={i} className={className}>
                            {content}
                        </button>
                    );
                })}
            </div>
        </GlassCard>
    );
}
