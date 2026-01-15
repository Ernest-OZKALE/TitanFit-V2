---
name: Agent Skills Registry
description: A registry of specialized skills and constraints for the agent.
---

# Agent Skills & Constraints

## React Best Practices
- **Performance**: Use `useMemo` and `useCallback` judiciously. Avoid prop drilling (use Context or Zustand).
- **Rendering**: Minimize re-renders. Use fragment `<>` where possible.
- **Hooks**: Follow the Rules of Hooks strictly.
- **State**: Prefer server-state (React Query) for async data, and client-state (Zustand) for UI state.

## Web App Architecture (Next.js)
- **Server Components**: Default to Server Components where possible. Use 'use client' only when interactivity is needed.
- **Data Fetching**: Use `@tanstack/react-query` for client-side fetching needs, or Server Actions for mutations.
- **Styling**: Use Tailwind CSS with `tailwind-merge` and `clsx` for conditional classes.

## Agentic UI Patterns
- **Feedback**: Interfaces must provide immediate feedback (optimistic updates).
- **Resilience**: Handle errors gracefully with Error Boundaries and Fallback UI.
- **AI Integration**: Ensure AI-generated content is streamed or displayed with "typing" effects for better UX.

## SEO & Performance (Core Web Vitals)
- **LCP**: Optimize images (Next/Image) and prioritize above-the-fold content.
- **CLS**: Define explicit dimensions for all media.
- **Accessibility**: All interactive elements must have `aria-label` or visible text.
