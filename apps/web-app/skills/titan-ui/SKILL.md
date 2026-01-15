---
name: titan-ui
description: The specific design system and UI rules for TitanFit V2.
---

# TitanFit V2 UI System

## 🎨 Core Aesthetic
TitanFit V2 follows the **"Liquid Monolith"** design language.
*   **Background**: Deep Black (`#000000` or `bg-black`).
*   **Primary Accent**: Titan Gold (`#D4AF37`).
*   **Secondary**: White with variable opacity (`white/10`, `white/50`).
*   **Texture**: Holographic wireframes, gradients, and blur effects (`backdrop-blur-md`).

## 🧱 Component Rules
1.  **Glassmorphism**: Use `bg-white/5 border border-white/10 backdrop-blur-sm` for cards.
2.  **Typography**: Uppercase headers (`uppercase tracking-widest font-black`).
3.  **Buttons**:
    *   Primary: `bg-[#D4AF37] text-black hover:bg-white`
    *   Ghost: `bg-transparent border border-white/10 hover:border-[#D4AF37]`

## 🎬 Animation (Framer Motion)
All major transitions must use `framer-motion`.
*   **Page Load**: Fade in + Slide Up (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`).
*   **Micro-interactions**: Scale on hover (`whileHover={{ scale: 1.05 }}`).
