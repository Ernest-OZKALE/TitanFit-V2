'use client';

// Haptic feedback utility for "Native Feel"
// Bevel uses haptics on selection, success, and error.

export const vibrate = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    switch (pattern) {
        case 'light':
            navigator.vibrate(10); // Subtle tick
            break;
        case 'medium':
            navigator.vibrate(40);
            break;
        case 'heavy':
            navigator.vibrate(70);
            break;
        case 'success':
            navigator.vibrate([10, 30, 10]); // Da-da-da
            break;
        case 'error':
            navigator.vibrate([50, 30, 50, 30, 50]); // Buzz-Buzz-Buzz
            break;
    }
};
