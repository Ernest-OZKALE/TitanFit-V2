# TitanFit V2 - Liste de Contrôle du Déploiement

Ce document fournit une liste complète des étapes nécessaires pour déployer TitanFit V2 en production avec succès.

## 🚀 Liste de Pré-Déploiement

### 1. Configuration de l'Environnement ✅
- [ ] Copier `.env.example` en `.env.local`
- [ ] Remplir les identifiants Supabase (URL, Anon Key)
- [ ] Configurer les clés Stripe (Publishable + Secret) pour les paiements.
- [ ] Paramétrer les identifiants SMTP pour les emails.
- [ ] Ajouter l'ID de mesure Google Analytics.
- [ ] Configurer l'URL du site et les métadonnées SEO.
- [ ] Activer les drapeaux de sécurité (2FA, limitation de débit).

### 2. Configuration de la Base de Données ✅
- [ ] Exécuter les migrations Supabase : `infrastructure/database/*.sql`
- [ ] Créer les buckets de stockage :
  - `media` (lecture publique)
  - `private-uploads` (privé)
- [ ] Configurer les politiques de sécurité (RLS - Row Level Security).
- [ ] Insérer les données initiales (seed).
- [ ] Créer le premier compte administrateur.

### 3. Authentification & Sécurité ✅
- [ ] Configurer les fournisseurs d'authentification Supabase (Email, Google, etc.).
- [ ] Paramétrer les modèles d'email (Bienvenue, Réinitialisation de mot de passe).
- [ ] Vérifier que le RLS est activé sur TOUTES les tables.
- [ ] Configurer les origines CORS autorisées.
- [ ] Activer le HTTPS forcé.
- [ ] Configurer les en-têtes CSP (Content Security Policy).

### 4. Tests & Performance ✅
- [ ] Lancer le build : `npm run build`
- [ ] Vérifier la taille du bundle (< 500KB recommandé).
- [ ] Lancer un audit Lighthouse (score attendu > 90).
- [ ] Optimiser les images au format WebP.
- [ ] Lancer les tests unitaires : `npm test`.

---

## 📦 Plateformes de Déploiement

### Vercel (Recommandé)
```bash
# Configuration :
Root Directory: apps/web-app
Framework: Next.js
Build Command: npm run build
```

---

## 🔄 Post-Déploiement

### Actions Immédiates (0-1h)
- [ ] Vérifier que le site est accessible en ligne.
- [ ] Tester le flux d'inscription et de connexion.
- [ ] Surveiller les logs d'erreurs en temps réel.
- [ ] Vérifier la réception des emails de bienvenue.

---
**Dernière mise à jour :** Mars 2026  
**Équipe :** Architecture Titan Architect
