'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove(currentTarget: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.currentTarget.getBoundingClientRect();
        mouseX.set(currentTarget.clientX - left);
        mouseY.set(currentTarget.clientY - top);
    }

    return (
        <div
            className={`group relative border border-white/10 bg-black/40 overflow-hidden rounded-xl ${className}`}
            onMouseMove={onMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(212, 175, 55, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}
