export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    rest: number; // seconds
    notes?: string;
}

export interface Workout {
    id: string;
    title: string;
    type: 'push' | 'pull' | 'legs' | 'fullbody' | 'cardio';
    duration: string;
    intensity: 'Moyenne' | 'Élevée' | 'Extrême';
    muscles: string[];
    exercises: Exercise[];
}

export const TITAN_PROGRAM: Workout[] = [
    {
        id: 'push-a',
        title: 'Push : Pecs & Triceps',
        type: 'push',
        duration: '65 min',
        intensity: 'Élevée',
        muscles: ['Pectoraux', 'Épaules', 'Triceps'],
        exercises: [
            { id: 'bp-flat', name: 'Développé Couché', sets: 4, reps: '6-8', rest: 120, notes: 'Contrôler la descente sur 3s.' },
            { id: 'ohp-db', name: 'Développé Militaire Haltères', sets: 3, reps: '8-10', rest: 90 },
            { id: 'dips', name: 'Dips Lestés', sets: 3, reps: '10-12', rest: 90, notes: 'Torse penché en avant.' },
            { id: 'fly-cable', name: 'Écartés Poulie Vis-à-vis', sets: 3, reps: '12-15', rest: 60 },
            { id: 'tricep-ext', name: 'Extensions Triceps Corde', sets: 4, reps: '12-15', rest: 60 }
        ]
    },
    {
        id: 'pull-a',
        title: 'Pull : Dos & Biceps',
        type: 'pull',
        duration: '70 min',
        intensity: 'Élevée',
        muscles: ['Dorsaux', 'Trapèzes', 'Biceps'],
        exercises: [
            { id: 'pullups', name: 'Tractions Lestées', sets: 4, reps: '6-8', rest: 120 },
            { id: 'row-bb', name: 'Rowing Barre', sets: 3, reps: '8-10', rest: 90 },
            { id: 'pulldown', name: 'Tirage Vertical', sets: 3, reps: '10-12', rest: 90 },
            { id: 'facepull', name: 'Face Pulls', sets: 3, reps: '15-20', rest: 60 },
            { id: 'curl-ez', name: 'Curl Barre EZ', sets: 4, reps: '10-12', rest: 60 }
        ]
    },
    {
        id: 'legs-a',
        title: 'Legs : Jambes & Mollets',
        type: 'legs',
        duration: '80 min',
        intensity: 'Extrême',
        muscles: ['Quadriceps', 'Ischios', 'Mollets'],
        exercises: [
            { id: 'squat', name: 'Squat Arrière', sets: 4, reps: '5-8', rest: 180 },
            { id: 'rdl', name: 'Soulevé de Terre Roumain', sets: 3, reps: '8-10', rest: 120 },
            { id: 'leg-press', name: 'Presse à Cuisses', sets: 3, reps: '12-15', rest: 90 },
            { id: 'leg-ext', name: 'Leg Extension', sets: 3, reps: '15-20', rest: 60, notes: 'Drop set sur la dernière série.' },
            { id: 'calves', name: 'Mollets Debout', sets: 5, reps: '15-20', rest: 45 }
        ]
    },
    // --- ARNOLD SPLIT (Old School) ---
    {
        id: 'arnold-a',
        title: 'Arnold : Pecs & Dos',
        type: 'push', // Mapping to generic type
        duration: '75 min',
        intensity: 'Extrême',
        muscles: ['Pectoraux', 'Dos', 'Abdos'],
        exercises: [
            { id: 'bp-flat', name: 'Développé Couché', sets: 5, reps: '8-10', rest: 90 },
            { id: 'pullups', name: 'Tractions Large', sets: 5, reps: 'Max', rest: 90 },
            { id: 'inc-db', name: 'Développé Incliné Haltères', sets: 4, reps: '10-12', rest: 60 },
            { id: 'row-bar', name: 'Rowing Barre T', sets: 4, reps: '10-12', rest: 60 },
            { id: 'pullover', name: 'Pullover Haltère', sets: 3, reps: '15', rest: 45 }
        ]
    },
    {
        id: 'arnold-b',
        title: 'Arnold : Épaules & Bras',
        type: 'push',
        duration: '70 min',
        intensity: 'Élevée',
        muscles: ['Épaules', 'Biceps', 'Triceps'],
        exercises: [
            { id: 'ohp', name: 'Développé Militaire', sets: 4, reps: '8-10', rest: 90 },
            { id: 'lat-raise', name: 'Élévations Latérales', sets: 4, reps: '12-15', rest: 45 },
            { id: 'curl-bar', name: 'Curl Barre', sets: 4, reps: '10', rest: 60 },
            { id: 'skullcrusher', name: 'Barre au Front', sets: 4, reps: '10', rest: 60 },
            { id: 'superset-arms', name: 'Superset Curl/Ext', sets: 3, reps: '15', rest: 45 }
        ]
    },
    // --- UPPER / LOWER (Athlétique) ---
    {
        id: 'ul-upper',
        title: 'Upper : Force & Hypertrophie',
        type: 'push',
        duration: '60 min',
        intensity: 'Moyenne',
        muscles: ['Pectoraux', 'Dos', 'Épaules'],
        exercises: [
            { id: 'bench', name: 'Développé Couché', sets: 3, reps: '5', rest: 180 },
            { id: 'row', name: 'Rowing Pendlay', sets: 3, reps: '5', rest: 180 },
            { id: 'ohp', name: 'Développé Militaire', sets: 3, reps: '8', rest: 120 },
            { id: 'pullup', name: 'Tractions', sets: 3, reps: '8', rest: 120 }
        ]
    },
    {
        id: 'ul-lower',
        title: 'Lower : Puissance Jambes',
        type: 'legs',
        duration: '60 min',
        intensity: 'Élevée',
        muscles: ['Quadriceps', 'Ischios', 'Mollets'],
        exercises: [
            { id: 'squat', name: 'Squat', sets: 3, reps: '5', rest: 180 },
            { id: 'deadlift', name: 'Soulevé de Terre', sets: 3, reps: '5', rest: 180 },
            { id: 'lunge', name: 'Fentes', sets: 3, reps: '10', rest: 90 },
            { id: 'calves', name: 'Mollets', sets: 4, reps: '15', rest: 60 }
        ]
    },
    // --- FULL BODY (Débutant / Busy) ---
    {
        id: 'fb-a',
        title: 'Full Body : Fondations',
        type: 'fullbody',
        duration: '45 min',
        intensity: 'Moyenne',
        muscles: ['Corps', 'Global'],
        exercises: [
            { id: 'goblet', name: 'Goblet Squat', sets: 3, reps: '12', rest: 60 },
            { id: 'pushup', name: 'Pompes', sets: 3, reps: 'Max', rest: 60 },
            { id: 'ring-row', name: 'Rowing Inversé', sets: 3, reps: '12', rest: 60 },
            { id: 'plank', name: 'Gainage', sets: 3, reps: '45s', rest: 45 }
        ]
    },
    // --- CARDIO / HIIT ---
    {
        id: 'hiit-burn',
        title: 'HIIT : Fat Burner',
        type: 'cardio',
        duration: '20 min',
        intensity: 'Extrême',
        muscles: ['Cardio', 'Endurance'],
        exercises: [
            { id: 'burpees', name: 'Burpees', sets: 10, reps: '30s', rest: 30, notes: '30s ON / 30s OFF' },
            { id: 'jumps', name: 'Squat Jumps', sets: 5, reps: '30s', rest: 30 },
            { id: 'climbers', name: 'Mountain Climbers', sets: 5, reps: '30s', rest: 30 }
        ]
    },
    // --- BRO SPLIT (Esthétique) ---
    {
        id: 'bro-chest',
        title: 'Bro Split : International Chest Day',
        type: 'push',
        duration: '60 min',
        intensity: 'Élevée',
        muscles: ['Pectoraux'],
        exercises: [
            { id: 'bp-flat', name: 'Développé Couché', sets: 4, reps: '8-10', rest: 120 },
            { id: 'bp-inc-db', name: 'Développé Incliné Haltères', sets: 4, reps: '10-12', rest: 90 },
            { id: 'fly-machine', name: 'Pec Deck', sets: 4, reps: '15', rest: 60 },
            { id: 'dips-bw', name: 'Dips', sets: 3, reps: 'Échec', rest: 90 }
        ]
    },
    {
        id: 'bro-back',
        title: 'Bro Split : Dos Large',
        type: 'pull',
        duration: '60 min',
        intensity: 'Élevée',
        muscles: ['Dorsaux', 'Trapèzes'],
        exercises: [
            { id: 'dl', name: 'Soulevé de Terre', sets: 3, reps: '5-8', rest: 180 },
            { id: 'pullups', name: 'Tractions', sets: 4, reps: '8-10', rest: 120 },
            { id: 'row-db', name: 'Rowing Haltère Unilatéral', sets: 4, reps: '12', rest: 90 },
            { id: 'pulldown', name: 'Tirage Poitrine', sets: 3, reps: '12-15', rest: 60 }
        ]
    },
    {
        id: 'bro-shoulders',
        title: 'Bro Split : Épaules 3D',
        type: 'push',
        duration: '50 min',
        intensity: 'Moyenne',
        muscles: ['Épaules'],
        exercises: [
            { id: 'ohp-bb', name: 'Développé Militaire', sets: 4, reps: '8-10', rest: 120 },
            { id: 'lat-raise', name: 'Élévations Latérales', sets: 5, reps: '15-20', rest: 60, notes: 'Contrôler la descente.' },
            { id: 'facepull', name: 'Face Pulls', sets: 4, reps: '15-20', rest: 60 },
            { id: 'shrugs', name: 'Shrugs', sets: 4, reps: '12-15', rest: 60 }
        ]
    },
    {
        id: 'bro-legs',
        title: 'Bro Split : Leg Day',
        type: 'legs',
        duration: '70 min',
        intensity: 'Extrême',
        muscles: ['Quadriceps', 'Ischios'],
        exercises: [
            { id: 'hack-squat', name: 'Hack Squat', sets: 4, reps: '10-12', rest: 120 },
            { id: 'leg-press', name: 'Presse à Cuisses', sets: 4, reps: '15', rest: 90 },
            { id: 'leg-ext', name: 'Leg Extension', sets: 3, reps: '20', rest: 60 },
            { id: 'leg-curl', name: 'Leg Curl Allongé', sets: 4, reps: '12-15', rest: 60 }
        ]
    },
    {
        id: 'bro-arms',
        title: 'Bro Split : Arms Day',
        type: 'fullbody', // Assigning fullbody type as fallback for pure arms
        duration: '45 min',
        intensity: 'Moyenne',
        muscles: ['Biceps', 'Triceps'],
        exercises: [
            { id: 'bb-curl', name: 'Curl Barre', sets: 4, reps: '10-12', rest: 90 },
            { id: 'skull', name: 'Barre au Front', sets: 4, reps: '10-12', rest: 90 },
            { id: 'spider', name: 'Spider Curl', sets: 3, reps: '15', rest: 60 },
            { id: 'pushdown', name: 'Extensions Poulie', sets: 3, reps: '15', rest: 60 }
        ]
    },
    // --- POWERLIFTING (Force) ---
    {
        id: 'power-squat',
        title: 'Power : Squat Focus',
        type: 'legs',
        duration: '90 min',
        intensity: 'Extrême',
        muscles: ['Jambes', 'Force'],
        exercises: [
            { id: 'comp-squat', name: 'Compétition Squat', sets: 5, reps: '3-5', rest: 300, notes: 'Focus total sur la technique.' },
            { id: 'pause-squat', name: 'Pause Squat', sets: 3, reps: '5', rest: 180 },
            { id: 'leg-acc', name: 'Leg Press', sets: 3, reps: '10', rest: 120 }
        ]
    },
    {
        id: 'power-bench',
        title: 'Power : Bench Focus',
        type: 'push',
        duration: '90 min',
        intensity: 'Élevée',
        muscles: ['Pectoraux', 'Force'],
        exercises: [
            { id: 'comp-bench', name: 'Compétition Bench', sets: 5, reps: '3-5', rest: 300 },
            { id: 'close-grip', name: 'Développé Prise Serrée', sets: 3, reps: '6-8', rest: 180 },
            { id: 'tricep-acc', name: 'Triceps Accessoire', sets: 4, reps: '12', rest: 90 }
        ]
    },
    {
        id: 'power-dead',
        title: 'Power : Deadlift Focus',
        type: 'pull',
        duration: '90 min',
        intensity: 'Extrême',
        muscles: ['Dos', 'Force'],
        exercises: [
            { id: 'comp-dl', name: 'Compétition Deadlift', sets: 5, reps: '3', rest: 300 },
            { id: 'rdl', name: 'Compétition RDL', sets: 3, reps: '6-8', rest: 180 },
            { id: 'back-acc', name: 'Rowing lourd', sets: 4, reps: '8', rest: 120 }
        ]
    }
];

export function getRecommendedWorkout(): Workout {
    // Logique réelle : Rotation Push -> Pull -> Legs basée sur le dernier workout fait
    if (typeof window === 'undefined') return TITAN_PROGRAM[0];

    const lastWorkoutId = localStorage.getItem('titan_last_workout_id');

    if (lastWorkoutId === 'push-a') return TITAN_PROGRAM[1]; // Après Push -> Pull
    if (lastWorkoutId === 'pull-a') return TITAN_PROGRAM[2]; // Après Pull -> Legs
    return TITAN_PROGRAM[0]; // Défaut ou Après Legs -> Push
}
