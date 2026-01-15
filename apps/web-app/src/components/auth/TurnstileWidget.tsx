"use client";

import { useEffect, useRef, useState } from "react";

// For now, this is a placeholder/simulation if no site key is provided.
// In production, user must add NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

interface TurnstileProps {
    onVerify: (token: string) => void;
}

export function TurnstileWidget({ onVerify }: TurnstileProps) {
    const [token, setToken] = useState<string | null>(null);
    const containerRef = useRef<any>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        // Simulator for development or if script hasn't loaded
        if (!process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY) {
            console.warn("Turnstile Site Key missing. Simulating success.");
            setTimeout(() => {
                const mockToken = "mock_turnstile_token_" + Date.now();
                setToken(mockToken);
                onVerify(mockToken);
            }, 1000);
            return;
        }

        // Real Turnstile Logic (requires script in layout - handled via next/script usually)
        // Here we just render a placeholder for the integration manual
    }, [onVerify]);

    return (
        <div className="my-4 flex justify-center">
            {token ? (
                <div className="text-green-500 text-sm flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-md border border-green-500/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Sécurité vérifiée
                </div>
            ) : (
                <div ref={containerRef} className="text-slate-500 text-xs animate-pulse">
                    Vérification de sécurité...
                </div>
            )}
        </div>
    );
}
