import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
    value: number[];
    min: number;
    max: number;
    step: number;
    onValueChange: (val: number[]) => void;
    className?: string;
}

export function Slider({ value, min, max, step, onValueChange, className }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseFloat(e.target.value)]);
    };

    return (
        <div className={cn("relative flex items-center select-none touch-none w-full", className)}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
        </div>
    );
}
