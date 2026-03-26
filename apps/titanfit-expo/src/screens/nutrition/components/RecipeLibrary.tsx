import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../../theme';
import { Clock, Flame, ChefHat, Filter, X } from 'lucide-react-native';
import { ALL_RECIPES } from '../../../lib/recipes';

const CATEGORIES = [
    { id: 'all', label: 'Tout' },
    { id: 'breakfast', label: 'Petit-Déj' },
    { id: 'lunch', label: 'Déjeuner' },
    { id: 'dinner', label: 'Dîner' },
    { id: 'snack', label: 'Collation' },
    { id: 'shake', label: 'Shakes' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / 2;

export default function RecipeLibrary() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    const filteredRecipes = ALL_RECIPES.filter(recipe => {
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderRecipeCard = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setSelectedRecipe(item)}
        >
            <View style={styles.imagePlaceholder}>
                <ChefHat size={32} color={colors.textSecondary} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>

                <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                        <Clock size={12} color={colors.textMuted} />
                        <Text style={styles.metaText}>{item.prepTime + item.cookTime}min</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Flame size={12} color={colors.primary} />
                        <Text style={[styles.metaText, { color: colors.primary }]}>{item.macros.calories}</Text>
                    </View>
                </View>

                <View style={styles.tagsContainer}>
                    <View style={[styles.tag, { backgroundColor: colors.protein + '20' }]}>
                        <Text style={[styles.tagText, { color: colors.protein }]}>{item.macros.protein}g P</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* FILTERS */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedCategory === item.id && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedCategory(item.id)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === item.id && styles.filterTextActive
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* GRID */}
            <FlatList
                data={filteredRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucune recette trouvée.</Text>
                    </View>
                }
            />

            {/* DETAIL MODAL */}
            <Modal
                visible={!!selectedRecipe}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedRecipe(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle} numberOfLines={1}>{selectedRecipe?.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedRecipe(null)} style={styles.closeButton}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* RECIPE CONTENT MOCK */}
                        <View style={{ padding: 20 }}>
                            <Text style={{ color: colors.textSecondary }}>Détails bientôt disponibles...</Text>
                            {/* Will implement full detail view later */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Filters
    filterContainer: {
        marginBottom: spacing.lg,
    },
    filterList: {
        paddingHorizontal: spacing.sm,
        gap: spacing.sm,
    },
    filterChip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundSecondary,
        // Light shadow for unselected
        ...shadows.card,
        borderWidth: 0,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        // Gold glow
        ...shadows.glow,
    },
    filterText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    filterTextActive: {
        color: '#000', // Black on Gold
        fontWeight: 'bold',
    },

    // Grid
    gridContent: {
        paddingBottom: 100,
        paddingHorizontal: spacing.xs,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.xl,
        borderWidth: 0, // Clean look
        marginBottom: 4, // Spacing for shadow
        // Premium Shadow
        ...shadows.card,
        shadowOpacity: 0.08, // Slightly stronger
        elevation: 6,
    },
    imagePlaceholder: {
        height: 120, // Taller image
        backgroundColor: colors.backgroundTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        padding: spacing.md,
    },
    cardTitle: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.xs,
        height: 44, // Align cards
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        marginTop: spacing.xs,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.backgroundTertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    metaText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: borderRadius.sm,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Empty
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: fontSize.md,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay, // Darker blur shim
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 32, // More rounded
        borderTopRightRadius: 32,
        height: '92%',
        ...shadows.floating,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 0, // No border, just clean space
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: '900', // Titan Bold
        color: colors.text,
        flex: 1,
        marginRight: spacing.md,
        fontStyle: 'italic',
    },
    closeButton: {
        padding: 8,
        backgroundColor: colors.backgroundTertiary,
        borderRadius: borderRadius.full,
    }
});
