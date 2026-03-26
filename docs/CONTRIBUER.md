# Contribuer à TitanFit V2

Merci de l'intérêt que vous portez à l'évolution de l'écosystème Titan Architect ! Voici comment vous pouvez contribuer de manière professionnelle.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- Un compte Supabase
- Git

### Installation Locale
```bash
# 1. Cloner le projet
git clone https://github.com/Ernest-OZKALE/TitanFit-V2.git
cd TitanFit-V2/apps/web-app

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Remplissez vos clés privées
```

---

## 💻 Workflow de Développement

### 1. Création de Branche
```bash
git checkout -b feature/ma-nouvelle-fonctionnalité
# ou
git checkout -b fix/correction-bug
```

### 2. Normes de Codage
- Utilisez **TypeScript** pour tout nouveau code.
- Suivez les conventions **Tailwind CSS** pour le styling.
- Commentez votre code complexe en **Français**.

### 3. Conventions de Commit
Nous utilisons la convention [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Mise en forme, UI

---

## 🧪 Tests & Qualité
Avant de proposer un changement :
1. Lancez les tests unitaires : `npm test`.
2. Vérifiez que le build passe : `npm run build`.
3. Assurez-vous qu'il n'y a pas d'erreurs de linting.

---
*Ensemble, construisons le futur du fitness intelligent.*
