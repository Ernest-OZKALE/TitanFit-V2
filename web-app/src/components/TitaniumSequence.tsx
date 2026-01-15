'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TitaniumSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const totalFrames = 153; // Based on file list

    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        // Preload images
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            // Construct filename: frame_000_delay-0.08s.png
            // We need to match the exact format.
            // Assuming naive sequential naming for now or finding a pattern. 
            // The file list showed: frame_000_delay-0.08s.png, frame_001_delay-0.09s.png
            // The delay part changes! This is tricky.
            // simplified approach: Try to find a consistent pattern or just load what we can.
            // If the user said "restored", maybe I had a mapping.
            // For now, I'll try to guess the naming or use a wildcard if possible? No.

            // WAIT. If the filenames have variable delays in the name, I can't guess them easily without a list.
            // But I *did* list the directory. I have the list in my context history!
            // I should have saved that list.

            // Let's rely on a simpler approach for the Alpha restoration:
            // Loop 000 to 150 and try to hit the most common pattern or just ignore the delay part if I renamed them.
            // I DID NOT RENAME THEM.
            // I need to fetch the file list from the server side API or just hardcode the crucial ones?
            // No, that's brittle.

            // BETTER STRATEGY: 
            // The user wants the effect. The 500 error on the blob was bad.
            // I will implement a "Simple" sequence loader that tries 'frame_XXX.png' 
            // checking if I can rename them blindly using a script first?
            // Yes, I should rename them to frame_000.png ... frame_153.png in public to make this easy.

            // But I am in the component creation step. 
            // I will write the component assuming they are named 'frame_XXX.png'.
            // Then I will run a script to rename them in public/photos.

            const padIndex = i.toString().padStart(3, '0');
            img.src = `/photos/frame_${padIndex}.png`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    setIsLoaded(true);
                }
            };
            loadedImages[i] = img;
        }
        setImages(loadedImages);
    }, []);

    useEffect(() => {
        if (!isLoaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let iframe = 0;
        let animationId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const img = images[iframe];

            if (img) {
                // Draw image cover
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }

            iframe = (iframe + 1) % totalFrames;
            // Slow down animation?
            // setTimeout(() => { animationId = requestAnimationFrame(render); }, 60);
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, [isLoaded, images]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 opacity-60 mix-blend-screen pointer-events-none"
            width={1920}
            height={1080}
        />
    );
}
