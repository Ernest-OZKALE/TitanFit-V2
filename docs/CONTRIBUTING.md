# Contributing to TitanFit V2

Merci de contribuer à TitanFit V2 ! Ce guide vous aidera à démarrer.

---

## 📋 Table des Matières

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Faites preuve d'empathie envers les autres membres

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Git
- Compte Supabase (gratuit)
- VS Code (recommandé)

### Setup rapide

```bash
# 1. Fork & Clone
git clone https://github.com/VOTRE_USERNAME/titanfit-v2.git
cd titanfit-v2/web-app

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Éditer .env.local avec vos clés

# 4. Setup database
# Exécuter supabase/titan_cms_v2.sql dans Supabase SQL Editor
# Exécuter supabase/seed.sql pour données de test

# 5. Start dev server
npm run dev
```

---

## 💻 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/ma-nouvelle-feature
# ou
git checkout -b fix/correction-bug
```

**Convention de nommage:**
- `feature/` - Nouvelles fonctionnalités
- `fix/` - Corrections de bugs
- `docs/` - Documentation
- `refactor/` - Refactoring
- `test/` - Tests

### 2. Make Changes

- Écrivez du code propre et lisible
- Ajoutez des tests si applicable
- Suivez les coding standards
- Testez localement

### 3. Commit

```bash
git add .
git commit -m "feat: ajouter fonctionnalité X"
```

### 4. Push & PR

```bash
git push origin feature/ma-nouvelle-feature
```

Puis créer une Pull Request sur GitHub.

---

## 📐 Coding Standards

### TypeScript

```typescript
// ✅ BON
interface User {
  id: string;
  email: string;
  name: string;
}

function getUserById(id: string): Promise<User | null> {
  // ...
}

// ❌ MAUVAIS
function getUser(id: any): any {
  // ...
}
```

### React Components

```typescript
// ✅ BON - Functional component avec types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ MAUVAIS - Props non typées
export function Button(props) {
  return <button>{props.label}</button>;
}
```

### File Organization

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # Composants réutilisables
│   ├── ui/          # Composants UI de base
│   └── features/    # Composants métier
├── lib/             # Utilitaires
│   ├── utils.ts     # Helpers génériques
│   ├── supabase.ts  # Client Supabase
│   └── constants.ts # Constantes
└── types/           # Types TypeScript
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_USERS`)
- **Files**: kebab-case (`user-profile.tsx`) ou PascalCase pour composants

### CSS/Tailwind

```typescript
// ✅ BON - Classes organisées
<div className="
  flex flex-col items-center justify-center
  p-4 md:p-8
  bg-white dark:bg-black
  rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">

// ❌ MAUVAIS - Classes en désordre
<div className="hover:shadow-lg p-4 flex bg-white rounded-lg md:p-8 shadow-md flex-col transition-shadow items-center dark:bg-black justify-center">
```

---

## 📝 Commit Guidelines

Nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, missing semi colons, etc.
- `refactor`: Refactoring du code
- `test`: Ajout de tests
- `chore`: Maintenance (dependencies, etc.)

### Exemples

```bash
feat(auth): ajouter connexion avec Google

Permet aux utilisateurs de se connecter via OAuth Google.
Ajoute le bouton et la logique dans LoginPage.

Closes #123

---

fix(dashboard): corriger crash au chargement

Le dashboard crashait quand l'utilisateur n'avait pas de données.
Ajout d'une vérification null et d'un état de chargement.

---

docs(readme): mettre à jour instructions d'installation

---

test(api): ajouter tests pour endpoint /users
```

---

## 🔄 Pull Request Process

### Checklist

Avant de soumettre votre PR, vérifiez:

- [ ] Le code compile sans erreurs (`npm run build`)
- [ ] Les tests passent (`npm test`)
- [ ] Le linting passe (`npm run lint`)
- [ ] La documentation est à jour
- [ ] Les commits suivent la convention
- [ ] La PR a une description claire
- [ ] Les screenshots sont inclus (si changement UI)

### Template PR

```markdown
## Description
Brève description de ce que fait cette PR.

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Unit tests ajoutés/mis à jour
- [ ] E2E tests ajoutés/mis à jour
- [ ] Tests manuels effectués

## Screenshots
(Si applicable)

## Checklist
- [ ] Mon code suit les coding standards
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne créent pas de warnings
- [ ] Les tests passent localement
```

### Review Process

1. **Automatic Checks**: CI/CD va vérifier:
   - Linting
   - Type checking
   - Unit tests
   - E2E tests
   - Build

2. **Code Review**: Un mainteneur va review:
   - Qualité du code
   - Respect des standards
   - Tests appropriés
   - Documentation

3. **Feedback**: Répondre aux commentaires et faire les ajustements

4. **Merge**: Une fois approuvé, la PR sera mergée

---

## 🧪 Testing

### Unit Tests (Jest)

```typescript
// src/lib/__tests__/utils.test.ts
import { formatPrice } from '../utils';

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1000)).toBe('€10.00');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('€0.00');
  });
});
```

**Run tests:**
```bash
npm test              # Mode watch
npm run test:coverage # Avec coverage
```

### E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'admin@titanfit.com');
  await page.fill('[name="password"]', 'Admin123!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/admin');
});
```

**Run E2E tests:**
```bash
npm run test:e2e     # Headless
npm run test:e2e:ui  # Interactive
```

---

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calcule le score de fitness basé sur les métriques utilisateur
 * @param metrics - Métriques de l'utilisateur (poids, taille, etc.)
 * @returns Score de 0 à 100
 */
function calculateFitnessScore(metrics: UserMetrics): number {
  // Implementation
}
```

### README Updates

Si vous ajoutez une feature majeure:
- Mettre à jour le README.md
- Ajouter une section dans la documentation
- Créer des exemples d'utilisation

---

## 🎨 Design Guidelines

### Colors

Respecter la palette luxury:
- **Primary**: #D4AF37 (Gold)
- **Background**: #000000 (Black)
- **Text**: #FFFFFF (White)
- **Accents**: Violet, Blue, Orange

### Typography

- **Headings**: Playfair Display
- **Body**: Inter
- **Monospace**: Fira Code

### Spacing

Utiliser le système de spacing de Tailwind (4px base unit):
```typescript
p-4  // 16px
p-8  // 32px
p-12 // 48px
```

---

## 🐛 Reporting Bugs

### Template Issue

```markdown
**Description**
Description claire et concise du bug.

**To Reproduce**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Expected behavior**
Ce qui devrait se passer.

**Screenshots**
(Si applicable)

**Environment**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. v2.0]

**Additional context**
Contexte supplémentaire.
```

---

## 💡 Feature Requests

### Template

```markdown
**Feature Description**
Description claire de la feature souhaitée.

**Problem it solves**
Quel problème cette feature résout-elle?

**Proposed Solution**
Comment vous imaginez la solution?

**Alternatives**
Autres solutions considérées?

**Additional context**
Mockups, références, etc.
```

---

## 📞 Questions?

- **Discord**: [Join](https://discord.gg/titanfit)
- **Email**: dev@titanfit.com
- **GitHub Discussions**: [Discussions](https://github.com/titanfit/discussions)

---

## 🙏 Thank You!

Merci de contribuer à TitanFit V2 ! Chaque contribution compte. 🚀

---

**Dernière maj**: 2026-01-13  
**Version**: 2.0
