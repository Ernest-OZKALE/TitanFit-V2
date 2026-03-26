# TitanFit V2 - Guide de Configuration de l'Internationalisation (i18n)

## 🌍 Présentation

Ce guide explique comment mettre en place le support multi-langues pour TitanFit V2 en utilisant le App Router de Next.js et la bibliothèque `next-intl`.

---

## 📦 Installation

```bash
npm install next-intl
```

---

## 🗂️ Structure du Projet

```
src/
├── app/
│   ├── [locale]/          # Routes segmentées par langue
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
├── i18n/
│   ├── config.ts          # Définition des langues supportées
│   └── request.ts         # Chargement des messages
└── messages/
    ├── fr.json            # Traductions françaises
    ├── en.json            # Traductions anglaises
    └── es.json            # Traductions espagnoles
```

---

## ⚙️ Configuration

### 1. Configuration i18n
Définition des locales et de la langue par défaut.

### 2. Middleware
Le middleware gère la détection automatique de la langue du navigateur et la redirection vers le préfixe approprié (`/fr`, `/en`).

---

## 📝 Gestion des Traductions
Les fichiers JSON dans `/messages` contiennent les clés de traduction structurées par page ou composant.

---

## 💻 Utilisation dans les Composants

### Composants Serveur
```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

---

## ✅ Bonnes Pratiques
- **Namespacing** : Organisez vos clés par fonctionnalité (ex: `Admin.Users.title`).
- **Type Safety** : Générez des types TypeScript à partir de vos fichiers JSON pour éviter les erreurs de clés manquantes.
- **Paramètres** : Utilisez les accolades pour les variables dynamiques dans vos textes (ex: `"welcome": "Bienvenue, {name} !"`).

---
**Dernière mise à jour** : Mars 2026  
**Support technique** : i18n-team@titanfit.com
