'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorStateProps {
    title?: string;
    message?: string;
    code?: string | number;
    onRetry?: () => void;
    showHomeButton?: boolean;
    showBackButton?: boolean;
}

/**
 * Reusable Error State Component
 * Premium design with action buttons
 */
export function ErrorState({
    title = "Une erreur s'est produite",
    message = "Nous n'avons pas pu charger cette page. Veuillez réessayer.",
    code,
    onRetry,
    showHomeButton = true,
    showBackButton = false,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {code && (
                <span className="text-6xl font-black text-red-500/30 mb-4">
                    {code}
                </span>
            )}

            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-8 max-w-md">{message}</p>

            <div className="flex gap-3">
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        className="bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réessayer
                    </Button>
                )}

                {showBackButton && (
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="border-white/20 hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                )}

                {showHomeButton && (
                    <Link href="/dashboard">
                        <Button variant="outline" className="border-white/20 hover:bg-white/10">
                            <Home className="w-4 h-4 mr-2" />
                            Accueil
                        </Button>
                    </Link>
                )}
            </div>
        </motion.div>
    );
}

// ============================================
// PRESET ERROR STATES
// ============================================

export function NotFoundError() {
    return (
        <ErrorState
            title="Page introuvable"
            message="La page que vous recherchez n'existe pas ou a été déplacée."
            code={404}
            showBackButton
        />
    );
}

export function ForbiddenError() {
    return (
        <ErrorState
            title="Accès refusé"
            message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
            code={403}
            showBackButton
        />
    );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorState
            title="Erreur serveur"
            message="Nos serveurs rencontrent un problème. Veuillez réessayer dans quelques instants."
            code={500}
            onRetry={onRetry}
        />
    );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorState
            title="Connexion perdue"
            message="Vérifiez votre connexion internet et réessayez."
            onRetry={onRetry}
        />
    );
}

export function EmptyState({
    icon: Icon,
    title,
    message,
    action,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    message: string;
    action?: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
        >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-gray-500" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6 max-w-sm">{message}</p>

            {action}
        </motion.div>
    );
}

export default ErrorState;
