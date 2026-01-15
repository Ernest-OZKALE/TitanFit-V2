import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ActionTileProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    onClick: () => void;
    accentColor?: string; // e.g., "text-titan-gold"
    image?: string; // Optional Background Image
}

export function ActionTile({
    title,
    subtitle,
    icon: Icon,
    onClick,
    accentColor = "text-white",
    image,
}: ActionTileProps) {
    return (
        <GlassCard
            className="group relative flex flex-col justify-between h-full min-h-[180px] hover:border-titan-gold/40 cursor-pointer"
            onClick={onClick}
            noPadding
        >
            {/* Background Image (Optional) */}
            {image && (
                <div
                    className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                />
            )}

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-full bg-white/10 backdrop-blur-md ${accentColor}`}>
                        <Icon size={24} />
                    </div>
                    <ArrowRight className="text-white/50 group-hover:text-titan-gold group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-titan-gold transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400">{subtitle}</p>
                </div>
            </div>
        </GlassCard>
    );
}
