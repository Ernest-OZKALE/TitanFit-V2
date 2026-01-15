'use client';

import Link from 'next/link';

/**
 * Skip Links Component for Accessibility
 * Allows keyboard users to skip to main content
 */
export function SkipLinks() {
    const links = [
        { href: '#main-content', label: 'Aller au contenu principal' },
        { href: '#main-navigation', label: 'Aller à la navigation' },
    ];

    return (
        <nav aria-label="Liens d'accès rapide" className="skip-links">
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="skip-link"
                >
                    {link.label}
                </a>
            ))}
            <style jsx>{`
                .skip-links {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9999;
                }
                .skip-link {
                    position: absolute;
                    left: -9999px;
                    top: 0;
                    padding: 12px 16px;
                    background: #D4AF37;
                    color: #000;
                    font-weight: 700;
                    text-decoration: none;
                    border-radius: 0 0 8px 0;
                    transition: left 0.2s;
                }
                .skip-link:focus {
                    left: 0;
                    outline: 3px solid #fff;
                    outline-offset: 2px;
                }
            `}</style>
        </nav>
    );
}

export default SkipLinks;
