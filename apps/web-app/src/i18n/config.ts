export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export function getLocaleFromCookie(): Locale {
    if (typeof window === 'undefined') return defaultLocale;

    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='));

    const value = cookie?.split('=')[1];
    return locales.includes(value as Locale) ? value as Locale : defaultLocale;
}

export function setLocaleCookie(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
}
