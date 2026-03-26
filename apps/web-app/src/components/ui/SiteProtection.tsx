'use client';

import { useEffect } from 'react';

export default function SiteProtection() {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // 2. Prevent Common DevTools Shortcuts & Print
        // 2. Prevent Common DevTools Shortcuts & Print
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element), Ctrl+U (Source)
            if (
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 'p') // Print
            ) {
                e.preventDefault();
                return false;
            }
        };

        // 3. Prevent Dragging Images
        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault();
                return false;
            }
        };

        // Add Listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        // 4. Inject Globa Styles for Selection Prevention via JS to allow cleanup
        // We add a class to body
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none'; // Safari support
        // Allow selection in inputs/textareas
        const style = document.createElement('style');
        style.id = 'site-protection-styles';
        style.innerHTML = `
      input, textarea, [contenteditable="true"] {
        user-select: text !important;
        -webkit-user-select: text !important;
      }
    `;
        document.head.appendChild(style);

        return () => {
            // Cleanup
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);

            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            const styleEl = document.getElementById('site-protection-styles');
            if (styleEl) styleEl.remove();
        };
    }, []);

    return null; // Logic only component
}
