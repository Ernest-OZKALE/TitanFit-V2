# TitanFit V2 - Titan Master Audit (Consolidated Plan)

This document is the **Single Source of Truth**, consolidated from all project history, recovered recovery bases, and conversation logs. It represents the complete roadmap to "Liquid Titanium" perfection.

## 📊 Status Overview
- **Total Tasks Tracked**: 150+
- **Phase**: Pre-Production / Polishing
- **Theme**: Liquid Titanium (Dark/Gold)

---

## 🚀 Phase 1: Core Experience & "Liquid Titanium" Design (Immediate Priority)
The user-facing application must be flawless, immersive, and "futuristic".

- [ ] **Dashboard Completion**
  - [x] Implement `TimeAwareHero` (Morning/Day/Night modes in Dark/Gold).
  - [x] Implement `SmartStack` (Neural Insights).
  - [x] Implement `BodyMapSelector` (Visual muscle targeting).
  - [x] Implement `MealGenerator` (Intention-based wizard).
  - [ ] **Focus Mode** (Distraction-free workout overlay).
  - [ ] **Smart Alerts** (Protein deficit, Recovery needs).
- [ ] **Training Log Redesign (`/training`)**
  - [ ] Dark/Gold UI strictly.
  - [ ] Live session tracking visuals.
- [ ] **Integration "Titan Vision"** (formerly Photo AI)
  - [ ] Interface for uploading meal photos.
  - [ ] Display "Neural Analysis" results (Macros/Cals).
- [ ] **Social & Gamification (`/social`)**
  - [ ] Squads Dashboard (Team stats).
  - [ ] Competitions/Leaderboards (Gold accents for top ranks).
  - [ ] "Gym Crush Mode" (Community features).

---

## 🛠️ Phase 2: Infrastructure & Security (The "100 Task" Checklist)
Derived from `DEPLOYMENT_CHECKLIST.md` and `RECOVERED_KNOWLEDGE_BASE`.

### Environment & Database
- [ ] Copy `.env.example` to `.env.local` and secure secrets.
- [ ] Run Supabase migration: `titan_cms_v2.sql`.
- [ ] Create storage buckets: `media` (public), `private-uploads` (private).
- [ ] Set up Row Level Security (RLS) policies on *all* tables.
- [ ] Configure automatic backups (Scripts recovered).

### Security & Compliance
- [ ] **Headers**: Configure CSP, HSTS, X-Frame-Options (done in `next.config.js`).
- [ ] **Middleware**: Verify route protection (Applies to Admin & User routes).
- [ ] **Rate Limiting**: Protect API/AI endpoints.
- [ ] **Legal Pages**:
  - [ ] Privacy Policy.
  - [ ] Terms of Service.
  - [ ] Cookie Consent Banner.
  - [ ] GDPR Compliance Check.

### Payments (Stripe)
- [ ] Activate Stripe account.
- [ ] Configure Webhooks (`/api/webhooks/stripe`).
- [ ] Test Payment Flow (Sandbox).
- [ ] Set up Product Catalog & prices in Stripe.

---

## 🌍 Phase 3: Internationalization (i18n)
Based on `I18N_SETUP_GUIDE.md`.

- [ ] Install `next-intl` (Done).
- [ ] Create translation files:
  - [ ] `messages/fr.json` (Primary).
  - [ ] `messages/en.json`.
  - [ ] `messages/es.json`.
- [ ] Implement Language Switcher in Navbar.
- [ ] Translate all Static Content (Home, Pricing, About).

---

## 📈 Phase 4: SEO, Analytics & Performance
- [ ] **SEO**:
  - [ ] Verify Meta Tags (Title, Desc) on all pages.
  - [ ] Generate `sitemap.xml`.
  - [ ] Configure `robots.txt`.
- [ ] **Analytics**:
  - [ ] Connect Google Analytics.
  - [ ] (Optional) Facebook Pixel.
- [ ] **Performance**:
  - [ ] Image Optimization (WebP).
  - [ ] Bundle Size Check (<500KB initial load).
  - [ ] Lighthouse Audit Score > 90.

---

## 📱 Phase 5: Mobile & PWA
- [ ] **Manifest**: Verify `manifest.json` (Theme color #000000, Icons).
- [ ] **Touch Optimization**: Min tap target size 44px.
- [ ] **iOS Sync Prep**: Ensure architecture supports future Capacitor/Native wrapper.

---

## 🧪 Phase 6: Testing & QA
- [ ] **Unit Tests**: Run `npm test`.
- [ ] **E2E Tests**: Critical flows (Signup -> Onboarding -> Dashboard).
- [ ] **Cross-Device**: Verify responsive design on Mobile, Tablet, Desktop.
- [ ] **Manual Audit**: Walkthrough of the entire user journey.

---

## 💡 Future Innovations ("Business Grade" Ideas)
From `TITAN_MASTER_LOG.md`.

- [ ] **Titan Equity**: User retention rewards.
- [ ] **Bet on Yourself**: Contract-based goals.
- [ ] **AR Scanner**: Supermarket product scanning.
- [ ] **Coach Certification**: B2B diploma system.

---
**Last Updated**: 2026-01-15 (Recovered & Consolidated)
