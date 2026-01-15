---
description: Mobile Experience & Responsiveness Check (Expo/Mobile Adaptation).
---

1.  **Viewport Constraints**:
    - Verify responsiveness on **XS** (375px - iPhone SE) and **S** (390px - iPhone 14).
    - Ensure no horizontal scrollbars exist (`overflow-x-hidden`).

2.  **Touch Targets**:
    - All buttons/links must be at least **44x44px**.
    - Verify `active` states provide immediate visual feedback (e.g., `active:scale-95`).

3.  **Native Feel (Web-to-App)**:
    - **Safe Areas**: Ensure content respects notch/home indicator areas (`pb-safe`, `pt-safe`).
    - **Inputs**: Check `inputmode` (numeric keyboards for numbers) and `autocomplete` attributes.
    - **Performance**: Animations must run at 60fps on mobile (use `transform` instead of `width/height`).

4.  **Hardware Features**:
    - Verify Haptics (via `navigator.vibrate` if applicable).
    - Check Camera/Media permissions if features used.
