# 🏋️ Titan Architect - Portail Écosystème (Monorepo)

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

Bienvenue sur le centre de pilotage de **Titan Architect**. Ce monorepo héberge une plateforme de coaching sportif et nutritionnel de pointe, intégrant une architecture "AI-first" et une gamification profonde.

---

## 🏛️ Vision Architecturale

Pourquoi cette architecture ? Titan Architect a été conçu pour la **scalabilité administrative** et l'**agilité mobile**.

- **Structure Monorepo** : Centralisation du code pour une cohérence totale entre le web, le mobile et l'infrastructure. Cela facilite la maintenance et le partage de types TypeScript entre les plateformes.
- **Strategie AI Hybride (Hydra)** : Utilisation combinée de l'IA locale (Ollama) pour la confidentialité et de l'IA Cloud (Gemini 1.5 Flash) pour la puissance pure. Une solution résiliente et "privacy-ready".
- **Backend Serverless (Supabase)** : Exploitation maximale des fonctions PostgreSQL et du RLS (Row Level Security) pour une sécurité granulaire sans surcouche complexe.

---

## 📁 Organisation du Dépôt

- **[🚀 Applications (apps/)](./apps)** : 
    - **`web-app`** : Dashboard Next.js (React 19, Turbopack).
    - **`titanfit-mobile`** : Version mobile native (Expo/React Native).
- **[🏛️ Infrastructure (infrastructure/)](./infrastructure)** : Schémas SQL optimisés et politiques de sécurité.
- **[📚 Documentation (docs/)](./docs)** : Guides de déploiement, roadmap et audits techniques (100% Français).
- **[🛠️ Scripts (scripts/)](./scripts)** : Automatisations de sauvegarde et outils de maintenance.

---

## ✨ Fonctionnalités Majeures (Cœur Titan)

1. **🧠 L'Esprit Titan (IA)** : Coaching personnalisé, analyse des charges et gestion émotionnelle de la nutrition.
2. **🏆 Gamification Avancée** : Système d'XP, niveaux et quêtes dynamiques pour transformer le fitness en aventure.
3. **📊 Analytics Biométriques** : Intégration théorique des données VFC, Sommeil et Récupération (Bevel Score).
4. **🏢 CMS Admin Complet** : Gestion totale des utilisateurs, du contenu et des stocks de produits via une interface dédiée.

---

## 📄 Inventaire Technique (22 Pages)
L'écosystème comprend **15 pages utilisateur** (Dashboard, Social, Logs IA) et **7 pages d'administration** (Gestion CMS, Analytics), offrant une couverture fonctionnelle exhaustive.

---

## 🚀 Déploiement & Setup Rapide

### Production (Vercel)
- **Root Directory** : `apps/web-app`
- **Variables** : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`.

### Développement Local
```bash
git clone https://github.com/Ernest-OZKALE/TitanFit-V2.git
cd apps/web-app
npm install
npm run dev
```

---

## 📊 Performance & Qualité
Le projet maintient un **Score Lighthouse de 90+**. L'architecture privilégie le **Clean Code**, le typage strict et la séparation des responsabilités via les Hooks et le Context API.

---
*Ce dépôt est le témoin d'une maîtrise technique moderne et d'une vision axée sur l'expérience utilisateur et la sécurité des données.*
