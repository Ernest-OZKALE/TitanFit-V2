import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    Sun, Moon, Coffee, Dumbbell, Utensils,
    Zap, Search, ScanLine, Camera, BarChart3,
    Settings, HelpCircle, ArrowRight,
    Timer, DollarSign, Sparkles
} from 'lucide-react';

export type AgentAction = {
    label: string;
    icon: any;
    onClick: () => void;
    highlight?: boolean;
};

export type AgentContext = {
    mode: 'morning' | 'day' | 'evening' | 'night';
    message: string;
    mood: 'happy' | 'neutral' | 'focused' | 'sleepy';
    actions: AgentAction[];
};

const TIPS = [
    "La protéine est la brique de tes muscles. Vise 1.6g à 2g par kilo de poids de corps.",
    "L'hydratation booste tes performances de 10%. Garde ta gourde Titan à portée.",
    "Le sommeil, c'est là que la magie opère. Vise 7-8h pour une récupération optimale.",
    "Une série de plus, c'est une brique de plus pour ton futur toi.",
    "Le sucre raffiné ralentit ta progression. Privilégie les glucides complexes.",
    "La créatine est l'un des suppléments les plus sûrs et efficaces pour la force.",
    "La constance bat l'intensité à plate couture sur le long terme.",
    "Respire profondément pendant tes séries. L'oxygène est ton carburant.",
    "Le magnésium peut aider à réduire les courbatures et améliorer ton sommeil.",
    "Vise 30g de fibres par jour pour une digestion de Titan.",
    "Échauffe tes articulations avant de charger lourd. La sécurité d'abord.",
    "Ton poids fluctue chaque jour. Regarde la tendance sur 7 jours.",
    "Manger lentement permet d'écouter tes signaux de satiété.",
    "L'entraînement, c'est le signal. La nutrition, c'est le matériel.",
    "Une mauvaise séance vaut mieux que pas de séance du tout.",
    "Tes abdominaux se révèlent dans la cuisine, mais se construisent à la salle.",
    "Le stress augmente le cortisol, ce qui peut freiner ta perte de gras.",
    "Le cardio n'est pas ton ennemi, c'est l'allié de ton cœur.",
    "Assure-toi d'avoir une technique parfaite avant d'augmenter la charge.",
    "Célèbre tes petites victoires. Chaque kilo de plus compte.",
];

export function useAgentBrain() {
    const pathname = usePathname();
    const [context, setContext] = useState<AgentContext>({
        mode: 'day',
        message: "Je m'initialise...",
        mood: 'neutral',
        actions: []
    });

    useEffect(() => {
        // 1. Analyze Time
        const hour = new Date().getHours();
        let timeMode: AgentContext['mode'] = 'day';
        if (hour >= 5 && hour < 11) timeMode = 'morning';
        else if (hour >= 11 && hour < 18) timeMode = 'day';
        else if (hour >= 18 && hour < 23) timeMode = 'evening';
        else timeMode = 'night';

        // 2. Determine Message & Actions
        let message = "";
        let actions: AgentAction[] = [];

        const triggerEvent = (name: string) => {
            window.dispatchEvent(new CustomEvent(name));
        };

        // --- CONTEXTUAL LOGIC
        if (pathname === '/dashboard') {
            if (timeMode === 'morning') {
                message = "Bon réveil, Chef ! Le monde appartient à ceux qui se lèvent tôt. On valide le plan ?";
                actions = [
                    { label: "☀️ Lancer ma Routine", icon: Sun, onClick: () => window.location.href = '/dashboard/morning-checkin', highlight: true },
                    { label: "☕ Voir ma Nutrition", icon: Coffee, onClick: () => window.location.href = '/log-meal' }
                ];
            } else if (timeMode === 'evening') {
                message = "Grosse journée ? C'est le moment de préparer celle de demain pour dormir serein.";
                actions = [
                    { label: "🌙 Bilan du Soir", icon: Moon, onClick: () => triggerEvent('titan:open-evening-checkin') },
                    { label: "🔋 État de Batterie", icon: Zap, onClick: () => triggerEvent('titan:open-battery-stats') }
                ];
            } else {
                message = "Tout est calme. Tes stats sont à jour. Une séance prévue ?";
                actions = [
                    { label: "🔥 Lancer un Workout", icon: Dumbbell, onClick: () => window.location.href = '/log-workout', highlight: true },
                    { label: "🍎 Noter un Repas", icon: Utensils, onClick: () => window.location.href = '/log-meal' }
                ];
            }

        } else if (pathname === '/log-meal') {
            const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
            message = `Besoin d'aide pour tes macros ? ${randomTip}`;
            actions = [
                { label: "📸 Scanner / Photo", icon: Camera, onClick: () => triggerEvent('titan:open-scanner'), highlight: true },
                { label: "🔍 Recherche Rapide", icon: Search, onClick: () => triggerEvent('titan:focus-search') },
                { label: "🧑‍🍳 Générer Recette", icon: Sparkles, onClick: () => triggerEvent('titan:open-fridge') }
            ];

        } else if (pathname === '/log-workout') {
            message = "Note chaque rep avec précision. La surcharge progressive est ta meilleure amie.";
            actions = [
                { label: "⏱️ Chrono Repos", icon: Timer, onClick: () => triggerEvent('titan:toggle-timer') },
                { label: "📚 Historique", icon: BarChart3, onClick: () => triggerEvent('titan:show-history') }
            ];

        } else {
            const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
            message = randomTip;
            actions = [
                { label: "Explorer le Dashboard", icon: BarChart3, onClick: () => window.location.href = '/dashboard', highlight: true },
                { label: "Mon Profil", icon: Settings, onClick: () => window.location.href = '/settings' }
            ];
        }

        setContext({
            mode: timeMode,
            message,
            mood: 'happy',
            actions
        });

    }, [pathname]);

    return context;
}
