import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../../theme';
import { ShoppingCart, Check, Plus, Trash2 } from 'lucide-react-native';

const INITIAL_LIST = [
    { id: '1', name: 'Blancs de poulet', category: 'Protéines', checked: false },
    { id: '2', name: 'Riz Basmati', category: 'Féculents', checked: true },
    { id: '3', name: 'Brocolis', category: 'Légumes', checked: false },
    { id: '4', name: 'Oeufs', category: 'Protéines', checked: false },
    { id: '5', name: 'Huile d\'olive', category: 'Condiments', checked: false },
];

export default function ShoppingList() {
    const [items, setItems] = useState(INITIAL_LIST);
    const [newItemName, setNewItemName] = useState('');

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const addItem = () => {
        if (!newItemName.trim()) return;
        const newItem = {
            id: Date.now().toString(),
            name: newItemName,
            category: 'Divers',
            checked: false
        };
        setItems([...items, newItem]);
        setNewItemName('');
    };

    const clearChecked = () => {
        setItems(items.filter(item => !item.checked));
    };

    // Group by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof items>);

    return (
        <View style={styles.container}>
            {/* INPUT */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ajouter un article..."
                    placeholderTextColor={colors.textMuted}
                    value={newItemName}
                    onChangeText={setNewItemName}
                    onSubmitEditing={addItem}
                />
                <TouchableOpacity onPress={addItem} style={styles.addButton}>
                    <Plus size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {Object.keys(groupedItems).map(category => (
                    <View key={category} style={styles.section}>
                        <Text style={styles.sectionTitle}>{category}</Text>
                        {groupedItems[category].map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.itemRow, item.checked && styles.itemRowChecked]}
                                onPress={() => toggleItem(item.id)}
                            >
                                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                                    {item.checked && <Check size={14} color="#FFF" />}
                                </View>
                                <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {items.length === 0 && (
                    <View style={styles.emptyState}>
                        <ShoppingCart size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>Votre liste est vide</Text>
                    </View>
                )}
            </ScrollView>

            {items.some(i => i.checked) && (
                <TouchableOpacity style={styles.clearButton} onPress={clearChecked}>
                    <Trash2 size={20} color="#FFF" />
                    <Text style={styles.clearButtonText}>Supprimer les articles cochés</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 50,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addButton: {
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSize.sm,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: spacing.md,
        marginBottom: 2,
        borderRadius: borderRadius.md,
    },
    itemRowChecked: {
        opacity: 0.6,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.textMuted,
        marginRight: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    itemText: {
        fontSize: fontSize.md,
        color: colors.text,
        fontWeight: '500',
    },
    itemTextChecked: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontSize: fontSize.md,
    },
    clearButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: colors.error,
        padding: spacing.md,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    clearButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    }
});
