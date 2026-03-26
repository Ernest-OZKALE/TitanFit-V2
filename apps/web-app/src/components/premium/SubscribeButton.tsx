'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscribeButton({ className }: { className?: string }) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/checkout', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la session');
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            toast.error("Impossible de lancer le paiement.");
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={loading}
            className={`bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] text-black font-bold hover:shadow-[0_0_20px_#D4AF37] transition-all ${className}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Devenir Titan (9.99€/mois)
        </Button>
    );
}
