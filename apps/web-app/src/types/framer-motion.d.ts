import { HTMLAttributes } from 'react';

declare module 'framer-motion' {
    export interface MotionProps extends HTMLAttributes<HTMLElement> {
        className?: string;
        onClick?: () => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    }
}
