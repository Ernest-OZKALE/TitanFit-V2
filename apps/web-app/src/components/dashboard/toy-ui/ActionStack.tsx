'use client';

import { ReactNode } from 'react';

export function ActionStack({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col gap-4 px-4 pb-32 max-w-md mx-auto">
            {children}
        </div>
    );
}
