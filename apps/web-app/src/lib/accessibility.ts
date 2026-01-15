/**
 * Accessibility Utilities for TitanFit V2
 * WCAG 2.1 Compliance Helpers
 */

// ============================================
// FOCUS MANAGEMENT
// ============================================

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
        element.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Move focus to element and announce
 */
export function moveFocus(element: HTMLElement, announce?: string) {
    element.setAttribute('tabindex', '-1');
    element.focus();

    if (announce) {
        announceToScreenReader(announce);
    }
}

// ============================================
// SCREEN READER ANNOUNCEMENTS
// ============================================

let liveRegion: HTMLElement | null = null;

function getLiveRegion(): HTMLElement {
    if (liveRegion) return liveRegion;

    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(liveRegion);

    return liveRegion;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = getLiveRegion();
    region.setAttribute('aria-live', priority);
    region.textContent = '';

    // Use setTimeout to ensure the DOM updates are picked up
    setTimeout(() => {
        region.textContent = message;
    }, 100);
}

// ============================================
// REDUCED MOTION SUPPORT
// ============================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preference
 */
export function getAnimationDuration(normalDuration: number): number {
    return prefersReducedMotion() ? 0 : normalDuration;
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Handle arrow key navigation in lists
 */
export function handleArrowNavigation(
    e: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onNavigate: (index: number) => void
) {
    let newIndex = currentIndex;

    switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            e.preventDefault();
            newIndex = (currentIndex + 1) % totalItems;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            e.preventDefault();
            newIndex = (currentIndex - 1 + totalItems) % totalItems;
            break;
        case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
        case 'End':
            e.preventDefault();
            newIndex = totalItems - 1;
            break;
        default:
            return;
    }

    onNavigate(newIndex);
}

// ============================================
// HIGH CONTRAST MODE
// ============================================

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: more)').matches;
}

// ============================================
// FORM ACCESSIBILITY
// ============================================

/**
 * Generate unique ID for form elements
 */
let idCounter = 0;
export function generateId(prefix: string = 'tf'): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Create accessible error message
 */
export function createErrorMessage(inputId: string, message: string): {
    id: string;
    'aria-describedby': string;
} {
    const errorId = `${inputId}-error`;
    return {
        id: errorId,
        'aria-describedby': errorId,
    };
}

// ============================================
// SKIP LINKS COMPONENT
// ============================================

export const SKIP_LINKS = [
    { href: '#main-content', label: 'Aller au contenu principal' },
    { href: '#main-navigation', label: 'Aller à la navigation' },
    { href: '#footer', label: 'Aller au pied de page' },
];

// ============================================
// A11Y HOOK DATA
// ============================================

export const a11y = {
    trapFocus,
    moveFocus,
    announceToScreenReader,
    prefersReducedMotion,
    getAnimationDuration,
    handleArrowNavigation,
    prefersHighContrast,
    generateId,
    createErrorMessage,
    SKIP_LINKS,
};
