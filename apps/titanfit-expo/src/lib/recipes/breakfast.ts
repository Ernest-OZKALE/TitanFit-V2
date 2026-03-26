import { RecipeFull } from '../recipe-database';

export const breakfastRecipes: RecipeFull[] = [
    {
        id: 'bk_001',
        name: 'Omelette Titan aux Épinards & Feta',
        description: 'Une omelette riche en protéines et en bons lipides pour démarrer la journée avec énergie.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 450,
            protein: 32,
            carbs: 4,
            fat: 34,
            fiber: 2,
            sugar: 2,
            sodium: 450
        },
        ingredients: [
            { name: 'Œufs entiers', quantity: 3, unit: 'pièce', macros: { calories: 210, protein: 18, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 210 } },
            { name: 'Épinards frais', quantity: 50, unit: 'g', macros: { calories: 12, protein: 1.5, carbs: 2, fat: 0, fiber: 1, sugar: 0, sodium: 40 } },
            { name: 'Feta', quantity: 40, unit: 'g', macros: { calories: 105, protein: 6, carbs: 1.5, fat: 8.5, fiber: 0, sugar: 1.5, sodium: 360 } },
            { name: 'Huile d\'olive', quantity: 1, unit: 'c.à.s', macros: { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Batre les œufs dans un bol avec sel et poivre.',
            'Chauffer l\'huile dans une poêle anti-adhésive.',
            'Verser les œufs et laisser cuire 1 minute.',
            'Ajouter les épinards et la feta émiettée sur une moitié.',
            'Plier l\'omelette et finir la cuisson 1-2 minutes.'
        ],
        tags: ['keto', 'high-protein', 'quick', 'gluten-free'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'bk_002',
        name: 'Pancakes Protéinés Banane-Avoine',
        description: 'La référence des petits-déjeuners fitness. Moelleux, rassasiants et parfaits pour le post-workout.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 10,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 520,
            protein: 35,
            carbs: 65,
            fat: 12,
            fiber: 8,
            sugar: 15,
            sodium: 200
        },
        ingredients: [
            { name: 'Flocons d\'avoine', quantity: 60, unit: 'g', macros: { calories: 230, protein: 8, carbs: 40, fat: 4, fiber: 6, sugar: 1, sodium: 0 } },
            { name: 'Whey Protéine Vanille', quantity: 30, unit: 'g', macros: { calories: 120, protein: 24, carbs: 2, fat: 1, fiber: 0, sugar: 1, sodium: 50 } },
            { name: 'Banane', quantity: 1, unit: 'pièce', macros: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1 } },
            { name: 'Œuf entier', quantity: 1, unit: 'pièce', macros: { calories: 70, protein: 6, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 70 } },
            { name: 'Lait d\'amande', quantity: 50, unit: 'ml', macros: { calories: 15, protein: 0.5, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 30 } }
        ],
        instructions: [
            'Mixer tous les ingrédients dans un blender jusqu\'à obtenir une pâte lisse.',
            'Chauffer une poêle légèrement huilée.',
            'Verser de petites louches de pâte.',
            'Retourner quand des bulles apparaissent.',
            'Servir chaud avec un peu de sirop d\'érable zéro calorie (optionnel).'
        ],
        tags: ['high-protein', 'vegetarian', 'meal-prep'],
        goal: ['bulk', 'maintain']
    },
    {
        id: 'bk_003',
        name: 'Avocado Toast & Œufs Mollets',
        description: 'Un classique indémodable riche en bonnes graisses et fibres.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 6,
        servings: 1,
        macros: {
            calories: 480,
            protein: 22,
            carbs: 35,
            fat: 28,
            fiber: 9,
            sugar: 3,
            sodium: 480
        },
        ingredients: [
            { name: 'Pain complet', quantity: 2, unit: 'tranche', macros: { calories: 200, protein: 8, carbs: 32, fat: 2, fiber: 4, sugar: 3, sodium: 300 } },
            { name: 'Avocat', quantity: 0.5, unit: 'pièce', macros: { calories: 160, protein: 2, carbs: 8, fat: 15, fiber: 7, sugar: 0, sodium: 5 } },
            { name: 'Œufs', quantity: 2, unit: 'pièce', macros: { calories: 140, protein: 12, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 140 } },
            { name: 'Jus de citron', quantity: 1, unit: 'c.à.c', macros: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
            { name: 'Piment d\'Espelette', quantity: 1, unit: 'pincée', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Plonger les œufs délicatement dans l\'eau bouillante et cuire 6 minutes pour un jaune coulant.',
            'Pendant ce temps, écraser l\'avocat avec le jus de citron, sel et piment.',
            'Griller le pain.',
            'Étaler l\'avocat sur les toasts et déposer les œufs écalés coupés en deux dessus.'
        ],
        tags: ['vegetarian', 'quick', 'balanced'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'bk_004',
        name: 'Porridge Crémeux Pomme-Cannelle',
        description: 'Le carburant d\'endurance par excellence. Digestion lente et énergie constante.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 410,
            protein: 18,
            carbs: 68,
            fat: 8,
            fiber: 10,
            sugar: 22,
            sodium: 150
        },
        ingredients: [
            { name: 'Flocons d\'avoine', quantity: 50, unit: 'g', macros: { calories: 190, protein: 6, carbs: 34, fat: 3, fiber: 5, sugar: 1, sodium: 0 } },
            { name: 'Lait demi-écrémé', quantity: 200, unit: 'ml', macros: { calories: 95, protein: 7, carbs: 10, fat: 3, fiber: 0, sugar: 10, sodium: 100 } },
            { name: 'Pomme', quantity: 1, unit: 'pièce', macros: { calories: 80, protein: 0, carbs: 22, fat: 0, fiber: 4, sugar: 18, sodium: 0 } },
            { name: 'Cannelle', quantity: 1, unit: 'c.à.c', macros: { calories: 6, protein: 0, carbs: 2, fat: 0, fiber: 1, sugar: 0, sodium: 0 } },
            { name: 'Noix', quantity: 10, unit: 'g', macros: { calories: 65, protein: 1.5, carbs: 1, fat: 6.5, fiber: 0.7, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Couper la pomme en dés.',
            'Dans une casserole, mélanger l\'avoine, le lait et la moitié des pommes.',
            'Cuire à feu doux 8-10 minutes en remuant.',
            'Ajouter la cannelle en fin de cuisson.',
            'Servir avec le reste des pommes fraîches et les noix concassées.'
        ],
        tags: ['vegetarian', 'high-carb', 'budget', 'meal-prep'],
        goal: ['bulk', 'maintain']
    },
    {
        id: 'bk_005',
        name: 'Skyr Bowl Fruits Rouges & Granola',
        description: 'Un bol ultra-rapide, très riche en protéines et frais. Idéal pour l\'été ou les matins pressés.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 350,
            protein: 35,
            carbs: 40,
            fat: 4,
            fiber: 6,
            sugar: 18,
            sodium: 120
        },
        ingredients: [
            { name: 'Skyr nature', quantity: 200, unit: 'g', macros: { calories: 140, protein: 22, carbs: 8, fat: 0.5, fiber: 0, sugar: 8, sodium: 100 } },
            { name: 'Fruits rouges surgelés (ou frais)', quantity: 100, unit: 'g', macros: { calories: 50, protein: 1, carbs: 10, fat: 0, fiber: 4, sugar: 6, sodium: 0 } },
            { name: 'Granola', quantity: 30, unit: 'g', macros: { calories: 140, protein: 4, carbs: 20, fat: 6, fiber: 2, sugar: 6, sodium: 20 } },
            { name: 'Miel', quantity: 1, unit: 'c.à.c', macros: { calories: 20, protein: 0, carbs: 5, fat: 0, fiber: 0, sugar: 5, sodium: 0 } }
        ],
        instructions: [
            'Verser le Skyr dans un bol.',
            'Ajouter les fruits rouges (les décongeler 1min au micro-ondes si besoin pour un effet coulis).',
            'Saupoudrer de granola pour le croquant.',
            'Un filet de miel pour la douceur.'
        ],
        tags: ['quick', 'high-protein', 'vegetarian', 'no-cook'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'bk_006',
        name: 'Smoothie "Green Giant" Detox',
        description: 'Un smoothie vert qui ne goûte pas l\'herbe. Riche en micronutriments et hydratant.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 280,
            protein: 25,
            carbs: 28,
            fat: 8,
            fiber: 6,
            sugar: 18,
            sodium: 150
        },
        ingredients: [
            { name: 'Whey Isolate Vanille', quantity: 25, unit: 'g', macros: { calories: 95, protein: 22, carbs: 1, fat: 0.5, fiber: 0, sugar: 0, sodium: 40 } },
            { name: 'Concombre', quantity: 50, unit: 'g', macros: { calories: 8, protein: 0, carbs: 2, fat: 0, fiber: 0, sugar: 1, sodium: 0 } },
            { name: 'Pomme verte', quantity: 0.5, unit: 'pièce', macros: { calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 2, sugar: 8, sodium: 0 } },
            { name: 'Épinards frais', quantity: 30, unit: 'g', macros: { calories: 7, protein: 1, carbs: 1, fat: 0, fiber: 1, sugar: 0, sodium: 20 } },
            { name: 'Avocat', quantity: 30, unit: 'g', macros: { calories: 50, protein: 0.5, carbs: 2, fat: 4.5, fiber: 2, sugar: 0, sodium: 2 } },
            { name: 'Eau de coco', quantity: 150, unit: 'ml', macros: { calories: 30, protein: 0, carbs: 7, fat: 0, fiber: 0, sugar: 6, sodium: 90 } },
            { name: 'Jus de citron vert', quantity: 1, unit: 'c.à.c', macros: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Mettre tous les ingrédients dans le blender.',
            'Mixer à haute vitesse jusqu\'à obtenir une texture lisse.',
            'Ajouter des glaçons pour plus de fraîcheur.'
        ],
        tags: ['vegan', 'quick', 'gluten-free', 'detox'],
        goal: ['cut', 'maintain']
    },
    {
        id: 'bk_007',
        name: 'Burrito Petit-Déj "Muscle Builder"',
        description: 'Un petit-déjeuner complet et portable. Plié et grillé pour un max de saveur.',
        category: 'breakfast',
        difficulty: 'Moyen',
        prepTime: 10,
        cookTime: 10,
        servings: 1,
        macros: {
            calories: 650,
            protein: 42,
            carbs: 55,
            fat: 28,
            fiber: 8,
            sugar: 3,
            sodium: 850
        },
        ingredients: [
            { name: 'Tortilla complète', quantity: 1, unit: 'pièce', macros: { calories: 180, protein: 5, carbs: 32, fat: 4, fiber: 3, sugar: 1, sodium: 350 } },
            { name: 'Œufs', quantity: 3, unit: 'pièce', macros: { calories: 210, protein: 18, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 210 } },
            { name: 'Haricots rouges', quantity: 50, unit: 'g', macros: { calories: 60, protein: 4, carbs: 10, fat: 0, fiber: 3, sugar: 0, sodium: 150 } },
            { name: 'Fromage râpé allégé', quantity: 30, unit: 'g', macros: { calories: 90, protein: 9, carbs: 1, fat: 6, fiber: 0, sugar: 0, sodium: 200 } },
            { name: 'Salsa', quantity: 2, unit: 'c.à.s', macros: { calories: 20, protein: 0, carbs: 4, fat: 0, fiber: 1, sugar: 2, sodium: 100 } }
        ],
        instructions: [
            'Brouiller les œufs dans une poêle.',
            'Réchauffer la tortilla quelques secondes.',
            'Déposer les œufs, les haricots rincés, le fromage et la salsa au centre.',
            'Plier les bords et rouler serré.',
            'Toaster le burrito fermé dans la poêle chaude 1min de chaque côté pour sceller.'
        ],
        tags: ['high-protein', 'meal-prep', 'bulk'],
        goal: ['bulk']
    },
    {
        id: 'bk_008',
        name: 'Chia Pudding Coco-Mangue',
        description: 'Préparé la veille, c\'est le petit-déjeuner "grab-and-go" par excellence. Texture onctueuse.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 380,
            protein: 12,
            carbs: 42,
            fat: 20,
            fiber: 14,
            sugar: 18,
            sodium: 40
        },
        ingredients: [
            { name: 'Graines de chia', quantity: 30, unit: 'g', macros: { calories: 145, protein: 5, carbs: 12, fat: 9, fiber: 10, sugar: 0, sodium: 0 } },
            { name: 'Lait de coco (boisson)', quantity: 200, unit: 'ml', macros: { calories: 60, protein: 0.5, carbs: 2, fat: 5, fiber: 0, sugar: 1, sodium: 30 } },
            { name: 'Mangue', quantity: 100, unit: 'g', macros: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1 } },
            { name: 'Noix de coco râpée', quantity: 10, unit: 'g', macros: { calories: 65, protein: 0.7, carbs: 2, fat: 6, fiber: 1.5, sugar: 0.7, sodium: 2 } }
        ],
        instructions: [
            'La veille : mélanger les graines de chia et le lait de coco. Bien remuer pour éviter les grumeaux.',
            'Laisser reposer 10min, remuer encore, puis frigo toute la nuit.',
            'Le matin : ajouter les dés de mangue et la coco râpée sur le dessus.'
        ],
        tags: ['vegan', 'meal-prep', 'gluten-free', 'no-cook'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'bk_009',
        name: 'English Muffin Saumon Fumé',
        description: 'Plus léger qu\'un bagel, mais tout aussi satisfaisant. Le plein d\'oméga-3.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 390,
            protein: 24,
            carbs: 32,
            fat: 18,
            fiber: 3,
            sugar: 2,
            sodium: 980
        },
        ingredients: [
            { name: 'English Muffin complet', quantity: 1, unit: 'pièce', macros: { calories: 140, protein: 6, carbs: 26, fat: 1, fiber: 3, sugar: 2, sodium: 250 } },
            { name: 'Fromage frais (type St Morêt léger)', quantity: 30, unit: 'g', macros: { calories: 50, protein: 3, carbs: 1, fat: 4, fiber: 0, sugar: 1, sodium: 180 } },
            { name: 'Saumon fumé', quantity: 60, unit: 'g', macros: { calories: 110, protein: 14, carbs: 0, fat: 6, fiber: 0, sugar: 0, sodium: 500 } },
            { name: 'Câpres', quantity: 1, unit: 'c.à.c', macros: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 50 } },
            { name: 'Aneth', quantity: 1, unit: 'pincée', macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Couper le muffin en deux et le toaster.',
            'Tartiner de fromage frais.',
            'Déposer le saumon fumé.',
            'Garnir de câpres, aneth et poivre noir.'
        ],
        tags: ['quick', 'pescatarian', 'balanced'],
        goal: ['maintain', 'cut']
    },
    {
        id: 'bk_010',
        name: 'Bol de Cottage Cheese Salé',
        description: 'Alternative ultra-protéinée si vous n\'aimez pas le sucré le matin. Très rassasiant.',
        category: 'breakfast',
        difficulty: 'Facile',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        macros: {
            calories: 280,
            protein: 32,
            carbs: 12,
            fat: 10,
            fiber: 3,
            sugar: 6,
            sodium: 650
        },
        ingredients: [
            { name: 'Cottage Cheese', quantity: 200, unit: 'g', macros: { calories: 180, protein: 24, carbs: 6, fat: 8, fiber: 0, sugar: 6, sodium: 600 } },
            { name: 'Concombre', quantity: 50, unit: 'g', macros: { calories: 8, protein: 0, carbs: 2, fat: 0, fiber: 0.5, sugar: 1, sodium: 0 } },
            { name: 'Tomates cerises', quantity: 50, unit: 'g', macros: { calories: 10, protein: 0.5, carbs: 2, fat: 0, fiber: 1, sugar: 1.5, sodium: 5 } },
            { name: 'Graines de tournesol', quantity: 10, unit: 'g', macros: { calories: 60, protein: 2, carbs: 2, fat: 5, fiber: 1, sugar: 0, sodium: 0 } }
        ],
        instructions: [
            'Verser le cottage cheese dans un bol.',
            'Couper concombres et tomates en dés.',
            'Mélanger le tout avec sel, poivre et ciboulette.',
            'Saupoudrer de graines pour le croquant.'
        ],
        tags: ['vegetarian', 'high-protein', 'keto', 'quick'],
        goal: ['cut', 'maintain']
    }
];
