import { RecipeFull } from '../recipe-database';

export const dinnerRecipes: RecipeFull[] = [
    {
        id: 'dn_001',
        name: 'Filet de Cabillaud Pané Amande & Brocolis',
        description: 'Une panure saine et riche en bons gras pour changer du poisson vapeur.',
        category: 'dinner',
        difficulty: 'Moyen',
        prepTime: 10,
        cookTime: 15,
        servings: 1,
        macros: {
            calories: 380,
            protein: 35,
            carbs: 12,
            fat: 20,
            fiber: 6,
            sugar: 3,
            sodium: 250
        },
        ingredients: [
            { name: 'Dos de cabillaud', quantity: 150, unit: 'g', macros: { calories: 120, protein: 27, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 100 } },
            { name: 'Poudre d\'amande', quantity: 20, unit: 'g', macros: { calories: 120, protein: 4, carbs: 3, fat: 10, fiber: 2, sugar: 1, sodium: 0 } },
            { name: 'Brocolis', quantity: 200, unit: 'g', macros: { calories: 70, protein: 5, carbs: 8, fat: 0.5, fiber: 5, sugar: 3, sodium: 60 } },
            { name: 'Citron', quantity: 0.5, unit: 'pièce', macros: { calories: 10, protein: 0, carbs: 3, fat: 0, fiber: 1, sugar: 1, sodium: 0 } },
            { name: 'Huile d\'olive (spray)', quantity: 5, unit: 'ml', macros: { calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Presser le jus de citron sur le poisson.',
            'Rouler le poisson dans la poudre d\'amande (salée/poivrée).',
            'Cuire à la poêle avec un peu d\'huile 3-4 min par face.',
            'Cuire les brocolis à la vapeur.',
            'Servir avec un quartier de citron.'
        ],
        tags: ['low-carb', 'keto', 'pescatarian', 'gluten-free'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'dn_002',
        name: 'Wok de Dinde aux Légumes Croquants',
        description: 'Rapide, volumineux et faible en calories. Parfait pour se caler le soir.',
        category: 'dinner',
        difficulty: 'Facile',
        prepTime: 15,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 420,
            protein: 40,
            carbs: 35,
            fat: 10,
            fiber: 8,
            sugar: 10,
            sodium: 600
        },
        ingredients: [
            { name: 'Escalope de dinde', quantity: 150, unit: 'g', macros: { calories: 160, protein: 36, carbs: 0, fat: 2, fiber: 0, sugar: 0, sodium: 75 } },
            { name: 'Mélange légumes wok (surgelé)', quantity: 250, unit: 'g', macros: { calories: 100, protein: 4, carbs: 15, fat: 0.5, fiber: 6, sugar: 8, sodium: 50 } },
            { name: 'Nouilles de riz', quantity: 30, unit: 'g', macros: { calories: 110, protein: 1, carbs: 25, fat: 0, fiber: 1, sugar: 0, sodium: 10 } },
            { name: 'Sauce soja salée', quantity: 1, unit: 'c.à.s', macros: { calories: 10, protein: 1, carbs: 1, fat: 0, fiber: 0, sugar: 0, sodium: 900 } },
            { name: 'Huile sésame', quantity: 1, unit: 'c.à.c', macros: { calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Cuire les nouilles selon le paquet.',
            'Wocker la dinde coupée en lanières dans l\'huile bien chaude.',
            'Ajouter les légumes, cuire 5-7 min (ils doivent rester croquants).',
            'Déglacer à la sauce soja, ajouter les nouilles et mélanger.'
        ],
        tags: ['high-protein', 'dairy-free', 'volume-eating'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'dn_003',
        name: 'Omelette Soufflée aux Champignons',
        description: 'Léger pour la digestion mais riche en goût.',
        category: 'dinner',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 8,
        servings: 1,
        macros: {
            calories: 320,
            protein: 26,
            carbs: 6,
            fat: 20,
            fiber: 4,
            sugar: 2,
            sodium: 350
        },
        ingredients: [
            { name: 'Œufs', quantity: 3, unit: 'pièce', macros: { calories: 210, protein: 18, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 210 } },
            { name: 'Champignons de Paris', quantity: 150, unit: 'g', macros: { calories: 35, protein: 5, carbs: 5, fat: 0.5, fiber: 4, sugar: 2, sodium: 10 } },
            { name: 'Persil', quantity: 1, unit: 'c.à.s', macros: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Beurre', quantity: 5, unit: 'g', macros: { calories: 35, protein: 0, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Faire sauter les champignons émincés jusqu\'à ce qu\'ils rendent leur eau.',
            'Séparer les blancs des jaunes. Monter les blancs en neige ferme.',
            'Mélanger les jaunes avec sel/poivre, puis incorporer délicatement les blancs.',
            'Cuire à feu moyen, déposer les champignons. Plier.'
        ],
        tags: ['keto', 'vegetarian', 'low-carb', 'quick'],
        goal: ['cut']
    },
    {
        id: 'dn_004',
        name: 'Saumon Papillote & Asperges',
        description: 'Zéro matière grasse ajoutée, goût préservé, vaisselle minimale.',
        category: 'dinner',
        difficulty: 'Très Facile',
        prepTime: 5,
        cookTime: 20,
        servings: 1,
        macros: {
            calories: 350,
            protein: 30,
            carbs: 8,
            fat: 20,
            fiber: 4,
            sugar: 3,
            sodium: 80
        },
        ingredients: [
            { name: 'Pavé de saumon', quantity: 140, unit: 'g', macros: { calories: 280, protein: 28, carbs: 0, fat: 18, fiber: 0, sugar: 0, sodium: 80 } },
            { name: 'Asperges vertes', quantity: 150, unit: 'g', macros: { calories: 30, protein: 3, carbs: 6, fat: 0, fiber: 3, sugar: 3, sodium: 5 } },
            { name: 'Citron tranches', quantity: 2, unit: 'tranche', macros: { calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Aneth', quantity: 1, unit: 'branche', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Préchauffer le four à 200°C.',
            'Sur un papier cuisson, déposer les asperges puis le saumon.',
            'Ajouter citron, aneth, sel poivre.',
            'Fermer hermétiquement la papillote.',
            'Enfourner 20 min.'
        ],
        tags: ['paleo', 'keto', 'gluten-free', 'clean-eating'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'dn_005',
        name: 'Chili sin Carne (Végétarien)',
        description: 'Un dîner réconfortant sans viande mais riche en protéines végétales.',
        category: 'dinner',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 20,
        servings: 1,
        macros: {
            calories: 450,
            protein: 22,
            carbs: 60,
            fat: 8,
            fiber: 18,
            sugar: 8,
            sodium: 600
        },
        ingredients: [
            { name: 'Haricots rouges conserve', quantity: 200, unit: 'g', macros: { calories: 180, protein: 14, carbs: 28, fat: 1, fiber: 12, sugar: 1, sodium: 300 } },
            { name: 'Pulpe de tomate', quantity: 200, unit: 'g', macros: { calories: 50, protein: 2, carbs: 10, fat: 0, fiber: 3, sugar: 8, sodium: 50 } },
            { name: 'Protéines de soja texturées (sèches)', quantity: 30, unit: 'g', macros: { calories: 100, protein: 15, carbs: 6, fat: 0.5, fiber: 5, sugar: 2, sodium: 5 } },
            { name: 'Maïs', quantity: 50, unit: 'g', macros: { calories: 40, protein: 1, carbs: 8, fat: 0.5, fiber: 1, sugar: 2, sodium: 5 } },
            { name: 'Oignon & Épices Chili', quantity: 1, unit: 'portion', macros: { calories: 20, protein: 0, carbs: 4, fat: 0, fiber: 1, sugar: 2, sodium: 100 } }
        ],
        instructions: [
            'Réhydrater le soja dans de l\'eau chaude + bouillon.',
            'Faire revenir l\'oignon.',
            'Ajouter le soja, les tomates, les haricots et le maïs.',
            'Laisser mijoter à feu doux 15-20 min pour épaissir.'
        ],
        tags: ['vegan', 'high-fiber', 'budget', 'volume-eating'],
        goal: ['cut', 'maintain']
    }
];
