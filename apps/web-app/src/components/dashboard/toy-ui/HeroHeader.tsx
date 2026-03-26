'use client';

import { motion } from 'framer-motion';

interface HeroHeaderProps {
    userName: string;
    message: string;
    mood?: 'happy' | 'neutral' | 'sleepy' | 'fire';
}

export function HeroHeader({ userName, message, mood = 'happy' }: HeroHeaderProps) {
    const emojis = {
        happy: '🦁',
        neutral: '🐵',
        sleepy: '🐨',
        fire: '🐲'
    };

    return (
        <div className="px-4 py-8 flex items-center gap-4">
            {/* Avatar Circle */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-4xl border-4 border-black shadow-xl"
            >
                {emojis[mood]}
            </motion.div>

            {/* Speech Bubble */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-zinc-800 px-6 py-4 rounded-3xl rounded-tl-none border border-white/10"
            >
                <h2 className="text-white font-black text-lg">Hello {userName} !</h2>
                <p className="text-zinc-400 font-medium leading-tight">{message}</p>
            </motion.div>
        </div>
    );
}
