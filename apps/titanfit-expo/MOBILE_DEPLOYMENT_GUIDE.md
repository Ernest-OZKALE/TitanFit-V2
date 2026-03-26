# 📱 TitanFit Mobile - Guide de Déploiement APK & IPA

> **Statut** : En attente - À compléter quand le site web sera finalisé
> **Dernière mise à jour** : 22 Janvier 2026

---

## 📋 Sommaire

1. [Prérequis Généraux](#-prérequis-généraux)
2. [Build APK (Android)](#-build-apk-android)
3. [Build IPA (iOS)](#-build-ipa-ios)
4. [Fonctionnalités à Porter](#-fonctionnalités-à-porter-du-web)
5. [Checklist Finale](#-checklist-avant-lancement)

---

## 🔧 Prérequis Généraux

### Compte Expo
- ✅ Compte créé : `starwek` (ou ton username)
- ✅ EAS CLI installé : `npm install -g eas-cli`
- ✅ Projet initialisé avec EAS

### Commandes de base
```bash
# Se connecter à Expo
npx eas-cli login

# Vérifier le projet
npx eas-cli project:info
```

---

## 🤖 Build APK (Android)

### Option 1 : Build Cloud (Recommandé - Fonctionne depuis Windows)

```bash
cd titanfit-expo

# Build APK de preview (installable directement)
npx eas-cli build --platform android --profile preview
```

Le fichier `.apk` sera disponible en téléchargement sur le dashboard Expo.

### Option 2 : Build Local (Nécessite Android Studio)

```bash
# Générer le projet Android natif
npx expo prebuild --platform android

# Ouvrir dans Android Studio et builder
```

### Installation de l'APK
1. Télécharger le fichier `.apk` depuis Expo
2. Transférer sur le téléphone Android
3. Autoriser les "Sources inconnues" dans les paramètres
4. Installer l'APK

---

## 🍎 Build IPA (iOS)

### Option A : Avec Compte Apple Developer (99€/an)

```bash
# Build de production pour App Store
npx eas-cli build --platform ios --profile production

# Build de preview pour TestFlight
npx eas-cli build --platform ios --profile preview
```

### Option B : Re-Signing avec Certificat d'un Ami (GRATUIT)

#### Prérequis
- **Accès à un Mac** (emprunter pour une journée)
- **Certificat de ton ami** :
  - Fichier `.p12` (certificat de développeur)
  - Mot de passe du `.p12`
  - Fichier `.mobileprovision` (profil de provisioning)
- **Ton UDID iPhone** enregistré dans le profil

#### Étape 1 : Trouver ton UDID iPhone
1. Connecter l'iPhone au Mac
2. Ouvrir Finder (macOS Catalina+) ou iTunes
3. Cliquer sur l'iPhone dans la barre latérale
4. Cliquer sur les informations sous le nom de l'iPhone
5. L'UDID s'affiche (copier cette valeur)

#### Étape 2 : Ton ami doit faire
1. Se connecter à [Apple Developer Portal](https://developer.apple.com)
2. Aller dans "Devices" → "Add Device"
3. Ajouter ton UDID avec un nom descriptif
4. Aller dans "Profiles" → Créer/Éditer un profil "Development"
5. Inclure ton appareil dans le profil
6. Télécharger le nouveau `.mobileprovision`
7. Exporter le certificat en `.p12` depuis Keychain Access

#### Étape 3 : Build sur Mac
```bash
cd titanfit-expo

# Installer les dépendances
npm install

# Générer le projet iOS natif
npx expo prebuild --platform ios

# Ouvrir dans Xcode
open ios/TitanFit.xcworkspace
```

Dans Xcode :
1. Product → Archive
2. Exporter l'archive en `.ipa` (ou `.xcarchive`)

#### Étape 4 : Re-Signer l'IPA

**Avec Sideloadly** (Recommandé) :
1. Télécharger [Sideloadly](https://sideloadly.io/)
2. Connecter l'iPhone au Mac
3. Glisser l'IPA dans Sideloadly
4. Entrer l'Apple ID de ton ami (ou utiliser les certificats)
5. Cliquer "Start"

**Avec iOS App Signer** :
1. Télécharger iOS App Signer
2. Sélectionner le fichier `.ipa` ou `.app`
3. Choisir le certificat `.p12`
4. Choisir le profil `.mobileprovision`
5. Exporter l'IPA signé
6. Installer avec Xcode/Apple Configurator

### Option C : Simulateur iOS (100% Gratuit)

```bash
# Build pour simulateur uniquement
npx eas-cli build --platform ios --profile simulator
```

Le fichier `.app` fonctionne uniquement sur le simulateur iOS du Mac.

---

## 🔄 Fonctionnalités à Porter du Web

### ✅ Déjà Implémenté dans l'App Mobile
- [x] Dashboard avec stats du jour
- [x] Tracker de macros (calories, protéines, glucides, lipides)
- [x] Log de repas avec simulation IA
- [x] Données de santé (simulées dans Expo Go, réelles en natif)
- [x] Liste des programmes d'entraînement
- [x] Détails des exercices
- [x] Profil utilisateur avec objectifs
- [x] Thème dark/gold cohérent

### 📋 À Porter (Priorité Haute)
- [ ] **Scanner de code-barres** - Nécessite `expo-camera`
- [ ] **Bibliothèque de recettes** - Avec filtres et recherche
- [ ] **Photos de progression** - Galerie avec comparaisons
- [ ] **Graphiques de progression** - Charts détaillés

### 📋 À Porter (Priorité Moyenne)
- [ ] **Planificateur de repas** - Vue semaine
- [ ] **Liste de courses** - Génération automatique
- [ ] **Timer d'entraînement** - Avec notifications
- [ ] **Historique complet** - Tous les logs

### 📋 À Porter (Priorité Basse)
- [ ] **Fonctionnalités sociales** - Communauté, partage
- [ ] **Mode hors-ligne** - Sync locale
- [ ] **Widgets iOS/Android** - Stats rapides
- [ ] **Notifications push** - Rappels repas/entraînement

---

## ✅ Checklist Avant Lancement

### Préparation
- [ ] Toutes les fonctionnalités web prioritaires sont portées
- [ ] Tests sur simulateur iOS passés
- [ ] Tests sur émulateur Android passés
- [ ] Build APK testé sur appareil réel Android
- [ ] Build IPA testé sur appareil réel iOS

### Configuration
- [ ] `app.json` finalisé avec bonnes icônes et splash screen
- [ ] `eas.json` configuré pour tous les profils
- [ ] Certificats iOS préparés (si applicable)
- [ ] Keystore Android préparé (pour production)

### Assets
- [ ] Icône d'app (1024x1024)
- [ ] Splash screen
- [ ] Screenshots pour stores (si publication)

---

## 📁 Structure du Projet Mobile

```
titanfit-expo/
├── App.tsx                 # Point d'entrée, navigation
├── app.json                # Configuration Expo
├── eas.json                # Configuration EAS Build
├── package.json
│
├── src/
│   ├── screens/
│   │   ├── home/HomeScreen.tsx
│   │   ├── nutrition/NutritionScreen.tsx
│   │   ├── health/HealthScreen.tsx
│   │   ├── training/TrainingScreen.tsx
│   │   └── profile/ProfileScreen.tsx
│   │
│   ├── services/
│   │   ├── healthkit.ts    # Service HealthKit (réel/simulé)
│   │   └── api.ts          # API backend web
│   │
│   ├── theme/
│   │   └── index.ts        # Couleurs, typographie, styles
│   │
│   └── utils/
│       └── helpers.ts      # Utilitaires divers
│
└── ios/                    # Généré par expo prebuild
└── android/                # Généré par expo prebuild
```

---

## 🆘 Dépannage

### Erreur "PluginError: expo-camera"
```bash
# Installer le package manquant
npx expo install expo-camera
```

### Erreur de signature iOS
- Vérifier que l'UDID est dans le profil de provisioning
- Vérifier que le certificat n'est pas expiré
- Régénérer le profil si nécessaire

### Build Android échoue
```bash
# Nettoyer le cache
npx expo prebuild --clean --platform android
```

---

## 📞 Contacts & Ressources

- **Expo Documentation** : https://docs.expo.dev
- **EAS Build** : https://docs.expo.dev/build/introduction/
- **Sideloadly** : https://sideloadly.io/
- **Apple Developer Portal** : https://developer.apple.com

---

> 💡 **Note** : Ce guide sera mis à jour au fur et à mesure du développement de l'app mobile. Une fois le site web finalisé, nous porterons les fonctionnalités manquantes et procéderons aux builds finaux.
