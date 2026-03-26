'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { getLocaleFromCookie, defaultLocale, type Locale } from '@/i18n/config';

export default function IntlProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

    useEffect(() => {
        const currentLocale = getLocaleFromCookie();
        setLocale(currentLocale);

        // Dynamic import of messages
        import(`../../messages/${currentLocale}.json`)
            .then((mod) => setMessages(mod.default))
            .catch(() => {
                // Fallback to default locale
                import(`../../messages/${defaultLocale}.json`)
                    .then((mod) => setMessages(mod.default));
            });
    }, []);

    if (!messages) {
        return <>{children}</>;
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
