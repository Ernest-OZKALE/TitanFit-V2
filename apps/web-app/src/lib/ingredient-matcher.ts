import { RecipeFull, Ingredient } from './recipe-database';
import { INGREDIENT_DB } from './ingredient-db';

interface MatchResult {
    recipe: RecipeFull;
    score: number; // 0 to 100
    missingIngredients: Ingredient[];
    matchedCount: number;
}

// Normalize text: remove accents, numbers, and lowercase
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/œ/g, 'oe')
        .replace(/æ/g, 'ae')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (é -> e, etc.)
        .replace(/[0-9]+/g, '') // Remove numbers
        .trim();
}

export function findRecipesByIngredients(userIngredients: string[], allRecipes: RecipeFull[]): MatchResult[] {
    const normalizedUserIngs = userIngredients.map(i => normalizeText(i));

    if (normalizedUserIngs.length === 0) return [];

    const results: MatchResult[] = allRecipes.map(recipe => {
        let matchedCount = 0;
        const missingIngs: Ingredient[] = [];

        recipe.ingredients.forEach(recipeIng => {
            const recipeIngName = normalizeText(recipeIng.name);

            // Check direct match or fuzzy match via DB aliases
            const isMatch = normalizedUserIngs.some(userIng => {
                if (recipeIngName.includes(userIng) || userIng.includes(recipeIngName)) return true;

                // Deep alias check
                const dbEntry = INGREDIENT_DB.find(db =>
                    db.aliases.some(alias => recipeIngName.includes(alias))
                );

                if (dbEntry) {
                    return dbEntry.aliases.some(alias =>
                        normalizedUserIngs.some(ui => ui.includes(alias) || alias.includes(ui))
                    );
                }

                return false;
            });

            if (isMatch) {
                matchedCount++;
            } else {
                // Ignore basic pantry items from missing list (optional)
                if (!['eau', 'sel', 'poivre', 'huile'].some(s => recipeIngName.includes(s))) {
                    missingIngs.push(recipeIng);
                }
            }
        });

        // Calculate Score
        // Base score = % of ingredients matched
        // Bonus for matching core macromolecules (Protein/Carb sources) can be added later
        const matchPercentage = (matchedCount / recipe.ingredients.length) * 100;

        return {
            recipe,
            score: Math.round(matchPercentage),
            missingIngredients: missingIngs,
            matchedCount
        };
    });

    // Filter out low scores (e.g., < 30% match) and sort by highest score
    return results
        .filter(r => r.score > 20)
        .sort((a, b) => b.score - a.score);
}

export function suggestIngredients(query: string): string[] {
    if (query.length < 2) return [];
    const normalizedQuery = normalizeText(query);

    return INGREDIENT_DB
        .filter(ing => normalizeText(ing.name).includes(normalizedQuery) || ing.aliases.some(a => normalizeText(a).includes(normalizedQuery)))
        .map(ing => ing.name)
        .slice(0, 5);
}
