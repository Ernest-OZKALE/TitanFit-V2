'use client';

import React from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ShortcutSetupPage() {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier !");
    };

    const apiUrl = "https://titanfit.vercel.app/api/biometrics/sync"; // Replace with actual domain later

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 font-sans">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/settings/integrations" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#D4AF37]">TitanSync iOS</h1>
                        <p className="text-xs text-gray-400">Guide de configuration Apple Health</p>
                    </div>
                </div>

                {/* Step 1: Create Shortcut */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center">1</div>
                        <h2 className="font-bold">Créer le Raccourci</h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-300 space-y-2 border border-white/5">
                        <p>Ouvrez l'app <strong>Raccourcis</strong> sur votre iPhone et créez un nouveau raccourci nommé "TitanSync".</p>
                    </div>
                </section>

                {/* Step 2: Add Actions */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center">2</div>
                        <h2 className="font-bold">Ajouter les Actions</h2>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-xs uppercase text-gray-500 font-bold">Action 1</span>
                            <p className="font-medium text-blue-400">Obtenir tous les échantillons de santé</p>
                            <p className="text-xs text-gray-400 mt-1">Type: Variabilité de fréquence cardiaque (VRC)</p>
                        </div>

                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-xs uppercase text-gray-500 font-bold">Action 2</span>
                            <p className="font-medium text-green-400">Obtenir le contenu de l'URL</p>

                            <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-between bg-black/50 p-2 rounded text-xs">
                                    <span className="text-gray-400">URL:</span>
                                    <code className="text-[#D4AF37]">{apiUrl}</code>
                                    <button onClick={() => handleCopy(apiUrl)}><Copy className="w-3 h-3 text-white" /></button>
                                </div>
                                <div className="flex items-center justify-between bg-black/50 p-2 rounded text-xs">
                                    <span className="text-gray-400">Méthode:</span>
                                    <span className="text-white font-bold">POST</span>
                                </div>
                                <div className="p-2 bg-black/50 rounded text-xs space-y-1">
                                    <span className="text-gray-400 block">En-têtes (Headers):</span>
                                    <div className="pl-2 border-l border-gray-700">
                                        Content-Type: application/json
                                    </div>
                                </div>
                                <div className="p-2 bg-black/50 rounded text-xs space-y-1">
                                    <span className="text-gray-400 block">Corps de la demande (JSON):</span>
                                    <code className="block text-gray-300 break-all font-mono">
                                        {`{"userId": "YOUR_ID", "metrics": [{"type": "hrv", "value": "Health Sample Value"}]}`}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3: Automation */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center">3</div>
                        <h2 className="font-bold">Automatisation</h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-300 border border-white/5">
                        <p>Allez dans l'onglet <strong>Automatisation</strong>.</p>
                        <p className="mt-2">➔ Créer une automatisation perso</p>
                        <p>➔ Heure de la journée (ex: 08:00)</p>
                        <p>➔ Exécuter immédiatement</p>
                        <p>➔ Action: "Exécuter le raccourci TitanSync"</p>
                    </div>
                </section>

                <div className="pt-8 text-center">
                    <Link href="/dashboard" className="text-[#D4AF37] text-sm underline opacity-80 hover:opacity-100">
                        Retour au Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
