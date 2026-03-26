import { GlassCard } from "@/components/ui/GlassCard";
import { Users, DollarSign, Activity, Server } from "lucide-react";

interface KPIRibbonProps {
    stats?: {
        totalUsers: number;
        mrr: number;
        systemHealth: string;
    };
    isLoading?: boolean;
}

export function KPIRibbon({ stats, isLoading = false }: KPIRibbonProps) {
    const kpiData = [
        {
            label: "Active Users",
            value: stats?.totalUsers?.toString() || "0",
            icon: Users,
            status: "live"
        },
        {
            label: "MRR",
            value: `$${stats?.mrr?.toFixed(2) || "0.00"}`,
            icon: DollarSign,
            change: "+0%" // Placeholder until history logic
        },
        {
            label: "System Load",
            value: isLoading ? "..." : "32%",
            icon: Server,
            status: stats?.systemHealth === 'stable' ? 'stable' : 'warning'
        },
        {
            label: "Health",
            value: "99.9%",
            icon: Activity,
            status: "good"
        },
    ];

    if (isLoading) {
        return (
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {kpiData.map((stat, i) => (
                <GlassCard key={i} className="flex items-center justify-between py-4" noPadding>
                    <div className="flex items-center gap-4 px-6 w-full">
                        <div className={`p-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                                {stat.status === 'live' && (
                                    <span className="flex h-2 w-2 relative mb-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                )}
                                {stat.change && (
                                    <span className="text-xs text-green-400 mb-1">{stat.change}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
