import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
    hoverEffect?: boolean;
    noPadding?: boolean;
}

export function GlassCard({
    children,
    className,
    gradient = false,
    hoverEffect = true,
    noPadding = false,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                // Base Glassmorphism (Pure White Mode)
                "relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 backdrop-blur-2xl",
                // Background & Sophisticated Shadows (Apple-inspired)
                "bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)]",
                // Gradient Accent (Pure White)
                gradient && "bg-gradient-to-br from-white to-white/60",
                // Hover Effect (Enhanced Depth)
                hoverEffect &&
                "transition-all duration-500 hover:border-titan-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 hover:bg-white",
                // Padding
                !noPadding && "p-8",
                className
            )}
            {...props}
        >
            {/* Narrative High-Tech Shine */}
            <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
            {children}
        </motion.div>
    );
}
