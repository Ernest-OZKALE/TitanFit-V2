import { ScannedProduct, getTitanVerdict, Macros } from './recipe-database';

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product/';

export async function fetchProductByBarcode(barcode: string): Promise<ScannedProduct | null> {
    try {
        const response = await fetch(`${OFF_API_BASE}${barcode}?fields=product_name,brands,image_url,nutriments,nutriscore_grade,nova_group,ecoscore_grade,additives_tags,allergens_tags,serving_size`);

        if (!response.ok) return null;

        const data = await response.json();

        if (data.status === 0 || !data.product) return null;

        const p = data.product;

        // Map Nutrition
        const macros: Macros = {
            calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
            protein: p.nutriments.proteins_100g || 0,
            carbs: p.nutriments.carbohydrates_100g || 0,
            fat: p.nutriments.fat_100g || 0,
            fiber: p.nutriments.fiber_100g || 0,
            sugar: p.nutriments.sugars_100g || 0,
            sodium: (p.nutriments.salt_100g || 0) * 400 // salt to sodium (approx mg)
        };

        const additives = p.additives_tags || [];
        const verdict = getTitanVerdict(
            p.nutriscore_grade?.toUpperCase() || 'unknown',
            p.nova_group,
            additives
        );

        let verdictReason = "";
        if (verdict === 'excellent') verdictReason = "Excellent équilibre nutritionnel et peu transformé.";
        else if (verdict === 'bon') verdictReason = "Bonne option, mais attention aux portions.";
        else if (verdict === 'moyen') verdictReason = "Produit transformé ou déséquilibré. À consommer avec modération.";
        else verdictReason = "Ultra-transformé ou très mauvais profil. Évitez si possible.";

        return {
            barcode,
            name: p.product_name || "Produit Inconnu",
            brand: p.brands || "Marque inconnue",
            imageUrl: p.image_url,
            nutriScore: (p.nutriscore_grade?.toUpperCase() as any) || 'unknown',
            novaGroup: p.nova_group || null,
            ecoScore: (p.ecoscore_grade?.toUpperCase() as any) || 'unknown',
            titanVerdict: verdict,
            verdictReason,
            macrosPer100g: macros,
            servingSize: p.serving_size || 100,
            additives: additives.map((a: string) => a.replace('en:', '')),
            allergens: (p.allergens_tags || []).map((a: string) => a.replace('en:', '')),
            scannedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
