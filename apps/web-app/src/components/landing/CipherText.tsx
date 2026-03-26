'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CHARS = "-_~=\\/[]{}^!&*%#@$";

export default function CipherText({ text, className }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const ref = useRef<any>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!isInView || finished) return;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                setFinished(true);
                clearInterval(interval);
            }

            iteration += 1 / 2; // Speed of reveal
        }, 30);

        return () => clearInterval(interval);
    }, [isInView, text, finished]);

    return (
        <span ref={ref} className={className}>
            {displayText}
        </span>
    );
}
