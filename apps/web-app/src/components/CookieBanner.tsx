'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage
        const consented = localStorage.getItem('titanfit_cookie_consent');
        if (!consented) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('titanfit_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="max-w-4xl mx-auto bg-[#0F0F0F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-white font-bold mb-1">Nous respectons votre vie privée 🍪</h3>
                    <p className="text-sm text-gray-400">
                        Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de TitanFit
                        et améliorer votre expérience. En continuant, vous acceptez notre politique.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setIsVisible(false)} className="text-gray-400 border-white/10 hover:bg-white/5">
                        Fermer
                    </Button>
                    <Button size="sm" onClick={acceptCookies} className="bg-[#D4AF37] hover:bg-[#b0912d] text-black font-bold">
                        Accepter
                    </Button>
                </div>
            </div>
        </div>
    );
}
