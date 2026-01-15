# ⚡ TitanFit V2 - L'Expérience Fitness Ultime

Bienvenue dans **TitanFit V2**, la plateforme de coaching sportif nouvelle génération. Conçue pour les athlètes exigeants, elle allie suivi de performance de pointe et intelligence artificielle hybride.

## 🌟 Fonctionnalités Clés

### 🧠 Coach IA "L'Esprit Titan" (Nouveau !)
Un assistant personnel intelligent qui analyse vos données physiologiques en temps réel.
- **Architecture Hybride (Hydra)** :
  - **Local (Prioritaire)** : Détecte automatiquement si [Ollama](https://ollama.com) tourne sur votre machine (`localhost:11434`) pour une confidentialité totale et 0 censure.
  - **Cloud (Backup)** : Bascule instantanément sur **Google Gemini 1.5 Flash** si Ollama n'est pas disponible, avec les filtres de sécurité désactivés pour permettre des conseils physiologiques précis (règles, corps, digestion).
- **Conscience Physiologique** : Adapte les conseils en fonction de votre cycle menstruel, votre VFC (Variabilité Fréquence Cardiaque) et votre niveau de fatigue.

### 📊 Dashboard Performance
- Suivi avancé des charges progressives.
- Analyse graphique de la forme du jour.
- Intégration des données de santé (via simulation ou API futures).

### 🍎 Nutrition & Récupération
- Plans nutritionnels adaptatifs.
- Suivi de l'hydratation et du sommeil.

## 🛠️ Installation & Démarrage

### Prérequis
- Node.js 18+
- Un compte [Supabase](https://supabase.com) (pour la DB)
- Une clé API Google Gemini (optionnel si utilisation 100% locale)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/titanfit-v2.git
cd titanfit-v2/web-app
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration
Créez un fichier `.env.local` à la racine :
```ini
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
GEMINI_API_KEY=votre_cle_gemini
# Optionnel : URL de votre serveur Ollama distant (par défaut: http://127.0.0.1:11434)
# OLLAMA_API_URL=http://mon-serveur-linux:11434
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 🤖 Guide IA Locale (Ollama)

Pour une confidentialité totale et une gratuité à vie :
1. Téléchargez [Ollama](https://ollama.com).
2. Lancez la commande : `ollama run mistral`.
3. C'est tout ! TitanFit détectera automatiquement le cerveau local.

---
*Développé avec passion pour la performance.*
