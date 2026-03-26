import { IngredientDef } from './recipe-database';

// Base d'ingrédients communs pour le matching du frigo
// Les macros sont pour 100g
export const INGREDIENT_DB: IngredientDef[] = [
    // --- PROTEINES ---
    {
        id: 'chicken_breast',
        name: 'Blanc de Poulet',
        aliases: ['poulet', 'filet de poulet', 'chicken', 'volaille', 'escalope de poulet'],
        category: 'protein',
        macrosPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
        shelfLife: 2,
        substitutes: ['turkey_breast', 'tofu_firm']
    },
    {
        id: 'egg',
        name: 'Œuf',
        aliases: ['oeuf', 'oeufs', 'egg', 'eggs'],
        category: 'protein',
        macrosPer100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
        shelfLife: 21,
        substitutes: ['egg_whites']
    },
    {
        id: 'salmon',
        name: 'Saumon',
        aliases: ['pavé de saumon', 'poisson gras'],
        category: 'protein',
        macrosPer100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
        shelfLife: 2,
        substitutes: ['trout', 'mackrel']
    },
    {
        id: 'beef_5',
        name: 'Steak Haché 5%',
        aliases: ['boeuf', 'viande rouge', 'steak', 'bœuf maigre'],
        category: 'protein',
        macrosPer100g: { calories: 130, protein: 21, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 60 },
        shelfLife: 2,
        substitutes: ['chicken_breast']
    },
    {
        id: 'tuna_can',
        name: 'Thon en conserve',
        aliases: ['thon', 'tuna', 'boite de thon'],
        category: 'protein',
        macrosPer100g: { calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 300 },
        shelfLife: 365,
        substitutes: ['chicken_breast', 'salmon']
    },
    {
        id: 'whey',
        name: 'Whey Protéine',
        aliases: ['poudre protéinée', 'protein powder', 'isolat'],
        category: 'protein',
        macrosPer100g: { calories: 370, protein: 80, carbs: 4, fat: 2, fiber: 0, sugar: 2, sodium: 150 },
        shelfLife: 365,
        substitutes: []
    },
    {
        id: 'greek_yogurt',
        name: 'Yaourt Grec',
        aliases: ['skyr', 'fromage blanc', 'yoghurt'],
        category: 'dairy',
        macrosPer100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36 },
        shelfLife: 7,
        substitutes: ['cottage_cheese']
    },

    // --- GLUCIDES ---
    {
        id: 'rice_basmati',
        name: 'Riz Basmati',
        aliases: ['riz', 'rice', 'riz blanc'],
        category: 'carb',
        macrosPer100g: { calories: 350, protein: 7, carbs: 78, fat: 0.6, fiber: 1, sugar: 0, sodium: 5 },
        shelfLife: 365,
        substitutes: ['pasta', 'quinoa', 'potato']
    },
    {
        id: 'oats',
        name: 'Flocons d\'avoine',
        aliases: ['avoine', 'oatmeal', 'porridge'],
        category: 'carb',
        macrosPer100g: { calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, sugar: 0, sodium: 2 },
        shelfLife: 180,
        substitutes: ['granola']
    },
    {
        id: 'pasta',
        name: 'Pâtes',
        aliases: ['spaghetti', 'penne', 'macaroni', 'fusilli'],
        category: 'carb',
        macrosPer100g: { calories: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3, sugar: 2, sodium: 6 },
        shelfLife: 365,
        substitutes: ['rice_basmati']
    },
    {
        id: 'sweet_potato',
        name: 'Patate Douce',
        aliases: ['patate', 'sweet potato'],
        category: 'carb',
        macrosPer100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 55 },
        shelfLife: 14,
        substitutes: ['potato', 'rice_basmati']
    },
    {
        id: 'potato',
        name: 'Pomme de Terre',
        aliases: ['patate', 'pdt'],
        category: 'carb',
        macrosPer100g: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6 },
        shelfLife: 21,
        substitutes: ['sweet_potato']
    },

    // --- LEGUMES ---
    {
        id: 'broccoli',
        name: 'Brocolis',
        aliases: ['brocoli', 'fleurettes'],
        category: 'vegetable',
        macrosPer100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 },
        shelfLife: 4,
        substitutes: ['green_beans', 'spinach']
    },
    {
        id: 'spinach',
        name: 'Épinards',
        aliases: ['pousses épinard', 'spinach'],
        category: 'vegetable',
        macrosPer100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
        shelfLife: 3,
        substitutes: ['broccoli']
    },
    {
        id: 'tomato',
        name: 'Tomate',
        aliases: ['tomates', 'tomato'],
        category: 'vegetable',
        macrosPer100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
        shelfLife: 5,
        substitutes: []
    },
    {
        id: 'zucchini',
        name: 'Courgette',
        aliases: ['zucchini'],
        category: 'vegetable',
        macrosPer100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 2.5, sodium: 8 },
        shelfLife: 5,
        substitutes: ['eggplant']
    },

    // --- FRUITS ---
    {
        id: 'banana',
        name: 'Banane',
        aliases: ['banane'],
        category: 'fruit',
        macrosPer100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2, sodium: 1 },
        shelfLife: 4,
        substitutes: ['apple']
    },
    {
        id: 'apple',
        name: 'Pomme',
        aliases: ['pomme', 'pommes'],
        category: 'fruit',
        macrosPer100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
        shelfLife: 14,
        substitutes: ['pear']
    },
    {
        id: 'avocado',
        name: 'Avocat',
        aliases: ['avocat', 'avocado'],
        category: 'fat',
        macrosPer100g: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7 },
        shelfLife: 3,
        substitutes: []
    },

    // --- AUTRES ---
    {
        id: 'olive_oil',
        name: 'Huile d\'Olive',
        aliases: ['huile', 'oil'],
        category: 'fat',
        macrosPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2 },
        shelfLife: 365,
        substitutes: ['butter', 'coconut_oil']
    },
    {
        id: 'peanut_butter',
        name: 'Beurre de Cacahuète',
        aliases: ['peanut butter', 'beurre cacahuete'],
        category: 'fat',
        macrosPer100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, sodium: 17 },
        shelfLife: 90,
        substitutes: ['almond_butter']
    }
];
