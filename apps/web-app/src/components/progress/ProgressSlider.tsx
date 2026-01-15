"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronsLeftRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Images
const BEFORE_IMG = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop"; // Man posing gym
const AFTER_IMG = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop"; // Man different pose fitness

export function ProgressSlider() {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<any>(null);

    const handleMouseMove = (e: any) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const position = ((x - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(100, Math.max(0, position)));
    };

    const handleMouseUp = () => setIsResizing(false);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        }
    }, [isResizing]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#D4AF37]" /> Visual Transformation
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Jan 2024 vs Today
                </span>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl border-4 border-white"
                onMouseDown={() => setIsResizing(true)}
                onTouchStart={() => setIsResizing(true)}
            >
                {/* After Image (Background) */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${AFTER_IMG})` }}
                />

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0 bg-cover bg-center border-r-4 border-[#D4AF37]"
                    style={{
                        backgroundImage: `url(${BEFORE_IMG})`,
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                    }}
                >
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                        Before
                    </div>
                </div>

                {/* Labels (After) */}
                <div className="absolute top-4 right-4 bg-[#D4AF37]/80 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                    After
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center group"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37] group-hover:scale-110 transition-transform">
                        <ChevronsLeftRight className="w-5 h-5" />
                    </div>
                </div>

            </div>

            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                Drag to compare
            </p>
        </div>
    );
}
