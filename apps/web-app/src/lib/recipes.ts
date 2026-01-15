// Recipe suggestions based on calorie targets

export interface Recipe {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prepTime: number; // minutes
    difficulty: 'Facile' | 'Moyen' | 'Difficile';
    ingredients: string[];
    instructions: string[];
    tags: string[];
}

export const recipes: Recipe[] = [
    {
        id: '1',
        name: 'Poulet Grillé aux Légumes',
        calories: 450,
        protein: 48,
        carbs: 32,
        fat: 12,
        prepTime: 25,
        difficulty: 'Facile',
        ingredients: [
            '200g poulet',
            '150g brocoli',
            '100g patate douce',
            '1 c.s. huile d\'olive',
            'Épices au choix'
        ],
        instructions: [
            'Préchauffer le four à 200°C',
            'Assaisonner le poulet et le placer au four',
            'Cuire les légumes à la vapeur',
            'Servir ensemble'
        ],
        tags: ['Protéiné', 'Faible en gras', 'Post-workout']
    },
    {
        id: '2',
        name: 'Bowl Saumon-Avocat-Quinoa',
        calories: 580,
        protein: 35,
        carbs: 45,
        fat: 24,
        prepTime: 20,
        difficulty: 'Facile',
        ingredients: [
            '150g saumon',
            '100g quinoa cuit',
            '1/2 avocat',
            'Épinards frais',
            'Citron et graines'
        ],
        instructions: [
            'Cuire le saumon à la poêle',
            'Préparer le quinoa selon instructions',
            'Assembler le bowl avec épinards et avocat',
            'Assaisonner au citron'
        ],
        tags: ['Oméga-3', 'Équilibré', 'Rapide']
    },
    {
        id: '3',
        name: 'Omelette Protéinée',
        calories: 320,
        protein: 32,
        carbs: 8,
        fat: 18,
        prepTime: 10,
        difficulty: 'Facile',
        ingredients: [
            '4 œufs',
            '30g fromage blanc',
            'Champignons',
            'Tomates',
            'Épinards'
        ],
        instructions: [
            'Battre les œufs avec le fromage blanc',
            'Faire revenir les légumes',
            'Verser les œufs et cuire',
            'Plier en deux et servir'
        ],
        tags: ['Petit-déjeuner', 'Faible en glucides', 'Rapide']
    },
    {
        id: '4',
        name: 'Riz Basmati au Bœuf et Légumes',
        calories: 620,
        protein: 42,
        carbs: 68,
        fat: 16,
        prepTime: 30,
        difficulty: 'Moyen',
        ingredients: [
            '150g bœuf haché maigre',
            '150g riz basmati',
            'Poivrons, oignons',
            'Sauce soja',
            'Ail et gingembre'
        ],
        instructions: [
            'Cuire le riz basmati',
            'Faire revenir le bœuf avec ail et gingembre',
            'Ajouter les légumes',
            'Mélanger avec le riz et assaisonner'
        ],
        tags: ['Prise de masse', 'Complet', 'Asiatique']
    },
    {
        id: '5',
        name: 'Wrap Thon-Avocat',
        calories: 420,
        protein: 28,
        carbs: 38,
        fat: 16,
        prepTime: 10,
        difficulty: 'Facile',
        ingredients: [
            '1 tortilla complète',
            '120g thon en conserve',
            '1/2 avocat',
            'Salade, tomates',
            'Moutarde'
        ],
        instructions: [
            'Égoutter le thon',
            'Étaler la moutarde sur la tortilla',
            'Ajouter tous les ingrédients',
            'Roller et découper'
        ],
        tags: ['Déjeuner', 'Rapide', 'Sans cuisson']
    }
];

export function suggestRecipes(targetCalories: number, maxResults: number = 3): Recipe[] {
    // Sort by proximity to target calories
    return recipes
        .sort((a, b) => Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories))
        .slice(0, maxResults);
}

export function filterRecipesByTag(tag: string): Recipe[] {
    return recipes.filter(r => r.tags.includes(tag));
}
