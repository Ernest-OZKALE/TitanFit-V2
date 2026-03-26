import { GlassCard } from "@/components/ui/GlassCard";
import { UserPlus, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react";
import { AdminSignal } from "@/types/admin";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface LiveSignalsProps {
    signals?: AdminSignal[];
}

export function LiveSignals({ signals = [] }: LiveSignalsProps) {

    const getIcon = (type: string) => {
        switch (type) {
            case 'signup': return UserPlus;
            case 'sale': return ShoppingCart;
            case 'alert': return AlertTriangle;
            default: return CheckCircle;
        }
    }

    const getColor = (type: string) => {
        switch (type) {
            case 'signup': return 'text-blue-400';
            case 'sale': return 'text-titan-gold';
            case 'alert': return 'text-red-400';
            default: return 'text-green-400';
        }
    }

    return (
        <GlassCard className="h-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Signals</h3>
            <div className="space-y-4">
                {signals.length === 0 && <p className="text-gray-500 text-sm">Aucun signal récent.</p>}

                {signals.map((signal, i) => {
                    const Icon = getIcon(signal.type);
                    const color = getColor(signal.type);
                    return (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                            <div className={`p-2 rounded-md bg-white/5 border border-white/5 ${color}`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-200 group-hover:text-white truncate">{signal.message}</p>
                            </div>
                            <span className="text-xs font-mono text-gray-500 whitespace-nowrap">
                                {formatDistanceToNow(new Date(signal.timestamp), { addSuffix: true, locale: fr })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
