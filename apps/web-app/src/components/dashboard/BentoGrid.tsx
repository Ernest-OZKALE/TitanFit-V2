import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoItem = ({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    id,
}: {
    children: ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
    id?: string;
}) => {
    return (
        <div
            id={id}
            className={cn(
                "relative rounded-[2.5rem] group/bento hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 p-6 bg-white/80 border border-slate-200/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)] justify-between flex flex-col space-y-4 overflow-hidden hover:-translate-y-1.5",
                // Grid Spans
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
                rowSpan === 2 && "md:row-span-2",
                className
            )}
        >
            {children}
        </div>
    );
};
