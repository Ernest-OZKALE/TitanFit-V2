'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'es';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const defaultContext: I18nContextType = {
    language: 'fr',
    setLanguage: () => { },
    t: (key: string) => key
};

const I18nContext = createContext<I18nContextType>(defaultContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('fr');
    const [translations, setTranslations] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                // In a real app, we would import these dynamically to avoid bundling all languages
                // For this demo, we'll fetch them or import them if they were reliable imports
                // Since we created them as files, let's assume we fetch them
                // But for simplicity in this implementation, I'll hardcode the loading logic to fetch from public or similar
                // ACTUALLY: Best approach for Next.js client component without complex setup is valid imports if files are accessible
                // Let's use a simple fetch approach to the local files we just created if they were in public, 
                // but they are in src/locales. Let's use a dynamic import map.

                const fr = await import('@/locales/fr.json');
                const en = await import('@/locales/en.json');
                const es = await import('@/locales/es.json');

                setTranslations({
                    fr: fr.default,
                    en: en.default,
                    es: es.default
                });
            } catch (error) {
                console.error('Failed to load translations', error);
            }
        };
        loadTranslations();
    }, []);

    const t = (path: string) => {
        const keys = path.split('.');
        let current = translations[language];

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return path; // Fallback to key if not found
            }
        }
        return typeof current === 'string' ? current : path;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
