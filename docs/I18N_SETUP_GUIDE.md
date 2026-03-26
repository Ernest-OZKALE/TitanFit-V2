# TitanFit V2 - Internationalization (i18n) Setup Guide

## 🌍 Overview

This guide explains how to set up multi-language support for TitanFit V2 using Next.js 13+ App Router and `next-intl`.

---

## 📦 Installation

```bash
npm install next-intl
```

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── admin/
│   │   └── ...
│   └── api/
├── i18n/
│   ├── config.ts
│   └── request.ts
└── messages/
    ├── fr.json
    ├── en.json
    └── es.json
```

---

## ⚙️ Configuration

### 1. i18n Config

File: `src/i18n/config.ts`

```typescript
export const locales = ['fr', 'en', 'es'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};
```

### 2. Request Configuration

File: `src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

### 3. Next.js Config

File: `next.config.js`

```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

module.exports = withNextIntl({
  // ... rest of your Next.js config
});
```

### 4. Middleware

File: `src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't prefix default locale
});

export const config = {
  matcher: ['/', '/(fr|en|es)/:path*', '/((?!api|_next|.*\\..*).*)'],
};
```

---

## 📝 Translation Files

### French (fr.json)

```json
{
  "HomePage": {
    "title": "TitanFit",
    "subtitle": "L'excellence physique redéfinie",
    "cta": "Améliorer Mon Entraînement",
    "signIn": "Se Connecter",
    "features": {
      "social": {
        "title": "Réseau Social",
        "description": "Connectez-vous avec des athlètes"
      },
      "analytics": {
        "title": "Analytics Avancées",
        "description": "Suivez vos progrès en détail"
      },
      "ai": {
        "title": "IA de Personnalisation",
        "description": "Programmes adaptés à vos objectifs"
      },
      "gamification": {
        "title": "Gamification",
        "description": "Badges, niveaux, et défis"
      }
    }
  },
  "Admin": {
    "dashboard": "Tableau de Bord",
    "users": "Utilisateurs",
    "products": "Produits",
    "orders": "Commandes",
    "settings": "Paramètres"
  },
  "Common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "search": "Rechercher"
  }
}
```

### English (en.json)

```json
{
  "HomePage": {
    "title": "TitanFit",
    "subtitle": "Physical excellence redefined",
    "cta": "Upgrade My Training",
    "signIn": "Sign In",
    "features": {
      "social": {
        "title": "Social Network",
        "description": "Connect with athletes"
      },
      "analytics": {
        "title": "Advanced Analytics",
        "description": "Track your progress in detail"
      },
      "ai": {
        "title": "AI Personalization",
        "description": "Programs adapted to your goals"
      },
      "gamification": {
        "title": "Gamification",
        "description": "Badges, levels, and challenges"
      }
    }
  },
  "Admin": {
    "dashboard": "Dashboard",
    "users": "Users",
    "products": "Products",
    "orders": "Orders",
    "settings": "Settings"
  },
  "Common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search"
  }
}
```

---

## 💻 Usage in Components

### Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('cta')}</button>
    </div>
  );
}
```

### Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const t = useTranslations('Common');
  
  return (
    <form>
      <button type="submit">{t('save')}</button>
      <button type="button">{t('cancel')}</button>
    </form>
  );
}
```

### With Parameters

```typescript
const t = useTranslations('HomePage');

// Translation: "Welcome, {name}!"
<h1>{t('welcome', { name: user.name })}</h1>

// Pluralization: "You have {count} message(s)"
<p>{t('messages', { count: messageCount })}</p>
```

---

## 🔄 Language Switcher Component

File: `src/components/LanguageSwitcher.tsx`

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Add new locale
    const newPath = newLocale === 'fr' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    router. push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
```

---

## 🌐 SEO with i18n

### Metadata

```typescript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://titanfit.com/${locale}`,
      languages: {
        'fr-FR': 'https://titanfit.com/fr',
        'en-US': 'https://titanfit.com/en',
        'es-ES': 'https://titanfit.com/es',
      },
    },
  };
}
```

---

## 📊 Number & Date Formatting

```typescript
import { useFormatter } from 'next-intl';

export default function PriceDisplay() {
  const format = useFormatter();
  
  const price = 99.99;
  const date = new Date();
  
  return (
    <div>
      {/* Currency: €99,99 or $99.99 */}
      <p>{format.number(price, { style: 'currency', currency: 'EUR' })}</p>
      
      {/* Date: 13/01/2026 or 01/13/2026 */}
      <p>{format.dateTime(date, { dateStyle: 'short' })}</p>
      
      {/* Relative time: "il y a 2 heures" or "2 hours ago" */}
      <p>{format.relativeTime(date)}</p>
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. Organize by Feature

```
messages/
├── fr/
│   ├── common.json
│   ├── home.json
│   ├── admin.json
│   └── errors.json
├── en/
└── es/
```

### 2. Use Namespaces

```typescript
const t = useTranslations('Admin.Users');
t('title'); // "Gestion des Utilisateurs"
```

### 3. Extract Common Strings

```json
{
  "Common": {
    "actions": {
      "save": "Enregistrer",
      "cancel": "Annuler",
      "delete": "Supprimer"
    }
  }
}
```

### 4. Type Safety

```typescript
// Generate types from translations
type Messages = typeof import('./messages/fr.json');
declare global {
  interface IntlMessages extends Messages {}
}
```

---

## 🚀 Migration Checklist

- [ ] Install `next-intl`
- [ ] Create translation files (fr.json, en.json, es.json)
- [ ] Set up middleware
- [ ] Update Next.js config
- [ ] Convert components to use `useTranslations()`
- [ ] Add language switcher to navbar
- [ ] Test all pages in multiple languages
- [ ] Update SEO metadata
- [ ] Configure hreflang tags

---

**Last Updated**: 2026-01-13  
**Version**: 1.0  
**Supported Languages**: FR, EN, ES
