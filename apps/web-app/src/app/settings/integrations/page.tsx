'use client';

import React from 'react';
import DeviceManager from '@/components/bio/DeviceManager';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#D4AF37]">Bio-Connexions</h1>
                        <p className="text-sm text-gray-400">Gérez vos sources de données biométriques</p>
                    </div>
                </div>

                {/* Main Hub */}
                <DeviceManager />

                {/* Help Section */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-400 mb-2">Comment ça marche ?</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                        <li>
                            <strong className="text-white">Apple Health :</strong> Nécessite l'installation du Raccourci iOS TitanFit (car les navigateurs web n'ont pas accès direct à Apple Health).
                        </li>
                        <li>
                            <strong className="text-white">Oura / Whoop :</strong> Connexion directe via Cloud API (Redirection sécurisée).
                        </li>
                        <li>
                            <strong className="text-white">Confidentialité :</strong> Vos données sont chiffrées et utilisées uniquement pour calculer votre "Energy Bank".
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
