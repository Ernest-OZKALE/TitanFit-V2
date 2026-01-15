import { RecipeFull } from '../recipe-database';

export const shakeRecipes: RecipeFull[] = [
    {
        id: 'sh_001',
        name: 'Titan Gainer Chocolat-Beurre de Cacahuète',
        description: 'Le shake ultime pour la prise de masse. Dense en calories et délicieux.',
        category: 'shake',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 850,
            protein: 55,
            carbs: 85,
            fat: 35,
            fiber: 10,
            sugar: 25,
            sodium: 200
        },
        ingredients: [
            { name: 'Lait entier', quantity: 300, unit: 'ml', macros: { calories: 180, protein: 9, carbs: 15, fat: 10, fiber: 0, sugar: 15, sodium: 120 } },
            { name: 'Whey Chocolat', quantity: 40, unit: 'g', macros: { calories: 150, protein: 30, carbs: 3, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Beurre de cacahuète', quantity: 40, unit: 'g', macros: { calories: 240, protein: 10, carbs: 8, fat: 20, fiber: 3, sugar: 3, sodium: 0 } },
            { name: 'Flocons d\'avoine (mixés)', quantity: 60, unit: 'g', macros: { calories: 230, protein: 8, carbs: 40, fat: 4, fiber: 6, sugar: 1, sodium: 0 } },
            { name: 'Banane', quantity: 1, unit: 'pièce', macros: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1 } }
        ],
        instructions: [
            'Mettre l\'avoine dans le blender et mixer en poudre.',
            'Ajouter le reste des ingrédients et des glaçons.',
            'Mixer jusqu\'à onctuosité.'
        ],
        tags: ['bulk', 'high-protein', 'quick'],
        goal: ['bulk']
    },
    {
        id: 'sh_002',
        name: 'Lean Green Detox',
        description: 'Léger, hydratant et protéiné. Parfait en sèche.',
        category: 'shake',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 220,
            protein: 25,
            carbs: 15,
            fat: 5,
            fiber: 4,
            sugar: 8,
            sodium: 80
        },
        ingredients: [
            { name: 'Eau', quantity: 300, unit: 'ml', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Whey Vanille', quantity: 30, unit: 'g', macros: { calories: 110, protein: 24, carbs: 2, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Épinards', quantity: 50, unit: 'g', macros: { calories: 12, protein: 1.5, carbs: 2, fat: 0, fiber: 1, sugar: 0, sodium: 40 } },
            { name: 'Pomme verte', quantity: 0.5, unit: 'pièce', macros: { calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 2, sugar: 8, sodium: 0 } },
            { name: 'Avocat', quantity: 30, unit: 'g', macros: { calories: 50, protein: 0.5, carbs: 2, fat: 4.5, fiber: 2, sugar: 0, sodium: 2 } }
        ],
        instructions: [
            'Tout mixer avec beaucoup de glace.',
            'Boire immédiatement.'
        ],
        tags: ['cut', 'detox', 'keto', 'gluten-free'],
        goal: ['cut']
    },
    {
        id: 'sh_003',
        name: 'Café Glacé Protéiné',
        description: 'Votre boost matinal caféine + protéines. Idéal l\'été.',
        category: 'shake',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 140,
            protein: 25,
            carbs: 3,
            fat: 2,
            fiber: 0,
            sugar: 2,
            sodium: 60
        },
        ingredients: [
            { name: 'Café expresso froid', quantity: 2, unit: 'pièce', macros: { calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Whey Vanille ou Chocolat', quantity: 30, unit: 'g', macros: { calories: 110, protein: 24, carbs: 2, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Lait d\'amande', quantity: 200, unit: 'ml', macros: { calories: 30, protein: 1, carbs: 0, fat: 2, fiber: 0, sugar: 0, sodium: 60 } }
        ],
        instructions: [
            'Mélanger whey et lait d\'amande au shaker.',
            'Verser sur le café et les glaçons.'
        ],
        tags: ['pre-workout', 'high-protein', 'low-carb', 'quick'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'sh_004',
        name: 'Berry Blast Post-Workout',
        description: 'Glucides rapides pour la récupération et antioxydants.',
        category: 'shake',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 320,
            protein: 25,
            carbs: 50,
            fat: 2,
            fiber: 6,
            sugar: 35,
            sodium: 50
        },
        ingredients: [
            { name: 'Whey Fruité (Fraise/Framboise)', quantity: 30, unit: 'g', macros: { calories: 110, protein: 24, carbs: 2, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Banane', quantity: 1, unit: 'pièce', macros: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1 } },
            { name: 'Fruits rouges surgelés', quantity: 150, unit: 'g', macros: { calories: 75, protein: 1.5, carbs: 18, fat: 0.5, fiber: 4, sugar: 12, sodium: 0 } },
            { name: 'Eau ou eau de coco', quantity: 300, unit: 'ml', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Mixer jusqu\'à consistance lisse.'
        ],
        tags: ['post-workout', 'vegetarian', 'gluten-free'],
        goal: ['maintain', 'bulk']
    },
    {
        id: 'sh_005',
        name: 'Créatine Power Slush',
        description: 'Boisson d\'intra ou post-workout rafraîchissante.',
        category: 'shake',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 100,
            protein: 0,
            carbs: 25,
            fat: 0,
            fiber: 0,
            sugar: 25,
            sodium: 50
        },
        ingredients: [
            { name: 'Jus de raisin', quantity: 150, unit: 'ml', macros: { calories: 100, protein: 0, carbs: 25, fat: 0, fiber: 0, sugar: 25, sodium: 5 } },
            { name: 'Créatine Monohydrate', quantity: 5, unit: 'g', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Eau', quantity: 150, unit: 'ml', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Mélanger jus et créatine.',
            'Ajouter eau et glace pilée.'
        ],
        tags: ['vegan', 'post-workout', 'supplement'],
        goal: ['bulk', 'maintain', 'cut']
    }
];
