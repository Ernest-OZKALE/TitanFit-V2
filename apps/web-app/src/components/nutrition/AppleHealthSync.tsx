'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Smartphone, Check, Copy, ExternalLink, RefreshCw, Activity, ArrowRight, Layers, Search, PlusCircle, Play, Download, Footprints, Moon } from 'lucide-react';

export function AppleHealthSync() {
    const [userId, setUserId] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [guideStep, setGuideStep] = useState(0);
    const [healthData, setHealthData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let id = localStorage.getItem('titan_user_id');
        if (!id) {
            id = 'titan_' + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('titan_user_id', id);
        }
        setUserId(id);
        setApiUrl(typeof window !== 'undefined' ? `${window.location.origin}/api/health-sync` : '');

        const cached = localStorage.getItem('titan_health_data');
        if (cached) setHealthData(JSON.parse(cached));
    }, []);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copié dans le presse-papier !");
    };

    const checkSync = () => {
        setIsLoading(true);
        const cached = localStorage.getItem('titan_health_data');
        if (cached) setHealthData(JSON.parse(cached));
        setTimeout(() => setIsLoading(false), 800);
    };

    const GUIDE_STEPS = [
        {
            title: "Créer le Raccourci",
            desc: "Ouvrez l'app Raccourcis et appuyez sur le + en haut à droite.",
            action: { label: "Ouvrir Raccourcis", url: "shortcuts://" }
        },
        {
            title: "Ajouter l'action URL",
            desc: "Tapez 'Obtenir le contenu' dans la recherche.",
            subtext: "Sélectionnez l'action 'Obtenir le contenu de l'URL'.",
        },
        {
            title: "Configurer le lien",
            desc: "Collez votre lien serveur TitanFit dans le champ URL de l'action.",
            copyValue: apiUrl,
            copyLabel: "Copier le Lien Serveur"
        },
        {
            title: "Méthode POST",
            desc: "Cliquez sur la flèche bleue (>) à côté de l'URL. Changez la Méthode de GET à POST.",
        },
        {
            title: "Ajouter le corps",
            desc: "Dans 'Corps de la requête', choisissez 'JSON'. Ajoutez un nouveau champ texte nommé 'userId'.",
        },
        {
            title: "Coller votre ID",
            desc: "Collez votre ID unique dans le champ texte 'userId' que vous venez de créer.",
            copyValue: userId,
            copyLabel: "Copier mon ID Unique"
        }
    ];

    return (
        <div className="space-y-8 pb-40">
            {/* HEADER - REALITY CHECK */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-center relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <Activity className="w-3 h-3 text-[#FF4D00]" />
                        Solution Web Actuelle
                    </div>
                    <h2 className="text-3xl font-black italic mb-2">APPLE SANTÉ</h2>
                    <p className="text-white/60 max-w-sm mx-auto text-sm leading-relaxed">
                        Pour des raisons de sécurité, Apple bloque l'accès automatique sur le Web.
                        <br /><span className="text-white font-bold">Nous devons créer un "Pont" manuel.</span>
                    </p>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* THE VISUAL GUIDE */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="font-black text-slate-900 text-lg">GUIDE D'INSTALLATION</h3>
                    <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        Étape {guideStep + 1}/{GUIDE_STEPS.length}
                    </div>
                </div>

                {/* STEP CONTENT */}
                <div className="bg-slate-50 rounded-3xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={guideStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-xs"
                        >
                            {/* Icon / Image Placeholder */}
                            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 shadow-sm flex items-center justify-center text-slate-300">
                                {guideStep === 0 && <PlusCircle className="w-10 h-10 text-blue-500" />}
                                {guideStep === 1 && <Search className="w-10 h-10 text-slate-400" />}
                                {guideStep === 2 && <Layers className="w-10 h-10 text-[#FF4D00]" />}
                                {guideStep === 3 && <ArrowRight className="w-10 h-10 text-green-500" />}
                                {guideStep === 4 && <Layers className="w-10 h-10 text-purple-500" />}
                                {guideStep === 5 && <Smartphone className="w-10 h-10 text-amber-500" />}
                            </div>

                            <h4 className="text-xl font-black text-slate-900 mb-2">{GUIDE_STEPS[guideStep].title}</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-2">
                                {GUIDE_STEPS[guideStep].desc}
                            </p>
                            {GUIDE_STEPS[guideStep].subtext && (
                                <p className="text-xs text-slate-400 font-medium mb-4">{GUIDE_STEPS[guideStep].subtext}</p>
                            )}

                            {/* Actions Area */}
                            <div className="space-y-3 mt-6">
                                {GUIDE_STEPS[guideStep].action && (
                                    <a
                                        href={GUIDE_STEPS[guideStep].action?.url}
                                        className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {GUIDE_STEPS[guideStep].action?.label}
                                    </a>
                                )}

                                {GUIDE_STEPS[guideStep].copyValue && (
                                    <button
                                        onClick={() => copy(GUIDE_STEPS[guideStep].copyValue!)}
                                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {GUIDE_STEPS[guideStep].copyLabel}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* NAVIGATION */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setGuideStep(Math.max(0, guideStep - 1))}
                        disabled={guideStep === 0}
                        className="flex-1 py-4 rounded-xl font-bold text-slate-400 bg-slate-50 disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <button
                        onClick={() => {
                            if (guideStep < GUIDE_STEPS.length - 1) {
                                setGuideStep(guideStep + 1);
                            } else {
                                alert("Configuration terminée ! Lancez le raccourci pour tester.");
                                checkSync();
                            }
                        }}
                        className="flex-[2] py-4 rounded-xl font-bold text-white bg-[#FF4D00] shadow-lg shadow-orange-500/20"
                    >
                        {guideStep === GUIDE_STEPS.length - 1 ? "Terminer" : "Étape Suivante"}
                    </button>
                </div>
            </div>

            {/* NATIVE APP UPSELL */}
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white text-center shadow-2xl shadow-indigo-500/30">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                    <Download className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black italic mb-2">TROP COMPLIQUÉ ?</h3>
                <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
                    C'est normal. Ce bricolage est une limitation temporaire du Web.
                    <br /><br />
                    <strong>La version App Native arrive bientôt</strong> avec un bouton "Autoriser" 100% automatique.
                </p>
                <div className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    Version Alpha en cours
                </div>
            </div>

            {/* Data Display Placeholder */}
            {healthData && (
                <div className="grid grid-cols-2 gap-4">
                    <StatBadge label="Poids" value={`${healthData.weight || '--'} kg`} icon={Activity} />
                    <StatBadge label="Pas" value={healthData.steps?.toLocaleString() || '--'} icon={Footprints} />
                    <StatBadge label="Sommeil" value={`${healthData.sleepHours || '--'} h`} icon={Moon} />
                    <StatBadge label="Calories" value={`${healthData.activeEnergy || '--'} kcal`} icon={Activity} />
                </div>
            )}

            <div className="text-center">
                <button
                    onClick={checkSync}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Forcer la vérification
                </button>
            </div>
        </div>
    );
}

function StatBadge({ label, value, icon: Icon }: any) {
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                <Icon className="w-3 h-3" /> {label}
            </div>
            <div className="text-lg font-black text-slate-900">{value}</div>
        </div>
    );
}
