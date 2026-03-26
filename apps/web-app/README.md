# ⚡ TitanFit V2 - L'Expérience Fitness Ultime

Bienvenue dans **TitanFit V2**, la plateforme de coaching sportif nouvelle génération développée avec Next.js 16. Conçue pour les athlètes exigeants, elle allie suivi de performance de pointe et intelligence artificielle de pointe.

## 🌟 Fonctionnalités Majeures

### 🧠 Coach IA "L'Esprit Titan"
Un assistant personnel intelligent qui analyse vos données physiologiques et nutritionnelles.
- **Architecture Hybride (Hydra)** :
  - **Local (Ollama)** : Détecteur automatique de serveur local (`localhost:11434`) pour une confidentialité totale.
  - **Cloud (Gemini)** : Bascule sur Google Gemini 1.5 Flash pour une intelligence maximale sans interruption.
- **Contextualisation Avancée** : Réponses basées sur le profil utilisateur, les derniers repas et les séances d'entraînement.

### 📊 Dashboard de Performance
- Suivi des charges progressives sur vos exercices.
- Visualisation interactive de la progression (Calories, Poids, XP).
- Système de quêtes dynamiques pour maintenir la motivation.

### 🍎 Nutrition & Récupération
- Journal alimentaire avec calcul automatique des macros.
- Tags émotionnels pour comprendre les habitudes alimentaires.
- Détection des "cravings" et conseils de gestion immédiats.

---

## 🛠️ Installation & Démarrage

### Prérequis
- **Node.js 18+**
- Un compte **Supabase** (Base de données & Auth)
- Une clé API **Google Gemini** (Optionnel si usage local)

### 1. Clonage et Dépendances
```bash
git clone https://github.com/Ernest-OZKALE/TitanFit-V2.git
cd apps/web-app
npm install
```

### 2. Configuration Environnement (.env.local)
```ini
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
GEMINI_API_KEY=votre_cle_gemini
```

### 3. Lancer le Développement
```bash
npm run dev
```

---

## 🏁 Déploiement Vercel
Le projet est optimisé pour Vercel. 
- **Root Directory** : `apps/web-app`
- **Framework** : Next.js
- **Build Command** : `npm run build`

---
*Ce projet démontre une utilisation avancée de Next.js, de l'IA générative et des architectures scalables.*
