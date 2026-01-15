'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Diamond/Glass Tilt Card
export function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]); // Reduced rotation for classier feel
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative transition-all duration-500 ease-out ${className}`}
        >
            <div
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                className="h-full"
            >
                {children}
            </div>
            {/* Diamond Reflection */}
            <motion.div
                className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl bg-blend-overlay"
                style={{ transform: "translateZ(20px)" }}
            />
        </motion.div>
    );
}

// Prestige White/Gold Mesh Background
export function MeshGradientHero() {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-[#FFFFFF]">
            {/* Gold Blob */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#F5C518]/10 rounded-full blur-[120px] animate-blob"></div>
            {/* Silver/Blue tint Blob */}
            <div className="absolute top-[-10%] right-[-20%] w-[70%] h-[70%] bg-blue-50/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            {/* Warmth Blob */}
            <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-orange-100/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>

            {/* Diamond Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.4] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')]"></div>

            {/* Light Beams */}
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none"></div>
        </div>
    )
}
