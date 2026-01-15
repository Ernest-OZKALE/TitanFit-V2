'use client';

import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-2xl transition duration-300 shadow-md p-6 bg-white border border-slate-200 justify-between flex flex-col space-y-4 hover:border-[#D4AF37]/50 hover:bg-slate-50/80",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-bold text-slate-900 mb-2 mt-2 text-xl lg:text-2xl group-hover/bento:text-[#D4AF37] transition-colors">
                    {title}
                </div>
                <div className="font-medium text-slate-700 text-sm md:text-base leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
