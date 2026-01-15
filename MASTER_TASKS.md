# 🏆 TITANFIT V2 - MASTER TASK LIST
## 📅 Dernière mise à jour : 15 Janvier 2026
## 📊 Total des tâches : ~244 tâches uniques

---

# 📋 CATÉGORIES DES TÂCHES

## 🎯 1. FEATURES PRINCIPALES (Dashboard & Core)

- [ ] **Dashboard Completion** - Finaliser le tableau de bord
- [ ] **"Focus Mode" Integration** - Mode concentration sans distraction
- [ ] **Focus Mode** (Distraction-free workout overlay)
- [ ] **Smart Alerts** (Protein deficit, Recovery needs)
- [ ] **Futuristic "Quick Actions"** - Command Center (like Spotlight/Raycast)
- [ ] **Interactive Body Map (Workout)** - Carte corporelle interactive
- [ ] **Integration "Titan Vision"** (formerly Photo AI)
- [ ] **Smart Meal Generator 2.0 (Refonte)**
- [ ] **Training Log Redesign (`/training`)**
- [ ] 3D/Schematic Human Body visualization
- [ ] Auto-suggest exercises based on selected muscles + available equipment
- [ ] Click-to-target muscle groups
- [ ] Dark/Gold UI strictly
- [ ] Display "Neural Analysis" results (Macros/Cals)
- [ ] Distraction-free toggle
- [ ] High-contrast timer + large step-by-step UI
- [ ] Interface "Intention-Based": "I want a snack/feast/quick bite" selector
- [ ] Interface for uploading meal photos
- [ ] Constraint selector: "No sugar", "High protein", "Available ingredients"
- [ ] Result presentation: Cards with "Why this meal?" explanation
- [ ] "Log water", "Start workout", "Add mood" accessible in 1 tap/key
- [ ] Live session tracking visuals
- [ ] Replace static buttons with a "Command Center"

## 🎮 2. SOCIAL & GAMIFICATION

- [ ] **Social & Gamification (`/social`)**
- [ ] **Gamification**: XP, Levels, "Titan" Rank
- [ ] **Social Squads**: Group challenges
- [ ] **Titan Equity**: User retention rewards
- [ ] "Gym Crush Mode" (Community features)
- [ ] Competitions/Leaderboards (Gold accents for top ranks)
- [ ] Squads Dashboard (Team stats)

## 💳 3. STRIPE & PAIEMENTS

- [ ] Activate Stripe account
- [ ] Configure Stripe keys (Publishable + Secret)
- [ ] Configure webhook endpoint: `/api/webhooks/stripe`
- [ ] Configure Webhooks (`/api/webhooks/stripe`)
- [ ] Set up Product Catalog & prices in Stripe
- [ ] Sync Pricing Plans with Stripe Dashboard
- [ ] Test Payment Flow (Sandbox)
- [ ] Test payment flow in sandbox
- [ ] Test payment flow end-to-end
- [ ] Set up recurring billing (if applicable)
- [ ] Configure tax settings
- [ ] Set up refund policies
- [ ] Webhook handler for subscription updates
- [ ] "Manage Subscription" portal link
- [ ] Place a test order

## 🗄️ 4. DATABASE & SUPABASE

- [ ] Run Supabase migration: `titan_cms_v2.sql`
- [ ] Create storage buckets: `media` (public), `private-uploads` (private)
- [ ] Set up Row Level Security (RLS) policies on *all* tables
- [ ] Enable RLS on all tables
- [ ] Seed initial data (optional)
- [ ] Create first admin user
- [ ] Configure Supabase Auth providers
- [ ] Configure CORS origins
- [ ] Configure RBAC (Role Based Access Control) in Supabase
- [ ] Export database (.sql)
- [ ] Complete database dump
- [ ] Verify database connections
- [ ] Optimize slow queries

## 📧 5. EMAIL & NOTIFICATIONS

- [ ] Set up SMTP credentials for email
- [ ] Set up email templates (Welcome, Password Reset)
- [ ] Configure email templates
- [ ] Email template customization (Supabase)
- [ ] Verify SMTP connection
- [ ] Test welcome email
- [ ] Test password reset email
- [ ] Email confirmations
- [ ] Set up email logging/tracking
- [ ] Configure bounce handling
- [ ] Verify email delivery
- [ ] Notification system
- [ ] Password reset

## 🔒 6. SÉCURITÉ

- [ ] **Headers**: Configure CSP, HSTS, X-Frame-Options
- [ ] **Middleware**: Verify route protection
- [ ] **Rate Limiting**: Protect API/AI endpoints
- [ ] Set security headers (CSP, HSTS, X-Frame) in middleware
- [ ] Set security flags (2FA, rate limiting)
- [ ] Set up rate limiting
- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Conduct security audit
- [ ] Review security alerts

## 🌍 7. INTERNATIONALISATION (i18n)

- [ ] Install `next-intl`
- [ ] Create translation files (fr.json, en.json, es.json)
- [ ] `messages/fr.json` (Primary)
- [ ] `messages/en.json`
- [ ] `messages/es.json`
- [ ] Set up middleware
- [ ] Update Next.js config
- [ ] Convert components to use `useTranslations()`
- [ ] Add language switcher to navbar
- [ ] Implement Language Switcher in Navbar
- [ ] Test all pages in multiple languages
- [ ] Configure hreflang tags
- [ ] Translate all Static Content (Home, Pricing, About)

## 📈 8. SEO & ANALYTICS

- [ ] **SEO**: Configuration complète
- [ ] **Analytics**: Setup complet
- [ ] Generate `sitemap.xml`
- [ ] Configure `robots.txt`
- [ ] Sitemap.xml & Robots.txt generation
- [ ] Connect Google Analytics
- [ ] Add Google Analytics Measurement ID
- [ ] Set up Google Analytics
- [ ] Configure Facebook Pixel (optional)
- [ ] Verify Meta Tags (Title, Desc) on all pages
- [ ] Verify meta tags on all pages
- [ ] Meta Tags (OpenGraph) for social sharing
- [ ] Test Open Graph tags
- [ ] Verify canonical URLs
- [ ] Submit sitemap.xml to Google
- [ ] Update SEO metadata

## ⚡ 9. PERFORMANCE

- [ ] **Performance**: Optimisation globale
- [ ] Run build: `npm run build`
- [ ] Bundle Size Check (<500KB initial load)
- [ ] Check bundle size (< 500KB target)
- [ ] Run Lighthouse audit (score > 90)
- [ ] Lighthouse Audit score > 90
- [ ] Image Optimization (WebP)
- [ ] Optimize images (WebP format)
- [ ] Optimize images (WebP + Lazy Loading)
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Minify CSS/JS
- [ ] Monitor performance metrics
- [ ] Analyze performance data
- [ ] Configure performance monitoring

## 🧪 10. TESTS & QUALITÉ

- [ ] **Unit Tests**: Run `npm test`
- [ ] **E2E Tests**: Critical flows (Signup -> Onboarding -> Dashboard)
- [ ] Run all unit tests: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] E2E Testing of critical flows
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test admin panel functionality
- [ ] Test admin panel access
- [ ] Test login/signup flow
- [ ] Test all critical user flows
- [ ] Le code compile sans erreurs (`npm run build`)
- [ ] Les tests passent (`npm test`)
- [ ] Le linting passe (`npm run lint`)
- [ ] Les tests passent localement
- [ ] Unit tests ajoutés/mis à jour
- [ ] E2E tests ajoutés/mis à jour
- [ ] Tests manuels effectués

## ♿ 11. ACCESSIBILITÉ

- [ ] **Touch Optimization**: Min tap target size 44px
- [ ] Hit targets ≥24px (44px on mobile)
- [ ] All interactive elements keyboard accessible
- [ ] Form inputs have associated labels
- [ ] Color contrast meets APCA standards
- [ ] Visible focus rings on focusable elements
- [ ] `prefers-reduced-motion` respected
- [ ] No zoom disabled
- [ ] Loading states don't flicker
- [ ] No `transition: all`
- [ ] Errors show how to fix, not just what's wrong

## 📱 12. PWA & MOBILE

- [ ] PWA configuration
- [ ] **Manifest**: Verify `manifest.json` (Theme color #000000, Icons)
- [ ] **Cross-Device**: Verify responsive design on Mobile, Tablet, Desktop
- [ ] **iOS Sync Prep**: Ensure architecture supports future Capacitor/Native wrapper
- [ ] **Mobile Native**: React Native / Expo version (later)

## 📜 13. LEGAL & GDPR

- [ ] **Legal Pages**: Privacy, Terms, etc.
- [ ] Add Privacy Policy page
- [ ] Privacy Policy
- [ ] Add Terms of Service page
- [ ] Terms of Service
- [ ] Add Cookie Consent banner
- [ ] Cookie Consent banner (custom design, not generic)
- [ ] Cookie Consent Banner
- [ ] GDPR compliance check
- [ ] GDPR Compliance Check
- [ ] GDPR: Privacy Policy & Terms pages
- [ ] Add contact information
- [ ] Configure data retention policies

## 🔧 14. MONITORING & LOGS

- [ ] Set up error tracking (Sentry)
- [ ] Sentry integration for bug tracking
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting rules
- [ ] Create status page
- [ ] Monitor error logs
- [ ] Check for JavaScript errors
- [ ] Review server logs
- [ ] Review error rates

## 💾 15. BACKUP & RECOVERY

- [ ] Backup storage bucket
- [ ] Export user data CSV
- [ ] Backup environment config
- [ ] Test one random backup restore
- [ ] All storage buckets
- [ ] All environment variables
- [ ] Configuration files
- [ ] Verify backup integrity
- [ ] Update disaster recovery plan
- [ ] Configure automatic backups (Scripts recovered)

## 🚀 16. FONCTIONNALITÉS AVANCÉES (Future)

- [ ] **AR Scanner**: Supermarket product scanning
- [ ] **Bet on Yourself**: Contract-based goals
- [ ] **Coach Certification**: B2B diploma system
- [ ] **Marketplace**: Buy/Sell programs
- [ ] OpenAI API integration
- [ ] User profile editing
- [ ] Image upload

## 📝 17. DOCUMENTATION & CODE QUALITY

- [ ] Documentation
- [ ] La documentation est à jour
- [ ] Mon code suit les coding standards
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne créent pas de warnings
- [ ] Les commits suivent la convention
- [ ] La PR a une description claire
- [ ] Les screenshots sont inclus (si changement UI)
- [ ] Error Boundary customizable page

## ✅ 18. PRE-LAUNCH CHECKLIST

- [ ] Copy `.env.example` to `.env.local` and secure secrets
- [ ] Fill in all Supabase credentials (URL, Anon Key)
- [ ] Configure site URL and metadata
- [ ] Verify all feature flags
- [ ] **Manual Audit**: Walkthrough of the entire user journey
- [ ] Final user acceptance testing

## 🎬 19. POST-LAUNCH

- [ ] Verify site is live and accessible
- [ ] Check analytics tracking
- [ ] Check storage usage
- [ ] Check conversion rates
- [ ] Review user feedback
- [ ] Plan hotfixes if needed

---

# 📊 PROGRESSION

| Catégorie | Complétées | Total | % |
|-----------|-----------|-------|---|
| Features Principales | 0 | 23 | 0% |
| Social & Gamification | 0 | 7 | 0% |
| Stripe & Paiements | 0 | 15 | 0% |
| Database & Supabase | 0 | 13 | 0% |
| Email & Notifications | 0 | 13 | 0% |
| Sécurité | 0 | 10 | 0% |
| i18n | 0 | 13 | 0% |
| SEO & Analytics | 0 | 16 | 0% |
| Performance | 0 | 15 | 0% |
| Tests & Qualité | 0 | 17 | 0% |
| Accessibilité | 0 | 11 | 0% |
| PWA & Mobile | 0 | 5 | 0% |
| Legal & GDPR | 0 | 13 | 0% |
| Monitoring & Logs | 0 | 10 | 0% |
| Backup & Recovery | 0 | 10 | 0% |
| Features Avancées | 0 | 7 | 0% |
| Documentation | 0 | 10 | 0% |
| Pre-Launch | 0 | 6 | 0% |
| Post-Launch | 0 | 6 | 0% |
| **TOTAL** | **0** | **~220** | **0%** |

---

# 📝 JOURNAL DES MODIFICATIONS

## 15 Janvier 2026
- ✅ Création du fichier MASTER_TASKS.md
- ✅ Consolidation de toutes les tâches de 9 fichiers sources
- ✅ Dédoublonnage et organisation par catégories
- ✅ Correction des erreurs de classname → className
- ✅ Fix du problème de redirection login
- ✅ Fix de l'erreur THREE.js (#silver → #C0C0C0)
- ✅ Fix manifest.json (icon.png → favicon.ico)
- ✅ Ajout de suppressHydrationWarning au layout
- ⏳ Travail en cours sur le flux de connexion

---

# ⚠️ RAPPELS IMPORTANTS

1. **Toujours faire un `git push` après chaque session de travail importante**
2. **Ne jamais supprimer ce fichier** - c'est la source de vérité pour toutes les tâches
3. **Mettre à jour le journal des modifications** après chaque changement significatif
4. **Cocher les tâches complétées** avec `- [x]` au lieu de `- [ ]`
