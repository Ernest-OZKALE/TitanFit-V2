export type MuscleZone = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core';

export interface MuscleInfo {
    id: string;
    zone: MuscleZone; // Parent zone for Zooming
    name: string;
    latinName: string;
    description: string;
    function: string; // Biomechanical function
    exercises: string[];
    color: string;
}

export const MUSCLE_DATA: Record<string, MuscleInfo> = {
    // --- CHEST ---
    'chest-upper': {
        id: 'chest-upper',
        zone: 'chest',
        name: 'Haut de Pect',
        latinName: 'Pectoralis Major (Clavicular)',
        description: "La partie supérieure visible sous la clavicule. Donne le volume 'rempli' au torse.",
        function: "Flexion et Adduction de l'épaule (vers le haut)",
        exercises: ["Développé Incliné (Haltères/Barre)", "Écarté Incliné", "Pompes pieds surélevés", "Low-to-High Cable Fly"],
        color: "#38bdf8"
    },
    'chest-mid': {
        id: 'chest-mid',
        zone: 'chest',
        name: 'Pect Moyen / Sternal',
        latinName: 'Pectoralis Major (Sternal)',
        description: "La masse principale du pectoral.",
        function: "Adduction horizontale puissante",
        exercises: ["Développé Couché", "Pompes Classiques", "Machine Chest Press", "Cable Fly"],
        color: "#0ea5e9"
    },
    'chest-lower': {
        id: 'chest-lower',
        zone: 'chest',
        name: 'Bas de Pect',
        latinName: 'Pectoralis Major (Costal)',
        description: "La ligne inférieure qui découpe le pectoral.",
        function: "Extension et Adduction de l'épaule (vers le bas)",
        exercises: ["Dips", "Développé Décliné", "High-to-Low Cable Fly", "Pompes mains surélevées"],
        color: "#0284c7"
    },
    'serratus': {
        id: 'serratus',
        zone: 'chest', // Often grouped with chest/core visual
        name: 'Dentelé Antérieur',
        latinName: 'Serratus Anterior',
        description: "Les 'griffes' sur les côtes, sous les pectoraux. Essentiel pour la stabilité de l'omoplate.",
        function: "Protraction de la scapula (Boxer's punch)",
        exercises: ["Pullover", "Scapular Pushups", "Ab Rollout", "Punching"],
        color: "#0369a1"
    },

    // --- SHOULDERS ---
    'delt-front': {
        id: 'delt-front',
        zone: 'shoulders',
        name: 'Deltoïde Avant',
        latinName: 'Deltoideus Anterior',
        description: "L'avant de l'épaule. Très sollicité dans tous les mouvements de poussée.",
        function: "Flexion de l'épaule",
        exercises: ["Développé Militaire", "Élévations Frontales", "Arnold Press"],
        color: "#f472b6"
    },
    'delt-side': {
        id: 'delt-side',
        zone: 'shoulders',
        name: 'Deltoïde Latéral',
        latinName: 'Deltoideus Lateralis',
        description: "La largeur d'épaule. Donne l'aspect 3D et la carrure.",
        function: "Abduction de l'épaule (lever le bras sur le côté)",
        exercises: ["Élévations Latérales (Haltères/Poulie)", "Upright Row (Prise large)", "Lu Raises"],
        color: "#db2777"
    },
    'delt-rear': {
        id: 'delt-rear',
        zone: 'shoulders',
        name: 'Deltoïde Arrière',
        latinName: 'Deltoideus Posterior',
        description: "L'arrière de l'épaule. Souvent négligé, crucial pour la posture et l'épaisseur.",
        function: "Extension horizontale et Rotation externe",
        exercises: ["Oiseau (Reverse Fly)", "Face Pull", "Reverse Pec Deck"],
        color: "#be185d"
    },
    'rotator-cuff': {
        id: 'rotator-cuff',
        zone: 'shoulders',
        name: 'Coiffe des Rotateurs',
        latinName: 'Infraspinatus / Teres Minor',
        description: "Stabilisateurs profonds de l'épaule.",
        function: "Rotation Externe",
        exercises: ["Face Pull", "External Rotation (Câble)", "Cuban Press"],
        color: "#9d174d"
    },

    // --- ARMS ---
    'biceps-long': {
        id: 'biceps-long',
        zone: 'arms',
        name: 'Biceps (Chef Long)',
        latinName: 'Biceps Brachii (Long Head)',
        description: "La partie externe du biceps. Responsable du 'pic' du biceps.",
        function: "Flexion du coude & Supination (bras en arrière du corps)",
        exercises: ["Curl Incliné", "Drag Curl", "Curl Dos à la poulie"],
        color: "#22d3ee"
    },
    'biceps-short': {
        id: 'biceps-short',
        zone: 'arms',
        name: 'Biceps (Chef Court)',
        latinName: 'Biceps Brachii (Short Head)',
        description: "La partie interne du biceps. Donne l'épaisseur et la densité.",
        function: "Flexion du coude & Supination (bras en avant)",
        exercises: ["Spider Curl", "Preacher Curl (Pupitre)", "Curl Barre debout", "Concentration Curl"],
        color: "#06b6d4"
    },
    'brachialis': {
        id: 'brachialis',
        zone: 'arms',
        name: 'Brachial',
        latinName: 'Brachialis',
        description: "Muscle profond situé sous le biceps. Pousse le biceps vers le haut pour plus de volume.",
        function: "Flexion pure du coude (indépendant de la rotation)",
        exercises: ["Curl Marteau (Hammer Curl)", "Curl Prise Inversée"],
        color: "#0891b2"
    },
    'triceps-long': {
        id: 'triceps-long',
        zone: 'arms',
        name: 'Triceps (Chef Long)',
        latinName: 'Triceps Brachii (Long Head)',
        description: "La partie massive à l'intérieur/arrière du bras. Le plus gros volume du bras.",
        function: "Extension du coude & Extension de l'épaule (bras au dessus de la tête)",
        exercises: ["Extension Nuque", "Skullcrusher (Barre Front)", "Pullover"],
        color: "#67e8f9"
    },
    'triceps-lateral': {
        id: 'triceps-lateral',
        zone: 'arms',
        name: 'Triceps (Chef Latéral)',
        latinName: 'Triceps Brachii (Lateral Head)',
        description: "Le fer à cheval visible sur le côté du triceps.",
        function: "Extension du coude (bras le long du corps)",
        exercises: ["Pushdown Câble (Corde/Barre)", "Kickback"],
        color: "#a5f3fc"
    },
    'forearms': {
        id: 'forearms',
        zone: 'arms',
        name: 'Avant-Bras',
        latinName: 'Brachioradialis / Flexors',
        description: "La poigne et l'esthétique distale.",
        function: "Flexion du poignet & Grip",
        exercises: ["Reverse Curl", "Wrist Curl", "Farmers Walk", "Suspension"],
        color: "#cffafe"
    },

    // --- LEGS ---
    'quad-rectus': {
        id: 'quad-rectus',
        zone: 'legs',
        name: 'Droit Fémoral',
        latinName: 'Rectus Femoris',
        description: "Le muscle central de la cuisse qui traverse la hanche.",
        function: "Extension du genou & Flexion de la hanche",
        exercises: ["Leg Extension", "Sissy Squat", "Squat"],
        color: "#fbbf24"
    },
    'quad-vastus': {
        id: 'quad-vastus',
        zone: 'legs',
        name: 'Vaste Externe / Interne',
        latinName: 'Vastus Lateralis / Medialis',
        description: "Le galbe extérieur et la 'goutte d'eau' au dessus du genou.",
        function: "Extension pure du genou",
        exercises: ["Squat (Pieds serrés/larges)", "Leg Press", "Hack Squat"],
        color: "#f59e0b"
    },
    'hamstrings': {
        id: 'hamstrings',
        zone: 'legs',
        name: 'Ischio-Jambiers',
        latinName: 'Biceps Femoris / Semitendinosus',
        description: "L'arrière de la cuisse.",
        function: "Flexion du genou & Extension de la hanche",
        exercises: ["Soulevé de Terre Roumain", "Leg Curl (Assis/Allongé)", "Glute Ham Raise"],
        color: "#d97706"
    },
    'glutes-max': {
        id: 'glutes-max',
        zone: 'legs',
        name: 'Grand Fessier',
        latinName: 'Gluteus Maximus',
        description: "Le muscle le plus puissant du corps.",
        function: "Extension de la hanche",
        exercises: ["Hip Thrust", "Squat Profond", "Fentes Arrières"],
        color: "#b45309"
    },
    'glutes-med': {
        id: 'glutes-med',
        zone: 'legs',
        name: 'Moyen Fessier',
        latinName: 'Gluteus Medius',
        description: "Le haut/côté de la fesse. Stabilisateur du bassin.",
        function: "Abduction de la hanche (écarter la jambe)",
        exercises: ["Abductions à la machine", "Fentes Latérales", "Clamshells"],
        color: "#92400e"
    },
    'calves': {
        id: 'calves',
        zone: 'legs',
        name: 'Mollets',
        latinName: 'Gastrocnemius / Soleus',
        description: "Le diamant (Gastro) et le volume profond (Soléaire).",
        function: "Extension de la cheville",
        exercises: ["Mollets Debout (Gastro)", "Mollets Assis (Soléaire)"],
        color: "#fcd34d"
    },

    // --- BACK ---
    'lats': {
        id: 'lats',
        zone: 'back',
        name: 'Grand Dorsal',
        latinName: 'Latissimus Dorsi',
        description: "Les ailes. Donne la largeur en V du dos.",
        function: "Adduction et Extension de l'épaule",
        exercises: ["Traction (Prise Large)", "Tirage Vertical", "Pullover", "Rowing Unilatéral"],
        color: "#818cf8"
    },
    'traps-upper': {
        id: 'traps-upper',
        zone: 'back',
        name: 'Trapèzes (Supérieur)',
        latinName: 'Trapezius (Upper)',
        description: "La silhouette puissante du cou.",
        function: "Élévation des scapulas (Haosser les épaules)",
        exercises: ["Shrugs (Barre/Haltères)", "Farmer Walk", "Oly Lifts"],
        color: "#6366f1"
    },
    'traps-mid-lower': {
        id: 'traps-mid-lower',
        zone: 'back',
        name: 'Trapèzes (Moyen/Inf)',
        latinName: 'Trapezius (Mid/Lower)',
        description: "L'épaisseur du centre du dos. Crucial pour la posture.",
        function: "Rétraction et Dépression des scapulas",
        exercises: ["Rowing Coudes Ouverts", "Face Pulls", "Y-Raises"],
        color: "#4f46e5"
    },
    'erectors': {
        id: 'erectors',
        zone: 'back',
        name: 'Lombaires',
        latinName: 'Erector Spinae',
        description: "Les colonnes qui soutiennent la colonne vertébrale ('Sapin de Noël').",
        function: "Extension du dos",
        exercises: ["Soulevé de Terre", "Extension Banc à Lombaires", "Good Morning"],
        color: "#4338ca"
    },

    // --- CORE ---
    'abs-rectus': {
        id: 'abs-rectus',
        zone: 'core',
        name: 'Grands Droits',
        latinName: 'Rectus Abdominis',
        description: "La tablette de chocolat (6-pack).",
        function: "Flexion du tronc",
        exercises: ["Crunch Câble", "Relevé de Jambes (Suspendu)", "Sit-up"],
        color: "#34d399"
    },
    'obliques': {
        id: 'obliques',
        zone: 'core',
        name: 'Obliques',
        latinName: 'Obliquus Externus',
        description: "Les côtés de la ceinture abdominale.",
        function: "Rotation et Flexion latérale",
        exercises: ["Russian Twist", "Woodchopper", "Side Plank", "Bicycle Crunch"],
        color: "#10b981"
    }
};

export type MuscleId = keyof typeof MUSCLE_DATA;
