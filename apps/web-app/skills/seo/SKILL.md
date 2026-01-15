---
name: seo
description: Rules for Programmatic SEO and dynamic page generation.
---

# TitanFit pSEO Engine

## 🎯 Strategy
We use **Static Site Generation (SSG)** logic where possible, or highly cached SSR.
Every entity in our DB (Exercise, Recipe, Muscle) gets a dedicated URL.

## 🔗 URL Structure
*   `/exercises/[slug]`: Main exercise guide.
*   `/muscles/[slug]`: (Planned) Anatomy guide.

## 📝 Metadata Rules
Every page must export a `generateMetadata` function.
*   **Title**: Must include the Entity Name + "TitanFit".
*   **Description**: Must be under 160 chars and include keywords (Muscles, Difficulty).

## 🚀 Scaling
To scale to 100k pages (as per Kalash's strategy):
1.  Connect `exercise-db` to a real headless CMS (Sanity/Supabase) later.
2.  Use `generateStaticParams` to pre-build popular pages at build time.
