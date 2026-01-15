
export interface ProgramCategoryDetail {
    id: string;
    title: string;
    description: string;
    target: string;
    pros: string[];
    cons: string[];
    iconColor: string;
}

export const PROGRAM_DETAILS: Record<string, ProgramCategoryDetail> = {
    'ppl': {
        id: 'ppl',
        title: 'Hypertrophie (PPL)',
        description: "Le Push Pull Legs divise le corps par 'mouvement'. Push (Poussée) entraîne les Pecs/Épaules/Triceps, Pull (Tirage) le Dos/Biceps, et Legs les Jambes.",
        target: "Intermédiaire à Avancé (3 à 6 séances/semaine)",
        pros: [
            "Récupération optimale (pas de chevauchement musculaire)",
            "Volume d'entraînement élevé par muscle",
            "Flexibilité (3, 6 jours ou rotatif)"
        ],
        cons: [
            "Demande une haute fréquence pour être optimal (ideally 6j/7)",
            "Séances parfois longues si volume élevé"
        ],
        iconColor: "text-[#D4AF37]"
    },
    'arnold': {
        id: 'arnold',
        title: 'Old School (Arnold Split)',
        description: "Popularisé par Arnold Schwarzenegger. Associe muscles agonistes/antagonistes (Pecs + Dos) pour un pump massif.",
        target: "Avancé & Passionnés de Bodybuilding",
        pros: [
            "Congestion (Pump) extrême grâce aux supersets",
            "Focus bras/épaules supérieur au PPL",
            "Gain de temps potentiel (densité élevée)"
        ],
        cons: [
            "Fatigue systémique très élevée",
            "Difficile à gérer pour un débutant",
            "Risque de surentraînement des épaules"
        ],
        iconColor: "text-red-500"
    },
    'upper_lower': {
        id: 'ul',
        title: 'Athlétique (Upper/Lower)',
        description: "Sépare le corps en deux : Haut (Upper) et Bas (Lower). Idéal pour développer la force et l'explosivité.",
        target: "Débutant à Avancé (4 séances/semaine)",
        pros: [
            "Fréquence idéale (chaque muscle travaillé 2x/semaine)",
            "Equilibre parfait entre force et récupération",
            "Planification simple sur 4 jours"
        ],
        cons: [
            "Moins de focus sur les petits muscles (bras/isolations)",
            "Séances Jambes très éprouvantes"
        ],
        iconColor: "text-blue-500"
    },
    'bro_split': {
        id: 'bro',
        title: 'Bro Split (Bodybuilding)',
        description: "L'approche classique : un muscle par jour. Permet de 'marteler' chaque groupe musculaire avec un volume maximal sous tous les angles.",
        target: "Intermédiaire (5 séances/semaine)",
        pros: [
            "Focus maximal sur chaque muscle (détails & congestion)",
            "Séances très agréables (gros Pump)",
            "Récupération localisée longue (1 semaine)"
        ],
        cons: [
            "Fréquence faible (muscle entraîné 1x/semaine)",
            "Moins efficace pour l'apprentissage moteur (débutants)",
            "Nécessite 5 jours fixes"
        ],
        iconColor: "text-purple-500"
    },
    'powerlifting': {
        id: 'power',
        title: 'Powerlifting (Force Pure)',
        description: "Focus absolu sur les 3 mouvements de compétition (SBD : Squat, Bench, Deadlift). L'objectif est de soulever lourd, pas la congestion.",
        target: "Avancé & Force (3-4 séances/semaine)",
        pros: [
            "Gains de force spectaculaires",
            "Mesure objective du progrès (Poids sur la barre)",
            "Maîtrise technique absolue"
        ],
        cons: [
            "Peu d'hypertrophie (masse musculaire)",
            "Temps de repos très longs (séances longues)",
            "Risque de blessure si technique dégradée"
        ],
        iconColor: "text-slate-900"
    },
    'full_body': {
        id: 'fb',
        title: 'Full Body (Fondations)',
        description: "Entraînement du corps entier à chaque séance.",
        target: "Débutants ou Emploi du temps chargé (2-3 séances/semaine)",
        pros: [
            "Fréquence maximale pour l'apprentissage moteur",
            "Idéal si on rate une séance (pas de déséquilibre)"
        ],
        cons: [
            "Volume par muscle limité par séance",
            "Fatigue systémique potentielle"
        ],
        iconColor: "text-green-500"
    },
    'cardio': {
        id: 'cardio',
        title: 'Cardio / HIIT',
        description: "Séances courtes et intenses pour brûler des calories et améliorer le système cardio-vasculaire.",
        target: "Perte de gras & Condition Physique",
        pros: [
            "Forte dépense calorique en peu de temps",
            "Améliore l'endurance et le souffle"
        ],
        cons: [
            "Ne construit pas de muscle",
            "Éprouvant pour le système nerveux"
        ],
        iconColor: "text-orange-500"
    }
};
