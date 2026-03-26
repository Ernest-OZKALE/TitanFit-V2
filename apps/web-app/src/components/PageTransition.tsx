'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { variants, transitions } from '@/lib/animation-utils';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={transitions.premium}
            className="h-full w-full"
        >
            {children}
        </motion.div>
    );
}
