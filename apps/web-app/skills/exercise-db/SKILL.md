---
name: exercise-db
description: Instructions for managing and extending the Exercise Database.
---

# Exercise DB Management

## 📂 Source of Truth
The central data source is `src/lib/exercise-db.ts`. Note that `src/lib/muscle-data.ts` acts as the taxonomy source for muscle IDs.

## 🧬 Schema
Every exercise must adhere to the `Exercise` interface:
```typescript
interface Exercise {
    id: string;           // Unique slug (e.g., 'bench-press')
    name: string;         // Display name
    targetMuscles: string[]; // Must match IDs in muscle-data.ts
    secondaryMuscles?: string[];
    equipment: Equipment[]; // ['dumbbell', 'bodyweight', etc.]
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'strength' | 'stretching' | 'cardio';
    instructions: string[]; // 3-5 concise steps
    videoUrl?: string;
}
```

## 🛠️ Adding New Exercises
1.  Verify the `targetMuscles` IDs against `muscle-data.ts`.
2.  Ensure distinct equipment types are tagged correctly (e.g., if it can be done with DB or BB, add separate entries or logic).
3.  Keep instructions under 100 characters per step for mobile readability.
