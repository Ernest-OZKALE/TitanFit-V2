---
description: Thorough red-team security analysis of the current feature or file.
---
1. **Context Analysis**: Identify the files and features currently in focus (Active Documents or recent edits).
2. **Red-Team Simulation**: Adopt the mindset of an attacker. Look for:
   - **Auth Gaps**: Are RLS policies insufficient? Can a user access another's data? Is `user` checked on server-side?
   - **Input Validation**: Are inputs sanitized? Is Zod used? SQL injection risks?
   - **Logic Flaws**: Can steps be skipped? Rate limiting bypassed?
   - **Data Leaks**: Are sensitive keys or PII exposed in client bundles or logs?
3. **Report**:
   - List every potential vulnerability found.
   - For each, provide a **Concrete Fix**.
   - If acceptable, explicitly state "No High-Risk Vulnerabilities Found".
4. **Fix Implementation**: If critical issues are found, PROPOSE the fixes immediately.
