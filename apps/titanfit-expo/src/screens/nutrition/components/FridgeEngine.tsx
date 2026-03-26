import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../../theme';
import { Search, Plus, X, ChefHat, ArrowRight } from 'lucide-react-native';
import { INGREDIENT_DB } from '../../../lib/ingredient-db';
import { ALL_RECIPES } from '../../../lib/recipes';
import { RecipeFull } from '../../../lib/recipe-database';

export default function FridgeEngine() {
    const [query, setQuery] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<typeof INGREDIENT_DB>([]);
    const [matchedRecipes, setMatchedRecipes] = useState<{ recipe: RecipeFull, matchCount: number, missingCount: number }[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Filter suggestions when typing
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const matches = INGREDIENT_DB.filter(ing =>
            ing.name.toLowerCase().includes(query.toLowerCase()) ||
            ing.aliases.some((alias: string) => alias.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5); // Limit to top 5

        setSuggestions(matches);
    }, [query]);

    const addIngredient = (id: string) => {
        if (!selectedIngredients.includes(id)) {
            setSelectedIngredients([...selectedIngredients, id]);
        }
        setQuery('');
        setSuggestions([]);
        setHasSearched(false);
    };

    const removeIngredient = (id: string) => {
        setSelectedIngredients(selectedIngredients.filter(i => i !== id));
        setHasSearched(false);
    };

    const findRecipes = () => {
        if (selectedIngredients.length === 0) return;

        // Simple matching logic
        // 1. Get all recipe ingredients
        // 2. Check if they exist in selectedIngredients (mapped by ID/aliases)
        // Note: Real logic would need robust mapping. Here we do simple name matching for demo.
        // We actually need to map Recipe Ingredient Names to DB IDs. 
        // For this V1, let's map DB ID back to Name for checking.

        const selectedNames = selectedIngredients.map(id => {
            const def = INGREDIENT_DB.find(d => d.id === id);
            return def ? [def.name.toLowerCase(), ...def.aliases] : [];
        }).flat();

        const results = ALL_RECIPES.map(recipe => {
            let matchCount = 0;
            recipe.ingredients.forEach(ing => {
                const ingName = ing.name.toLowerCase();
                // Check if any selected ingredient name is present in the recipe ingredient name
                if (selectedNames.some(uName => ingName.includes(uName) || uName.includes(ingName))) {
                    matchCount++;
                }
            });

            return {
                recipe,
                matchCount,
                missingCount: recipe.ingredients.length - matchCount
            };
        })
            .filter(r => r.matchCount > 0)
            .sort((a, b) => b.matchCount - a.matchCount);

        setMatchedRecipes(results);
        setHasSearched(true);
    };

    const getIngredientName = (id: string) => {
        return INGREDIENT_DB.find(i => i.id === id)?.name || id;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Qu'y a-t-il dans ton frigo ?</Text>
            <Text style={styles.subtitle}>Sélectionne tes ingrédients, Titan trouve les recettes.</Text>

            {/* SEARCH INPUT */}
            <View style={styles.inputContainer}>
                <Search size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.input}
                    placeholder="Chercher un ingrédient (ex: Poulet)"
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
                <View style={styles.suggestionsList}>
                    {suggestions.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.suggestionItem}
                            onPress={() => addIngredient(item.id)}
                        >
                            <Text style={styles.suggestionText}>{item.name}</Text>
                            <Plus size={16} color={colors.primary} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* SELECTED CHIPS */}
            <View style={styles.chipsContainer}>
                {selectedIngredients.map(id => (
                    <TouchableOpacity
                        key={id}
                        style={styles.chip}
                        onPress={() => removeIngredient(id)}
                    >
                        <Text style={styles.chipText}>{getIngredientName(id)}</Text>
                        <X size={14} color="#FFF" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* ACTION BUTTON */}
            <TouchableOpacity
                style={[
                    styles.searchButton,
                    selectedIngredients.length === 0 && styles.searchButtonDisabled
                ]}
                onPress={findRecipes}
                disabled={selectedIngredients.length === 0}
            >
                <ChefHat size={24} color="#000" />
                <Text style={styles.searchButtonText}>
                    {selectedIngredients.length === 0
                        ? "Ajoute des ingrédients..."
                        : "Trouver des recettes"}
                </Text>
            </TouchableOpacity>

            {/* RESULTS */}
            {hasSearched && (
                <View style={styles.resultsArea}>
                    <Text style={styles.sectionTitle}>{matchedRecipes.length} Recettes trouvées</Text>
                    {matchedRecipes.map((item, index) => (
                        <TouchableOpacity key={item.recipe.id} style={styles.resultCard}>
                            <View style={styles.resultContent}>
                                <Text style={styles.resultTitle}>{item.recipe.name}</Text>
                                <Text style={styles.resultMeta}>
                                    {item.matchCount} ingr. matchés • {item.recipe.prepTime} min
                                </Text>
                            </View>
                            <ArrowRight size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                    {matchedRecipes.length === 0 && (
                        <Text style={styles.noResultText}>Aucune recette compatible trouvée.</Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },

    // Input
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 50,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        color: colors.text,
        fontSize: fontSize.md,
    },

    // Suggestions
    suggestionsList: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    suggestionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    suggestionText: {
        color: colors.text,
    },

    // Chips
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        gap: 6,
    },
    chipText: {
        color: '#000', // Black on Orange
        fontWeight: '600',
        fontSize: fontSize.sm,
    },

    // Button
    searchButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    searchButtonDisabled: {
        backgroundColor: colors.backgroundSecondary,
        opacity: 0.5,
    },
    searchButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: fontSize.md,
        textTransform: 'uppercase',
    },

    // Results
    resultsArea: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.md,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    resultContent: {
        flex: 1,
    },
    resultTitle: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: fontSize.md,
        marginBottom: 4,
    },
    resultMeta: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
    },
    noResultText: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.lg,
        fontStyle: 'italic',
    }
});
