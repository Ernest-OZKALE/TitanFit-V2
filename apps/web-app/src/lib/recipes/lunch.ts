import { RecipeFull } from '../recipe-database';

export const lunchRecipes: RecipeFull[] = [
    {
        id: 'ln_001',
        name: 'Poulet Basquaise Express & Riz',
        description: 'Un classique revisité pour le sportif. Saveurs du sud, riche en protéines et légumes.',
        category: 'lunch',
        difficulty: 'Moyen',
        prepTime: 15,
        cookTime: 20,
        servings: 1,
        macros: {
            calories: 580,
            protein: 45,
            carbs: 65,
            fat: 14,
            fiber: 8,
            sugar: 6,
            sodium: 450
        },
        ingredients: [
            { name: 'Filet de poulet', quantity: 150, unit: 'g', macros: { calories: 165, protein: 35, carbs: 0, fat: 2, fiber: 0, sugar: 0, sodium: 75 } },
            { name: 'Riz Basmati cru', quantity: 70, unit: 'g', macros: { calories: 245, protein: 5, carbs: 54, fat: 0.5, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Poivrons (mixte)', quantity: 150, unit: 'g', macros: { calories: 40, protein: 1, carbs: 9, fat: 0, fiber: 3, sugar: 6, sodium: 5 } },
            { name: 'Sauce tomate nature', quantity: 100, unit: 'g', macros: { calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 1, sugar: 4, sodium: 200 } },
            { name: 'Huile d\'olive', quantity: 1, unit: 'c.à.s', macros: { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Lancer la cuisson du riz.',
            'Couper le poulet en cubes et les poivrons en lanières.',
            'Saisir le poulet dans l\'huile bien chaude, puis réserver.',
            'Dans la même poêle, faire revenir les poivrons 5 min.',
            'Remettre le poulet, ajouter la sauce tomate et laisser mijoter 10 min.',
            'Servir avec le riz.'
        ],
        tags: ['high-protein', 'meal-prep', 'balanced', 'gluten-free'],
        goal: ['bulk', 'maintain']
    },
    {
        id: 'ln_002',
        name: 'Salade de Pâtes au Thon & Pesto',
        description: 'Le repas froid idéal. Équilibré et prêt en avance.',
        category: 'lunch',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 540,
            protein: 30,
            carbs: 60,
            fat: 18,
            fiber: 6,
            sugar: 4,
            sodium: 520
        },
        ingredients: [
            { name: 'Pâtes complètes crues', quantity: 70, unit: 'g', macros: { calories: 240, protein: 9, carbs: 48, fat: 1, fiber: 5, sugar: 1, sodium: 0 } },
            { name: 'Thon au naturel', quantity: 100, unit: 'g', macros: { calories: 110, protein: 25, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 300 } },
            { name: 'Pesto Verde', quantity: 20, unit: 'g', macros: { calories: 90, protein: 1, carbs: 1, fat: 9, fiber: 0, sugar: 0, sodium: 150 } },
            { name: 'Tomates cerises', quantity: 100, unit: 'g', macros: { calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 1, sugar: 3, sodium: 5 } },
            { name: 'Maïs', quantity: 50, unit: 'g', macros: { calories: 40, protein: 1, carbs: 8, fat: 0.5, fiber: 1, sugar: 2, sodium: 5 } }
        ],
        instructions: [
            'Cuire les pâtes al dente, égoutter et refroidir sous l\'eau.',
            'Dans un saladier, mélanger les pâtes et le pesto.',
            'Ajouter le thon émietté, le maïs et les tomates coupées en deux.',
            'Mélanger et conserver au frais.'
        ],
        tags: ['meal-prep', 'quick', 'pescatarian'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'ln_003',
        name: 'Steak Haché 5% & Patates Douces',
        description: 'Le classique de la musculation. Simple, efficace, anabolique.',
        category: 'lunch',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 15,
        servings: 1,
        macros: {
            calories: 500,
            protein: 42,
            carbs: 45,
            fat: 16,
            fiber: 6,
            sugar: 8,
            sodium: 250
        },
        ingredients: [
            { name: 'Steak Haché 5%', quantity: 125, unit: 'g', macros: { calories: 160, protein: 26, carbs: 0, fat: 6, fiber: 0, sugar: 0, sodium: 80 } },
            { name: 'Patate douce', quantity: 200, unit: 'g', macros: { calories: 170, protein: 3, carbs: 40, fat: 0, fiber: 6, sugar: 8, sodium: 110 } },
            { name: 'Haricots verts', quantity: 150, unit: 'g', macros: { calories: 45, protein: 2, carbs: 7, fat: 0, fiber: 4, sugar: 3, sodium: 5 } },
            { name: 'Huile d\'olive', quantity: 1, unit: 'c.à.c', macros: { calories: 40, protein: 0, carbs: 0, fat: 4.5, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Couper la patate douce en cubes et cuire à la vapeur ou à l\'eau (15min).',
            'Cuire les haricots verts.',
            'Griller le steak à la poêle selon cuisson désirée.',
            'Écraser les patates douces avec l\'huile d\'olive et sel/poivre.'
        ],
        tags: ['high-protein', 'gluten-free', 'paleo'],
        goal: ['bulk', 'cut']
    },
    {
        id: 'ln_004',
        name: 'Wrap Poulet Caesar',
        description: 'La fameuse salade en version wrap. Gourmand mais maîtrisé.',
        category: 'lunch',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 5,
        servings: 1,
        macros: {
            calories: 480,
            protein: 35,
            carbs: 35,
            fat: 20,
            fiber: 4,
            sugar: 2,
            sodium: 750
        },
        ingredients: [
            { name: 'Tortilla blé', quantity: 1, unit: 'pièce', macros: { calories: 180, protein: 5, carbs: 32, fat: 4, fiber: 2, sugar: 1, sodium: 350 } },
            { name: 'Aiguillettes de poulet', quantity: 120, unit: 'g', macros: { calories: 130, protein: 28, carbs: 0, fat: 1.5, fiber: 0, sugar: 0, sodium: 60 } },
            { name: 'Parmesan', quantity: 15, unit: 'g', macros: { calories: 60, protein: 5, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 200 } },
            { name: 'Sauce Caesar allégée', quantity: 20, unit: 'g', macros: { calories: 50, protein: 0.5, carbs: 2, fat: 4.5, fiber: 0, sugar: 1, sodium: 150 } },
            { name: 'Laitue Romaine', quantity: 50, unit: 'g', macros: { calories: 8, protein: 0.5, carbs: 1, fat: 0, fiber: 1, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Griller le poulet à la poêle.',
            'Étaler la sauce sur la tortilla.',
            'Ajouter la salade, le poulet refroidi et les copeaux de parmesan.',
            'Rouler serré.'
        ],
        tags: ['quick', 'meal-prep', 'high-protein'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'ln_005',
        name: 'Bowl Végé Lentilles & Feta',
        description: 'Protéines végétales et index glycémique bas. Énergie durable pour l\'après-midi.',
        category: 'lunch',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 460,
            protein: 24,
            carbs: 45,
            fat: 18,
            fiber: 14,
            sugar: 3,
            sodium: 550
        },
        ingredients: [
            { name: 'Lentilles en conserve', quantity: 200, unit: 'g', macros: { calories: 180, protein: 14, carbs: 28, fat: 0.5, fiber: 10, sugar: 1, sodium: 200 } },
            { name: 'Feta', quantity: 40, unit: 'g', macros: { calories: 105, protein: 6, carbs: 1.5, fat: 8.5, fiber: 0, sugar: 1.5, sodium: 360 } },
            { name: 'Tomates', quantity: 100, unit: 'g', macros: { calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 1, sugar: 3, sodium: 5 } },
            { name: 'Concombre', quantity: 100, unit: 'g', macros: { calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 1, sugar: 2, sodium: 0 } },
            { name: 'Vinaigrette légère', quantity: 1, unit: 'c.à.s', macros: { calories: 40, protein: 0, carbs: 2, fat: 3.5, fiber: 0, sugar: 1, sodium: 100 } }
        ],
        instructions: [
            'Rincer les lentilles.',
            'Couper légumes et feta en dés.',
            'Mélanger tout dans un grand bol.',
            'Assaisonner généreusement (herbes, citron, vinaigrette).'
        ],
        tags: ['vegetarian', 'high-fiber', 'no-cook', 'quick'],
        goal: ['cut', 'maintain']
    }
];
