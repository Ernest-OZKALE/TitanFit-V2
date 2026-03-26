export type MuscleGroup = 'Pectoraux' | 'Dos' | 'Jambes' | 'Épaules' | 'Bras' | 'Abdos' | 'Cardio';
export type Equipment = 'Barre' | 'Haltères' | 'Machine' | 'Poids du corps' | 'Câbles' | 'Kettlebell' | 'Élastique' | 'Aucun';
export type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';
export type Mechanic = 'Composé' | 'Isolation';
export type Force = 'Pousser' | 'Tirer' | 'Statique';

// Detailed targets for anatomical precision
export type SubTarget =
    | 'Global'
    | 'Faisceau Claviculaire (Haut)' | 'Faisceau Sternal (Milieu)' | 'Faisceau Abdominal (Bas)' // Pecs
    | 'Grand Dorsal' | 'Trapèzes' | 'Rhomboides' | 'Lombaires' // Dos
    | 'Quadriceps' | 'Ischios' | 'Fessiers' | 'Mollets' | 'Adducteurs' | 'Abducteurs' // Jambes
    | 'Deltoïde Antérieur' | 'Deltoïde Latéral' | 'Deltoïde Postérieur' // Épaules
    | 'Biceps (Longue Portion)' | 'Biceps (Courte Portion)' | 'Brachial' | 'Triceps (Longue Portion)' | 'Triceps (Vaste Externe)' | 'Avant-bras' // Bras
    | 'Grand Droit' | 'Obliques' | 'Transverse'; // Abdos

export interface ExerciseDef {
    id: string;
    name: string;
    muscle: MuscleGroup;
    subTarget: SubTarget;
    equipment: Equipment;
    difficulty: Difficulty;
    mechanic: Mechanic;
    force: Force;
    instructions: string;
    gifUrl?: string;
    alternatives?: { type: 'gym' | 'home', id: string }[];
}

export const EXERCISE_DB: ExerciseDef[] = [
    // --- PECTORAUX ---
    {
        id: 'chest_bench_bar', name: 'Développé Couché Barre', muscle: 'Pectoraux', subTarget: 'Faisceau Sternal (Milieu)',
        equipment: 'Barre', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Allongez-vous, pieds ancrés. Descendez la barre contrôlée jusqu\'au milieu des pecs. Poussez explosif.',
        gifUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Press/0.jpg', // Placeholder fallback
        alternatives: [{ type: 'home', id: 'chest_pushups' }]
    },
    {
        id: 'chest_inc_db', name: 'Développé Incliné Haltères', muscle: 'Pectoraux', subTarget: 'Faisceau Claviculaire (Haut)',
        equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Banc à 30°. Gardez les coudes à 45°. Cible le haut des pectoraux.'
    },
    {
        id: 'chest_dips_weighted', name: 'Dips Lestés', muscle: 'Pectoraux', subTarget: 'Faisceau Abdominal (Bas)',
        equipment: 'Poids du corps', difficulty: 'Avancé', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Penchez le buste en avant pour engager les pectoraux. Descendez jusqu\'à la parallèle.'
    },
    {
        id: 'chest_fly_high', name: 'Écartés Vis-à-vis (Poulie Haute)', muscle: 'Pectoraux', subTarget: 'Faisceau Abdominal (Bas)',
        equipment: 'Câbles', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Tirez les poignées vers le bas et l\'intérieur. Contractez fort en bas.'
    },

    // --- DOS ---
    {
        id: 'back_pullup_wide', name: 'Tractions Large', muscle: 'Dos', subTarget: 'Grand Dorsal',
        equipment: 'Poids du corps', difficulty: 'Avancé', mechanic: 'Composé', force: 'Tirer',
        instructions: 'Prise large. Tirez les coudes vers les hanches. Le menton au-dessus de la barre.'
    },
    {
        id: 'back_row_tbar', name: 'T-Bar Row', muscle: 'Dos', subTarget: 'Rhomboides',
        equipment: 'Machine', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Tirer',
        instructions: 'Gardez le dos droit. Tirez la charge vers le ventre. Grosse épaisseur du dos.'
    },
    {
        id: 'back_pullover_cable', name: 'Pull-Over Poulie Haute', muscle: 'Dos', subTarget: 'Grand Dorsal',
        equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer',
        instructions: 'Bras tendus. Amenez la barre des yeux jusqu\'aux hanches en gardant les bras fixes.'
    },

    // --- BRAS (Triceps/Biceps Detailed) ---
    {
        id: 'tri_pushdown_rope', name: 'Triceps Pushdown (Corde)', muscle: 'Bras', subTarget: 'Triceps (Vaste Externe)',
        equipment: 'Câbles', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Écartez la corde en bas du mouvement pour une contraction maximale.'
    },
    {
        id: 'tri_overhead_cable', name: 'Extension Triceps Overhead', muscle: 'Bras', subTarget: 'Triceps (Longue Portion)',
        equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Bras au-dessus de la tête. Étire la longue portion du triceps pour plus de volume.'
    },
    {
        id: 'bi_curl_inc', name: 'Curl Incliné', muscle: 'Bras', subTarget: 'Biceps (Longue Portion)',
        equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer',
        instructions: 'Assis sur banc incliné. Laissez les bras pendre derrière le corps pour étirer le biceps.'
    },
    {
        id: 'bi_spider_curl', name: 'Spider Curl', muscle: 'Bras', subTarget: 'Biceps (Courte Portion)',
        equipment: 'Barre', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer',
        instructions: 'Ventre contre le banc. Isole le pic du biceps en éliminant l\'élan.'
    },
    {
        id: 'bi_hammer', name: 'Curl Marteau', muscle: 'Bras', subTarget: 'Brachial',
        equipment: 'Haltères', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Tirer',
        instructions: 'Prise neutre. Cible le muscle brachial pour élargir le bras de face.'
    },

    // --- JAMBES (Detailed) ---
    {
        id: 'legs_hack_squat', name: 'Hack Squat', muscle: 'Jambes', subTarget: 'Quadriceps',
        equipment: 'Machine', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Pieds bas sur la plateforme pour cibler les quads. Dos collé au dossier.'
    },
    {
        id: 'legs_rdl_db', name: 'RDL Haltères', muscle: 'Jambes', subTarget: 'Ischios',
        equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Tirer',
        instructions: 'Jambes semi-tendues. Poussez les hanches en arrière. Sentez l\'étirement des ischios.'
    },
    {
        id: 'legs_adductor', name: 'Machine Adducteurs', muscle: 'Jambes', subTarget: 'Adducteurs',
        equipment: 'Machine', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Resserrez les jambes contrôlé. Important pour la stabilité et l\'esthétique interne.'
    },
    {
        id: 'legs_calf_seated', name: 'Mollets Assis', muscle: 'Jambes', subTarget: 'Mollets',
        equipment: 'Machine', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Genoux pliés. Cible le soléaire (muscle sous le jumeau).'
    },

    // --- HOME / SANS MATÉRIEL (No Gym) ---
    {
        id: 'home_pushup_claps', name: 'Pompes Claquées', muscle: 'Pectoraux', subTarget: 'Global',
        equipment: 'Aucun', difficulty: 'Avancé', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Explosivité maximale. Poussez fort pour décoller et claquer les mains.'
    },
    {
        id: 'home_pike_pushup', name: 'Pike Pushups', muscle: 'Épaules', subTarget: 'Deltoïde Antérieur',
        equipment: 'Aucun', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Corps en V inversé. Simule un développé militaire au poids du corps.'
    },
    {
        id: 'home_bulgarian', name: 'Fentes Bulgares', muscle: 'Jambes', subTarget: 'Fessiers',
        equipment: 'Aucun', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Un pied surélevé derrière. Descendez le genou arrière vers le sol. Tueur de jambes.'
    },
    {
        id: 'home_glute_bridge', name: 'Glute Bridge 1 Jambe', muscle: 'Jambes', subTarget: 'Fessiers',
        equipment: 'Aucun', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser',
        instructions: 'Dos au sol, une jambe levée. Poussez le bassin vers le ciel.'
    },
    {
        id: 'home_diamond', name: 'Pompes Diamant', muscle: 'Bras', subTarget: 'Triceps (Vaste Externe)',
        equipment: 'Aucun', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser',
        instructions: 'Mains jointes sous la poitrine. Focus intense sur les triceps.'
    },
    // --- FLUX CONTINU (Machine & Isolation Expansion) ---
    // PECS
    { id: 'chest_press_inc_mach', name: 'Chest Press Incliné Machine', muscle: 'Pectoraux', subTarget: 'Faisceau Claviculaire (Haut)', equipment: 'Machine', difficulty: 'Débutant', mechanic: 'Composé', force: 'Pousser', instructions: 'Réglez le siège pour que les poignées soient au niveau du haut des pecs.' },
    { id: 'chest_fly_mach', name: 'Pec Deck / Butterfly', muscle: 'Pectoraux', subTarget: 'Faisceau Sternal (Milieu)', equipment: 'Machine', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Pousser', instructions: 'Gardez les coudes légèrment fléchis. Contractez au centre.' },
    { id: 'chest_svend_press', name: 'Svend Press', muscle: 'Pectoraux', subTarget: 'Faisceau Sternal (Milieu)', equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Pousser', instructions: 'Pressez un disque ou haltère entre les paumes devant vous.' },

    // DOS
    { id: 'back_hyperext', name: 'Lombaires Banc à 45°', muscle: 'Dos', subTarget: 'Lombaires', equipment: 'Poids du corps', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Tirer', instructions: 'Descendez dos droit, remontez à la parallèle. Ne cambrez pas excessivement.' },
    { id: 'back_row_machine', name: 'Rowing Machine Assis', muscle: 'Dos', subTarget: 'Rhomboides', equipment: 'Machine', difficulty: 'Débutant', mechanic: 'Composé', force: 'Tirer', instructions: 'Poitrine contre le coussin. Tirez les coudes loin derrière.' },
    { id: 'back_straight_arm', name: 'Straight Arm Pulldown', muscle: 'Dos', subTarget: 'Grand Dorsal', equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer', instructions: 'Bras tendus, amenez la barre aux cuisses pour isoler les dorsaux.' },

    // JAMBES
    { id: 'legs_hip_thrust', name: 'Hip Thrust Barre', muscle: 'Jambes', subTarget: 'Fessiers', equipment: 'Barre', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser', instructions: 'Le roi des fessiers. Poussez le bassin vers le haut en contractant fort.' },
    { id: 'legs_bulgarian_db', name: 'Fentes Bulgares Haltères', muscle: 'Jambes', subTarget: 'Quadriceps', equipment: 'Haltères', difficulty: 'Avancé', mechanic: 'Composé', force: 'Pousser', instructions: 'Un pied sur banc derrière. Descendez verticalement. Douleur garantie.' },
    { id: 'legs_sissy_squat', name: 'Sissy Squat', muscle: 'Jambes', subTarget: 'Quadriceps', equipment: 'Poids du corps', difficulty: 'Avancé', mechanic: 'Isolation', force: 'Pousser', instructions: 'Penchez-vous en arrière sur la pointe des pieds. Isolation extrême des quads.' },
    { id: 'legs_donkey_kick', name: 'Kickback Poulie', muscle: 'Jambes', subTarget: 'Fessiers', equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Pousser', instructions: 'Attachez la cheville. Envoyez la jambe loin derrière.' },

    // ÉPAULES
    { id: 'shldr_facepull_rope', name: 'Face Pull (Corde)', muscle: 'Épaules', subTarget: 'Deltoïde Postérieur', equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer', instructions: 'Tirez la corde vers le front en écartant les mains. Santé des épaules.' },
    { id: 'shldr_egyptian', name: 'Élévation Latérale Égyptienne', muscle: 'Épaules', subTarget: 'Deltoïde Latéral', equipment: 'Câbles', difficulty: 'Avancé', mechanic: 'Isolation', force: 'Tirer', instructions: 'Unilatéral, corps penché. Tension continue sur le deltoïde latéral.' },
    { id: 'shldr_shrug_db', name: 'Shrugs Haltères', muscle: 'Épaules', subTarget: 'Trapèzes', equipment: 'Haltères', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Tirer', instructions: 'Levez les épaules vers les oreilles. Ne roulez pas les épaules.' },

    // BRAS
    { id: 'arm_zottman', name: 'Zottman Curl', muscle: 'Bras', subTarget: 'Avant-bras', equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer', instructions: 'Montez en supination, descendez en pronation.' },
    { id: 'arm_preacher', name: 'Curl Pupitre (Larry Scott)', muscle: 'Bras', subTarget: 'Biceps (Courte Portion)', equipment: 'Barre', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Tirer', instructions: 'Bras calés sur le pupitre. Impossible de tricher.' },
    { id: 'arm_concentrated', name: 'Curl Concentré', muscle: 'Bras', subTarget: 'Biceps (Courte Portion)', equipment: 'Haltères', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Tirer', instructions: 'Coude calé contre la cuisse. Focus total sur le pic.' },
    { id: 'arm_skull_db', name: 'Barre au Front Haltères', muscle: 'Bras', subTarget: 'Triceps (Longue Portion)', equipment: 'Haltères', difficulty: 'Intermédiaire', mechanic: 'Isolation', force: 'Pousser', instructions: 'Permet une prise neutre, plus doux pour les coudes.' },

    // ABDOS
    { id: 'abs_roller', name: 'Ab Wheel Rollout', muscle: 'Abdos', subTarget: 'Grand Droit', equipment: 'Aucun', difficulty: 'Avancé', mechanic: 'Composé', force: 'Statique', instructions: 'Roulez vers l\'avant sans cambrer le dos. Gainage dynamique.' },
    { id: 'abs_woodchopper', name: 'Woodchopper Poulie', muscle: 'Abdos', subTarget: 'Obliques', equipment: 'Câbles', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Tirer', instructions: 'Mouvement de rotation du buste. Imite le geste de couper du bois.' },
    { id: 'abs_vacuum', name: 'Stomach Vacuum', muscle: 'Abdos', subTarget: 'Transverse', equipment: 'Aucun', difficulty: 'Débutant', mechanic: 'Isolation', force: 'Statique', instructions: 'Expirez tout l\'air et rentrez le ventre au maximum. Ventre plat.' },

    // CARDIO / HOME
    { id: 'cardio_jump_rope', name: 'Corde à Sauter', muscle: 'Cardio', subTarget: 'Global', equipment: 'Aucun', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Pousser', instructions: 'Rebondissez sur la pointe des pieds. Excellent pour le cœur et les mollets.' },
    { id: 'cardio_kettle_swing', name: 'Kettlebell Swing', muscle: 'Cardio', subTarget: 'Global', equipment: 'Kettlebell', difficulty: 'Intermédiaire', mechanic: 'Composé', force: 'Tirer', instructions: 'Mouvement de hanche explosif (Hinge). Pas un squat.' },
    { id: 'cardio_mountain', name: 'Mountain Climbers', muscle: 'Cardio', subTarget: 'Grand Droit', equipment: 'Aucun', difficulty: 'Débutant', mechanic: 'Composé', force: 'Statique', instructions: 'En planche, ramenez les genoux vers la poitrine en rythme.' },
];

export const MUSCLE_GROUPS: MuscleGroup[] = ['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Bras', 'Abdos', 'Cardio'];
export const EQUIPMENT_TYPES: Equipment[] = ['Barre', 'Haltères', 'Machine', 'Poids du corps', 'Câbles', 'Kettlebell', 'Élastique', 'Aucun'];
