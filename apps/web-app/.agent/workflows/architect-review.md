---
description: Lead Software Architect Review Protocol (God Of Prompt Method).
---

1.  **Architecture Review**:
    - Does this change adhere to the Separation of Concerns?
    - Are we introducing circular dependencies?
    - Is the folder structure respected (`/components` vs `/app` vs `/lib`)?

2.  **Code Quality Gates**:
    - **Type Safety**: No `any` types allowed. Strict null checks enabled.
    - **Error Handling**: Are `try/catch` blocks meaningful? Is there a fallback UI?
    - **Performance**: Check for heavy computations in render cycles. Use `useMemo`.

3.  **Scalability Check**:
    - Will this solution work with 100k users?
    - Is the database schema normalized (or denormalized intentionally)?

4.  **Security & Privacy**:
    - **OWASP Top 10**: Check for Injection, XSS, Broken Auth.
    - **Data**: Is PII handled correctly?

5.  **Final Verdict**:
    - 🟢 **APPROVE**: Production ready.
    - 🟡 **REQUEST CHANGES**: Minor issues.
    - 🔴 **REJECT**: Fundamental architectural flaws.
