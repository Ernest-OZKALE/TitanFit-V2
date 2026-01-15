import type { Exercise } from './exercise-types';

// ADDITIONAL CHEST EXERCISES (30+)
export const CHEST_ADVANCED: Exercise[] = [
    { id: 'chest-squeeze-press', name: 'Squeeze Press', targetMuscles: ['chest-mid'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Haltères serrés, poussez en maintenant la pression'] },
    { id: 'guillotine-press', name: 'Guillotine Press', targetMuscles: ['chest-upper'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Barbell vers le cou, dangereux sans spotter'] },
    { id: 'hex-press', name: 'Hex Press', targetMuscles: ['chest-mid'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Haltères hexagonaux pressés ensemble'] },
    { id: 'pushup-archer', name: 'Archer Push-ups', targetMuscles: ['chest-mid'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Un bras tendu sur le côté, alternez'] },
    { id: 'pushup-clap', name: 'Clap Push-ups', targetMuscles: ['chest-mid'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Poussez explosif, clap en l air'] },
    { id: 'pushup-explosive', name: 'Explosive Push-ups', targetMuscles: ['chest-mid'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Décollez les mains du sol'] },
    { id: 'pushup-pike', name: 'Pike Push-ups', targetMuscles: ['delt-front'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Hanches hautes, focus épaules'] },
    { id: 'pushup-spiderman', name: 'Spiderman Push-ups', targetMuscles: ['chest-mid', 'obliques'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Genou vers le coude à chaque rep'] },
    { id: 'pushup-hindu', name: 'Hindu Push-ups', targetMuscles: ['chest-mid', 'delt-front'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Mouvement fluide de haut en bas'] },
    { id: 'cable-fly-iso', name: 'Écarté Poulie Isométrique', targetMuscles: ['chest-mid'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Tenez la contraction 3-5 secondes'] },
];

// ADDITIONAL BACK EXERCISES (30+)
export const BACK_ADVANCED: Exercise[] = [
    { id: 'muscle-up', name: 'Muscle Up', targetMuscles: ['lats', 'chest-mid'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Traction explosive, passez au-dessus de la barre'] },
    { id: 'one-arm-pullup', name: 'Traction Une Main', targetMuscles: ['lats'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Le Saint Graal de la traction'] },
    { id: 'typewriter-pullup', name: 'Typewriter Pull-ups', targetMuscles: ['lats'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['En haut, déplacez-vous latéralement'] },
    { id: 'commando-pullup', name: 'Commando Pull-ups', targetMuscles: ['lats'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Mains l une devant l autre, alternez'] },
    { id: 'weighted-pullup', name: 'Tractions Lestées', targetMuscles: ['lats'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Ceinture avec poids'] },
    { id: 'behind-neck-pulldown', name: 'Tirage Nuque', targetMuscles: ['lats'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Tirez derrière la tête, attention épaules'] },
    { id: 'kroc-row', name: 'Kroc Row', targetMuscles: ['lats'], equipment: ['dumbbell'], difficulty: 'advanced', category: 'strength', instructions: ['Rowing lourd avec un peu de triche'] },
    { id: 'helms-row', name: 'Helms Row', targetMuscles: ['lats'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Rowing sur banc incliné face vers le bas'] },
    { id: 'snatch-grip-deadlift', name: 'Soulevé Prise Arraché', targetMuscles: ['back', 'traps-upper'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Prise très large'] },
    { id: 'jefferson-deadlift', name: 'Jefferson Deadlift', targetMuscles: ['back', 'quad-rectus'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Barre entre les jambes, position mixte'] },
];

// ADDITIONAL LEGS EXERCISES (30+)
export const LEGS_ADVANCED: Exercise[] = [
    { id: 'pause-squat', name: 'Pause Squat', targetMuscles: ['quad-rectus'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['3 sec pause en bas'] },
    { id: 'tempo-squat', name: 'Tempo Squat', targetMuscles: ['quad-rectus'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['4 sec descente, 2 sec montée'] },
    { id: 'anderson-squat', name: 'Anderson Squat', targetMuscles: ['quad-rectus'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Départ position basse sur les pins'] },
    { id: 'belt-squat', name: 'Belt Squat', targetMuscles: ['quad-rectus'], equipment: ['machine'], difficulty: 'intermediate', category: 'strength', instructions: ['Poids sur ceinture, pas sur le dos'] },
    { id: 'safety-bar-squat', name: 'Safety Bar Squat', targetMuscles: ['quad-rectus'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Barre de sécurité sur les épaules'] },
    { id: 'split-squat-rear-elevated', name: 'Split Squat Pieds Arrière Élevés', targetMuscles: ['quad-rectus'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Pied arrière sur box basse'] },
    { id: 'slider-lunge', name: 'Slider Lunge', targetMuscles: ['quad-rectus', 'glutes-max'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Pied arrière sur slider'] },
    { id: 'curtsy-lunge', name: 'Curtsy Lunge', targetMuscles: ['glutes-med'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Croisez le pied derrière'] },
    { id: 'single-leg-rdl', name: 'RDL Une Jambe', targetMuscles: ['hamstrings', 'glutes-max'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Équilibre une jambe, penchez'] },
    { id: 'good-mornings', name: 'Good Mornings', targetMuscles: ['hamstrings', 'back'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Barre sur les trapèzes, penchez le buste'] },
    { id: 'glute-ham-raise', name: 'Glute Ham Raise', targetMuscles: ['hamstrings', 'glutes-max'], equipment: ['machine'], difficulty: 'advanced', category: 'strength', instructions: ['Machine GHD, contrôlez la descente'] },
    { id: 'single-leg-press', name: 'Presse Une Jambe', targetMuscles: ['quad-rectus'], equipment: ['machine'], difficulty: 'beginner', category: 'strength', instructions: ['Corrigez les déséquilibres'] },
    { id: 'sissy-squat-weighted', name: 'Sissy Squat Lesté', targetMuscles: ['quad-rectus'], equipment: ['dumbbell'], difficulty: 'advanced', category: 'strength', instructions: ['Haltère contre la poitrine'] },
    { id: 'jefferson-curl', name: 'Jefferson Curl', targetMuscles: ['hamstrings', 'back'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'stretching', instructions: ['Debout sur box, roulez vers le bas'] },
    { id: 'donkey-kicks', name: 'Donkey Kicks', targetMuscles: ['glutes-max'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['À quatre pattes, kickez vers le plafond'] },
    { id: 'fire-hydrants', name: 'Fire Hydrants', targetMuscles: ['glutes-med'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Levez la jambe sur le côté'] },
    { id: 'banded-walks', name: 'Banded Walks', targetMuscles: ['glutes-med'], equipment: ['band'], difficulty: 'beginner', category: 'strength', instructions: ['Bande aux chevilles, marchez latéralement'] },
    { id: 'clamshells', name: 'Clamshells', targetMuscles: ['glutes-med'], equipment: ['band'], difficulty: 'beginner', category: 'strength', instructions: ['Sur le côté, ouvrez les genoux'] },
    { id: 'frog-pump', name: 'Frog Pump', targetMuscles: ['glutes-max'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Plantes des pieds ensemble, poussez'] },
    { id: 'single-leg-calf-raise', name: 'Mollet Une Jambe', targetMuscles: ['calves'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Sur une marche, une jambe'] },
];

// ADDITIONAL SHOULDERS EXERCISES (25+)
export const SHOULDERS_ADVANCED: Exercise[] = [
    { id: 'btm-press', name: 'Behind The Neck Press', targetMuscles: ['delt-front'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Barre descend derrière la nuque'] },
    { id: 'bradford-press', name: 'Bradford Press', targetMuscles: ['delt-front'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Alternez devant/derrière sans pause'] },
    { id: 'viking-press', name: 'Viking Press', targetMuscles: ['delt-front'], equipment: ['machine'], difficulty: 'intermediate', category: 'strength', instructions: ['Machine landmine à deux mains'] },
    { id: 'cuban-press', name: 'Cuban Press', targetMuscles: ['rotator-cuff', 'delt-rear'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Rotation externe puis press'] },
    { id: 'prone-y-raise', name: 'Prone Y Raise', targetMuscles: ['traps-mid-lower'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Allongé sur banc, levez en Y'] },
    { id: 'prone-i-raise', name: 'Prone I Raise', targetMuscles: ['traps-mid-lower'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Bras devant, levez droit'] },
    { id: 'prone-t-raise', name: 'Prone T Raise', targetMuscles: ['delt-rear'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Allongé, bras sur les côtés'] },
    { id: 'db-power-clean', name: 'DB Power Clean', targetMuscles: ['traps-upper', 'delt-front'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Épaulé explosif avec haltères'] },
    { id: 'high-pull', name: 'High Pull', targetMuscles: ['traps-upper', 'delt-side'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Tirez vers le menton, coudes hauts'] },
    { id: 'snatch-grip-high-pull', name: 'Snatch Grip High Pull', targetMuscles: ['traps-upper'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Prise large, tirez explosif'] },
    { id: 'leaning-lateral-raise', name: 'Élévation Latérale Inclinée', targetMuscles: ['delt-side'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Penchez-vous, amplitude maximale'] },
    { id: 'behind-back-shrug', name: 'Shrugs Derrière le Dos', targetMuscles: ['traps-upper'], equipment: ['barbell'], difficulty: 'beginner', category: 'strength', instructions: ['Barre derrière sur smith machine'] },
    { id: 'snatch-grip-shrug', name: 'Shrugs Prise Large', targetMuscles: ['traps-mid-lower'], equipment: ['barbell'], difficulty: 'beginner', category: 'strength', instructions: ['Cible les trapèzes moyens'] },
];

// ADDITIONAL ARMS EXERCISES (25+)
export const ARMS_ADVANCED: Exercise[] = [
    { id: 'waiter-curl', name: 'Waiter Curl', targetMuscles: ['biceps-short'], equipment: ['dumbbell'], difficulty: 'beginner', category: 'strength', instructions: ['Tenez un haltère par le dessous'] },
    { id: 'bayesian-curl', name: 'Bayesian Curl', targetMuscles: ['biceps-long'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Bras derrière, étirement maximal'] },
    { id: 'crucifix-curl', name: 'Crucifix Curl', targetMuscles: ['biceps-short'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Poulies hautes, curl vers les oreilles'] },
    { id: '21s-curls', name: 'Curl 21s', targetMuscles: ['biceps-short'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['7 bas, 7 haut, 7 complets'] },
    { id: 'sissy-curl', name: 'Sissy Curl', targetMuscles: ['biceps-long'], equipment: ['dumbbell'], difficulty: 'advanced', category: 'strength', instructions: ['Penchez en arrière, étirement max'] },
    { id: 'diamond-cutter-ext', name: 'Diamond Cutter Extension', targetMuscles: ['triceps-long'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Overhead avec corde, écartez en bas'] },
    { id: 'tate-press', name: 'Tate Press', targetMuscles: ['triceps-long'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Coudes fixes, haltères vers la poitrine'] },
    { id: 'jm-press', name: 'JM Press', targetMuscles: ['triceps-long'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Hybride skull crusher / close grip'] },
    { id: 'california-press', name: 'California Press', targetMuscles: ['triceps-long'], equipment: ['barbell'], difficulty: 'advanced', category: 'strength', instructions: ['Descendez vers le cou puis poussez'] },
    { id: 'french-press', name: 'French Press', targetMuscles: ['triceps-long'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Version debout du skull crusher'] },
    { id: 'dead-stop-curl', name: 'Dead Stop Curl', targetMuscles: ['biceps-short'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Pause en bas, élimine l inertie'] },
    { id: 'strict-curl', name: 'Strict Curl', targetMuscles: ['biceps-short'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Dos contre mur, aucune triche'] },
    { id: 'wrist-roller', name: 'Wrist Roller', targetMuscles: ['forearms'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Enroulez la corde avec les poignets'] },
    { id: 'dead-hang', name: 'Dead Hang', targetMuscles: ['forearms'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Suspendez-vous le plus longtemps possible'] },
    { id: 'towel-pullup', name: 'Tractions Serviette', targetMuscles: ['forearms', 'lats'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Grip sur serviette, intense pour avant-bras'] },
];

// ADDITIONAL CORE EXERCISES (25+)
export const CORE_ADVANCED: Exercise[] = [
    { id: 'weighted-plank', name: 'Planche Lestée', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Disque sur le dos'] },
    { id: 'plank-saw', name: 'Plank Saw', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Avant/arrière sur les coudes'] },
    { id: 'plank-shoulder-tap', name: 'Plank Shoulder Tap', targetMuscles: ['abs-rectus', 'obliques'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Touchez l épaule opposée'] },
    { id: 'plank-up-down', name: 'Plank Up Down', targetMuscles: ['abs-rectus', 'triceps-long'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Alternez bras tendus/coudes'] },
    { id: 'body-saw', name: 'Body Saw', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Pieds sur sliders, avancez/reculez'] },
    { id: 'windshield-wipers', name: 'Windshield Wipers', targetMuscles: ['obliques'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Suspendu, balancez les jambes'] },
    { id: 'hanging-windshield-wipers', name: 'Windshield Wipers Suspendu', targetMuscles: ['obliques'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Jambes tendues, gauche/droite'] },
    { id: 'weighted-sit-up', name: 'Sit Up Lesté', targetMuscles: ['abs-rectus'], equipment: ['dumbbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Disque ou haltère sur la poitrine'] },
    { id: 'decline-crunch', name: 'Crunch Décliné', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Pieds en haut sur banc décliné'] },
    { id: 'cable-woodchop', name: 'Woodchop Poulie', targetMuscles: ['obliques'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Haut vers bas en diagonale'] },
    { id: 'reverse-woodchop', name: 'Reverse Woodchop', targetMuscles: ['obliques'], equipment: ['cable'], difficulty: 'intermediate', category: 'strength', instructions: ['Bas vers haut en diagonale'] },
    { id: 'landmine-rotation', name: 'Rotation Landmine', targetMuscles: ['obliques'], equipment: ['barbell'], difficulty: 'intermediate', category: 'strength', instructions: ['Barre dans coin, rotation du tronc'] },
    { id: 'ab-roller-kneeling', name: 'Ab Roller Genoux', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Version agenouillée, plus facile'] },
    { id: 'ab-roller-standing', name: 'Ab Roller Debout', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'strength', instructions: ['Version debout, très difficile'] },
    { id: 'garhammer-raise', name: 'Garhammer Raise', targetMuscles: ['abs-lower'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'strength', instructions: ['Suspendu, genoux vers la poitrine'] },
    { id: 'captains-chair', name: 'Chaise du Capitaine', targetMuscles: ['abs-lower'], equipment: ['machine'], difficulty: 'beginner', category: 'strength', instructions: ['Levez les genoux sur la machine'] },
    { id: 'flutter-kicks', name: 'Flutter Kicks', targetMuscles: ['abs-lower'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Au sol, battez les jambes'] },
    { id: 'scissor-kicks', name: 'Scissor Kicks', targetMuscles: ['abs-lower'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Croisez les jambes en ciseaux'] },
    { id: 'reverse-crunch', name: 'Crunch Inversé', targetMuscles: ['abs-lower'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Soulevez les hanches vers le plafond'] },
    { id: 'bench-leg-raise', name: 'Relevé Jambes sur Banc', targetMuscles: ['abs-lower'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'strength', instructions: ['Allongé sur banc, jambes pendantes'] },
];

// ADDITIONAL CARDIO EXERCISES (25+)
export const CARDIO_ADVANCED: Exercise[] = [
    { id: 'tabata-burpees', name: 'Tabata Burpees', targetMuscles: ['chest-mid', 'quad-rectus'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'cardio', instructions: ['20s travail, 10s repos, 8 rounds'] },
    { id: 'tabata-sprints', name: 'Tabata Sprints', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'cardio', instructions: ['Protocole Tabata sur tapis'] },
    { id: 'emom-workout', name: 'EMOM (Every Minute)', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['X reps chaque minute'] },
    { id: 'amrap-workout', name: 'AMRAP (As Many Rounds)', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['Max de rounds en temps X'] },
    { id: 'ski-erg', name: 'Ski Erg', targetMuscles: ['lats', 'triceps-long'], equipment: ['machine'], difficulty: 'intermediate', category: 'cardio', instructions: ['Mouvement de ski de fond'] },
    { id: 'bear-crawl', name: 'Bear Crawl', targetMuscles: ['abs-rectus', 'delt-front'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['À quatre pattes, genoux décollés'] },
    { id: 'crab-walk', name: 'Crab Walk', targetMuscles: ['triceps-long', 'glutes-max'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Ventre vers le plafond, marchez'] },
    { id: 'inch-worm', name: 'Inch Worm', targetMuscles: ['abs-rectus', 'hamstrings'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Marchez les mains puis les pieds'] },
    { id: 'plyo-pushup', name: 'Plyo Push-ups', targetMuscles: ['chest-mid'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'cardio', instructions: ['Poussez explosif, décollez'] },
    { id: 'depth-jump', name: 'Depth Jump', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'cardio', instructions: ['Sautez d une box, rebondissez immédiatement'] },
    { id: 'broad-jump', name: 'Broad Jump', targetMuscles: ['quad-rectus', 'glutes-max'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['Saut horizontal maximal'] },
    { id: 'tuck-jump', name: 'Tuck Jump', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['Sautez, genoux à la poitrine'] },
    { id: 'split-jump', name: 'Split Jump', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['Fente, sautez, alternez'] },
    { id: 'star-jumps', name: 'Star Jumps', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Sautez en étoile, bras et jambes écartés'] },
    { id: 'skater-jumps', name: 'Skater Jumps', targetMuscles: ['glutes-med'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Sautez latéralement comme un patineur'] },
    { id: 'line-hops', name: 'Line Hops', targetMuscles: ['calves'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Sautez d un côté à l autre d une ligne'] },
    { id: 'seal-jacks', name: 'Seal Jacks', targetMuscles: ['delt-front'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Comme jumping jacks, bras devant'] },
    { id: 'plank-jacks', name: 'Plank Jacks', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['En planche, sautez les pieds écartés/serrés'] },
    { id: 'shuffle-drill', name: 'Shuffle Drill', targetMuscles: ['glutes-med'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'cardio', instructions: ['Pas chassés latéraux rapides'] },
    { id: 'agility-ladder', name: 'Agility Ladder', targetMuscles: ['calves'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'cardio', instructions: ['Footwork rapide dans échelle'] },
];

// ADDITIONAL STRETCHING EXERCISES (25+)
export const STRETCHING_ADVANCED: Exercise[] = [
    { id: 'splits-front', name: 'Grand Écart Facial', targetMuscles: ['hamstrings', 'adductors'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'stretching', instructions: ['Jambes écartées au maximum'] },
    { id: 'splits-side', name: 'Grand Écart Latéral', targetMuscles: ['adductors'], equipment: ['bodyweight'], difficulty: 'advanced', category: 'stretching', instructions: ['Jambes sur les côtés'] },
    { id: 'pancake-stretch', name: 'Pancake Stretch', targetMuscles: ['adductors', 'hamstrings'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['Assis, jambes écartées, penchez'] },
    { id: 'straddle-stretch', name: 'Straddle Stretch', targetMuscles: ['adductors'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['Jambes écartées, tenez'] },
    { id: 'frog-stretch', name: 'Frog Stretch', targetMuscles: ['adductors'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['À quatre pattes, genoux écartés'] },
    { id: 'butterfly-stretch', name: 'Butterfly Stretch', targetMuscles: ['adductors'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Plantes des pieds ensemble, appuyez'] },
    { id: 'seated-forward-fold', name: 'Flexion Avant Assise', targetMuscles: ['hamstrings'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Jambes tendues, penchez vers les pieds'] },
    { id: 'standing-forward-fold', name: 'Flexion Avant Debout', targetMuscles: ['hamstrings'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Jambes tendues, mains au sol'] },
    { id: 'downward-dog', name: 'Chien Tête en Bas', targetMuscles: ['hamstrings', 'calves', 'lats'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['V inversé, talons vers le sol'] },
    { id: 'upward-dog', name: 'Chien Tête en Haut', targetMuscles: ['abs-rectus'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Cambré, hanches décollées'] },
    { id: 'puppy-pose', name: 'Puppy Pose', targetMuscles: ['lats', 'chest-mid'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Genoux au sol, bras loin devant'] },
    { id: 'thread-the-needle', name: 'Thread the Needle', targetMuscles: ['back', 'delt-rear'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['À quatre pattes, passez le bras sous le corps'] },
    { id: 'lying-spinal-twist', name: 'Torsion Spinale Allongée', targetMuscles: ['back', 'obliques'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Dos au sol, genou croisé'] },
    { id: 'happy-baby', name: 'Happy Baby', targetMuscles: ['adductors', 'glutes-max'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Sur le dos, attrapez les pieds'] },
    { id: 'reclined-butterfly', name: 'Butterfly Allongé', targetMuscles: ['adductors'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Sur le dos, plantes ensemble'] },
    { id: 'lizard-pose', name: 'Posture du Lézard', targetMuscles: ['quad-rectus', 'adductors'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['Fente profonde, mains à l intérieur'] },
    { id: 'dragon-pose', name: 'Posture du Dragon', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['Fente basse, étirement psoas'] },
    { id: 'half-kneeling-hip-flexor', name: 'Hip Flexor Demi-Agenouillé', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'beginner', category: 'stretching', instructions: ['Un genou au sol, poussez hanche'] },
    { id: 'couch-stretch', name: 'Couch Stretch', targetMuscles: ['quad-rectus'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['Pied arrière contre mur/canapé'] },
    { id: 'squat-internal-rotation', name: 'Rotation Interne Squat', targetMuscles: ['glutes-max'], equipment: ['bodyweight'], difficulty: 'intermediate', category: 'stretching', instructions: ['En squat, genoux vers l intérieur'] },
];
