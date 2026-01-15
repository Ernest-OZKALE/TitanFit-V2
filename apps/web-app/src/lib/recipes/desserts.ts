import { RecipeFull } from '../recipe-database';

export const dessertRecipes: RecipeFull[] = [
    {
        id: 'ds_001',
        name: 'Mousse au Chocolat l\'Avocat',
        description: 'Incroyablement onctueuse, riche en fibres et bons gras. 100% bluffant.',
        category: 'dessert',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 0,
        servings: 2, // 2 portions
        macros: {
            calories: 220,
            protein: 4,
            carbs: 18,
            fat: 16,
            fiber: 8,
            sugar: 8,
            sodium: 10
        },
        ingredients: [
            { name: 'Avocat mûr', quantity: 1, unit: 'pièce', macros: { calories: 320, protein: 4, carbs: 17, fat: 29, fiber: 13, sugar: 1, sodium: 14 } },
            { name: 'Cacao non sucré', quantity: 30, unit: 'g', macros: { calories: 70, protein: 6, carbs: 3, fat: 3, fiber: 9, sugar: 0, sodium: 0 } },
            { name: 'Sirop d\'érable', quantity: 2, unit: 'c.à.s', macros: { calories: 100, protein: 0, carbs: 26, fat: 0, fiber: 0, sugar: 24, sodium: 5 } },
            { name: 'Lait d\'amande', quantity: 50, unit: 'ml', macros: { calories: 10, protein: 0.2, carbs: 0, fat: 0.5, fiber: 0, sugar: 0, sodium: 20 } },
            { name: 'Vanille', quantity: 1, unit: 'c.à.c', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Mixer la chair de l\'avocat jusqu\'à ce qu\'elle soit parfaitement lisse.',
            'Ajouter le cacao, le sirop, le lait et la vanille.',
            'Mixer à nouveau pour aérer la mousse.',
            'Réfrigérer 1h avant de servir.'
        ],
        tags: ['vegan', 'gluten-free', 'healthy-fat'],
        goal: ['maintain', 'bulk']
    },
    {
        id: 'ds_002',
        name: 'Nice Cream Banane-Framboise',
        description: 'Glace instantanée sans sucre ajouté ni produits laitiers.',
        category: 'dessert',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 160,
            protein: 2,
            carbs: 40,
            fat: 1,
            fiber: 8,
            sugar: 25,
            sodium: 0
        },
        ingredients: [
            { name: 'Banane congelée', quantity: 1, unit: 'pièce', macros: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1 } },
            { name: 'Framboises congelées', quantity: 100, unit: 'g', macros: { calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 6, sugar: 4, sodium: 0 } },
            { name: 'Jus de citron', quantity: 1, unit: 'c.à.c', macros: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Placer les fruits congelés dans un blender puissant.',
            'Mixer par à-coups en raclant les bords jusqu\'à obtenir une texture de glace italienne.',
            'Servir immédiatement.'
        ],
        tags: ['vegan', 'low-fat', 'raw', 'paleo'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'ds_003',
        name: 'Mug Cake Protéiné Chocolat',
        description: 'Une envie de gâteau en 2 minutes ? Riche en protéines et moelleux.',
        category: 'dessert',
        difficulty: 'Facile',
        prepTime: 2,
        cookTime: 1,
        servings: 1,
        macros: {
            calories: 250,
            protein: 25,
            carbs: 20,
            fat: 8,
            fiber: 4,
            sugar: 2,
            sodium: 200
        },
        ingredients: [
            { name: 'Whey Chocolat', quantity: 30, unit: 'g', macros: { calories: 120, protein: 24, carbs: 2, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Farine d\'avoine ou coco', quantity: 10, unit: 'g', macros: { calories: 40, protein: 1, carbs: 7, fat: 1, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Cacao non sucré', quantity: 1, unit: 'c.à.c', macros: { calories: 10, protein: 1, carbs: 1, fat: 0.5, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Lait', quantity: 50, unit: 'ml', macros: { calories: 25, protein: 1.5, carbs: 2.5, fat: 1, fiber: 0, sugar: 2.5, sodium: 25 } },
            { name: 'Levure chimique', quantity: 0.5, unit: 'c.à.c', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 100 } },
            { name: 'Pépites chocolat noir', quantity: 5, unit: 'g', macros: { calories: 25, protein: 0, carbs: 3, fat: 1.5, fiber: 0, sugar: 2, sodium: 0 } }
        ],
        instructions: [
            'Mélanger tous les ingrédients secs dans un mug.',
            'Ajouter le lait et mélanger pour obtenir une pâte.',
            'Cuire au micro-ondes 45-60 secondes (ne pas trop cuire !).',
            'Laisser tiédir 1 min.'
        ],
        tags: ['high-protein', 'quick', 'vegetarian'],
        goal: ['bulk', 'maintain']
    }
];
