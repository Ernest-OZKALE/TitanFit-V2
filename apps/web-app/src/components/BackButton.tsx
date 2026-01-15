'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function BackButton({
    label = "Retour",
    destination
}: {
    label?: string;
    destination?: string;
}) {
    const router = useRouter();

    const handleBack = () => {
        if (destination) {
            router.push(destination);
        } else {
            router.back();
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                onClick={handleBack}
                className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 hover:bg-white/50 transition-all rounded-full pl-2 pr-4"
            >
                <div className="p-1 rounded-full bg-white group-hover:bg-purple-100 transition-colors shadow-sm">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm hidden sm:inline">{label}</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="group text-gray-600 hover:text-purple-600 hover:bg-white/50 transition-all rounded-full"
                title="Retour à l'accueil"
            >
                <Home className="h-4 w-4" />
            </Button>
        </div>
    );
}
