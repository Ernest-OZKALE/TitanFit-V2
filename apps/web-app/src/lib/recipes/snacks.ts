import { RecipeFull } from '../recipe-database';

export const snackRecipes: RecipeFull[] = [
    {
        id: 'sn_001',
        name: 'Energy Balls Dattes-Cacao',
        description: 'La bouchée d\'énergie parfaite avant l\'entraînement. Naturelle et explosive.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 0,
        servings: 1, // 2 balls
        macros: {
            calories: 180,
            protein: 4,
            carbs: 25,
            fat: 8,
            fiber: 4,
            sugar: 18,
            sodium: 5
        },
        ingredients: [
            { name: 'Dattes Medjool', quantity: 2, unit: 'pièce', macros: { calories: 130, protein: 1, carbs: 36, fat: 0, fiber: 3, sugar: 32, sodium: 0 } },
            { name: 'Amandes', quantity: 10, unit: 'g', macros: { calories: 60, protein: 2, carbs: 2, fat: 5, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Cacao non sucré', quantity: 1, unit: 'c.à.c', macros: { calories: 10, protein: 1, carbs: 1, fat: 0.5, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Flocons d\'avoine', quantity: 10, unit: 'g', macros: { calories: 38, protein: 1.5, carbs: 7, fat: 0.5, fiber: 1, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Dénoyauter les dattes.',
            'Mixer tous les ingrédients jusqu\'à obtenir une pâte collante.',
            'Former des boules avec les mains humides.',
            'Réfrigérer 15 min avant de déguster.'
        ],
        tags: ['vegan', 'quick', 'energy', 'pre-workout', 'no-cook'],
        goal: ['bulk', 'maintain']
    },
    {
        id: 'sn_002',
        name: 'Tartine Beurre de Cacahuète & Banane',
        description: 'Simple, efficace, riche en protéines et glucides. Le classique.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 290,
            protein: 10,
            carbs: 35,
            fat: 14,
            fiber: 5,
            sugar: 14,
            sodium: 150
        },
        ingredients: [
            { name: 'Pain complet', quantity: 1, unit: 'tranche', macros: { calories: 100, protein: 4, carbs: 16, fat: 1, fiber: 2, sugar: 1, sodium: 150 } },
            { name: 'Beurre de cacahuète 100%', quantity: 15, unit: 'g', macros: { calories: 90, protein: 4, carbs: 3, fat: 8, fiber: 1, sugar: 1, sodium: 0 } },
            { name: 'Banane', quantity: 0.5, unit: 'pièce', macros: { calories: 50, protein: 0.5, carbs: 14, fat: 0, fiber: 1.5, sugar: 7, sodium: 0 } },
            { name: 'Cannelle', quantity: 1, unit: 'pincée', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Toaster le pain.',
            'Étaler le beurre de cacahuète.',
            'Disposer les rondelles de banane.',
            'Saupoudrer de cannelle.'
        ],
        tags: ['vegetarian', 'quick', 'budget', 'balanced'],
        goal: ['bulk', 'maintain']
    },
    {
        id: 'sn_003',
        name: 'Œufs Durs & Amandes',
        description: 'Le combo protéine/lipide parfait pour caler une faim sans pic d\'insuline.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 220,
            protein: 16,
            carbs: 4,
            fat: 16,
            fiber: 2,
            sugar: 1,
            sodium: 140
        },
        ingredients: [
            { name: 'Œufs', quantity: 2, unit: 'pièce', macros: { calories: 140, protein: 12, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 140 } },
            { name: 'Amandes', quantity: 15, unit: 'g', macros: { calories: 90, protein: 3, carbs: 3, fat: 8, fiber: 2, sugar: 1, sodium: 0 } }
        ],
        instructions: [
            'Cuire les œufs 10 min dans l\'eau bouillante.',
            'Refroidir et écailler.',
            'Manger avec les amandes (non salées de préférence).'
        ],
        tags: ['keto', 'paleo', 'gluten-free', 'high-protein'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'sn_004',
        name: 'Yaourt Grec & Baies',
        description: 'Protéines à digestion lente (caséine) idéal avant de dormir ou en collation.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 140,
            protein: 15,
            carbs: 12,
            fat: 0,
            fiber: 2,
            sugar: 8,
            sodium: 60
        },
        ingredients: [
            { name: 'Yaourt Grec 0%', quantity: 150, unit: 'g', macros: { calories: 90, protein: 15, carbs: 6, fat: 0, fiber: 0, sugar: 6, sodium: 60 } },
            { name: 'Myrtilles', quantity: 50, unit: 'g', macros: { calories: 30, protein: 0.5, carbs: 7, fat: 0, fiber: 1.5, sugar: 5, sodium: 0 } },
            { name: 'Stévia (optionnel)', quantity: 1, unit: 'pincée', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Mélanger le yaourt et les baies.',
            'Sucrer si besoin.'
        ],
        tags: ['vegetarian', 'high-protein', 'low-fat', 'quick'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'sn_005',
        name: 'Cottage Cheese & Bâtonnets de Légumes',
        description: 'Volume alimentaire maximal pour un minimum de calories. Top pour la sèche.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 180,
            protein: 22,
            carbs: 10,
            fat: 5,
            fiber: 3,
            sugar: 6,
            sodium: 500
        },
        ingredients: [
            { name: 'Cottage Cheese léger', quantity: 150, unit: 'g', macros: { calories: 120, protein: 18, carbs: 5, fat: 2, fiber: 0, sugar: 4, sodium: 450 } },
            { name: 'Carotte', quantity: 1, unit: 'pièce', macros: { calories: 25, protein: 0.5, carbs: 6, fat: 0, fiber: 2, sugar: 3, sodium: 40 } },
            { name: 'Concombre', quantity: 100, unit: 'g', macros: { calories: 15, protein: 1, carbs: 4, fat: 0, fiber: 0.5, sugar: 2, sodium: 2 } }
        ],
        instructions: [
            'Couper les légumes en bâtonnets.',
            'Tremper dans le cottage cheese assaisonné (ciboulette, poivre).'
        ],
        tags: ['vegetarian', 'high-protein', 'volume-eating', 'cut'],
        goal: ['cut']
    },
    {
        id: 'sn_006',
        name: 'Pomme & Beurre d\'Amande',
        description: 'Sucré, croquant et satiétant. Les fibres et le gras ralentissent la digestion.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 220,
            protein: 4,
            carbs: 25,
            fat: 12,
            fiber: 6,
            sugar: 18,
            sodium: 0
        },
        ingredients: [
            { name: 'Pomme', quantity: 1, unit: 'pièce', macros: { calories: 80, protein: 0, carbs: 22, fat: 0, fiber: 4, sugar: 18, sodium: 0 } },
            { name: 'Beurre d\'amande', quantity: 20, unit: 'g', macros: { calories: 130, protein: 4, carbs: 3, fat: 12, fiber: 2, sugar: 1, sodium: 0 } }
        ],
        instructions: [
            'Couper la pomme en quartiers.',
            'Tartiner de beurre d\'amande.'
        ],
        tags: ['vegan', 'quick', 'gluten-free'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'sn_007',
        name: 'Rolls de Dinde & Avocat',
        description: 'Protéines pures et bons gras. Zéro glucides.',
        category: 'snack',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 180,
            protein: 20,
            carbs: 2,
            fat: 10,
            fiber: 3,
            sugar: 0,
            sodium: 400
        },
        ingredients: [
            { name: 'Tranche de dinde', quantity: 3, unit: 'tranche', macros: { calories: 90, protein: 18, carbs: 0, fat: 1.5, fiber: 0, sugar: 0, sodium: 300 } },
            { name: 'Avocat', quantity: 0.25, unit: 'pièce', macros: { calories: 80, protein: 1, carbs: 4, fat: 7, fiber: 3, sugar: 0, sodium: 2 } }
        ],
        instructions: [
            'Étaler les tranches de dinde.',
            'Placer une lamelle d\'avocat au centre.',
            'Rouler et maintenir avec un cure-dent si besoin.'
        ],
        tags: ['keto', 'high-protein', 'gluten-free', 'paleo'],
        goal: ['cut', 'maintain']
    }
];
