import { Metadata } from 'next';

/**
 * SEO Utilities for TitanFit V2
 * Generate consistent metadata and structured data
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://titanfit.app';
const SITE_NAME = 'TitanFit';
const DEFAULT_DESCRIPTION = 'Application fitness premium avec suivi nutritionnel, entraînements personnalisés, et coaching IA. Transformez votre corps avec TitanFit.';

// ============================================
// METADATA GENERATORS
// ============================================

interface PageMetadata {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    path?: string;
}

export function generateMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    image = '/og-image.png',
    noIndex = false,
    path = '',
}: PageMetadata): Metadata {
    const fullTitle = title === 'TitanFit' ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    return {
        title: fullTitle,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
            locale: 'fr_FR',
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
        },
        robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    };
}

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================

// Organization Schema
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TitanFit',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: [
            'https://twitter.com/titanfit',
            'https://instagram.com/titanfit',
            'https://facebook.com/titanfit',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'support@titanfit.app',
            contactType: 'customer support',
        },
    };
}

// Software Application Schema (for App stores)
export function generateSoftwareApplicationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TitanFit',
        operatingSystem: 'Web',
        applicationCategory: 'HealthApplication',
        offers: [
            {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Plan gratuit',
            },
            {
                '@type': 'Offer',
                price: '9.99',
                priceCurrency: 'EUR',
                description: 'Titan Pro - Mensuel',
            },
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
        },
        description: DEFAULT_DESCRIPTION,
    };
}

// FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.url}`,
        })),
    };
}

// Article Schema (for blog posts)
export function generateArticleSchema(article: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Person',
            name: article.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'TitanFit',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}${article.url}`,
        },
    };
}

// Exercise Schema
export function generateExerciseSchema(exercise: {
    name: string;
    description: string;
    muscleGroup: string;
    difficulty: string;
    equipment?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ExercisePlan',
        name: exercise.name,
        description: exercise.description,
        exerciseType: exercise.muscleGroup,
        intensity: exercise.difficulty,
        equipment: exercise.equipment,
    };
}

// Recipe Schema (for Fridge Alchemist)
export function generateRecipeSchema(recipe: {
    name: string;
    description: string;
    image?: string;
    prepTime: string;
    cookTime: string;
    calories: number;
    protein: number;
    ingredients: string[];
    instructions: string[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        nutrition: {
            '@type': 'NutritionInformation',
            calories: `${recipe.calories} calories`,
            proteinContent: `${recipe.protein}g`,
        },
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.instructions.map((step, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text: step,
        })),
    };
}

// ============================================
// JSON-LD COMPONENT
// ============================================

export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// ============================================
// EXPORT ALL
// ============================================

export const seo = {
    generateMetadata,
    generateOrganizationSchema,
    generateSoftwareApplicationSchema,
    generateFAQSchema,
    generateBreadcrumbSchema,
    generateArticleSchema,
    generateExerciseSchema,
    generateRecipeSchema,
    JsonLd,
};
