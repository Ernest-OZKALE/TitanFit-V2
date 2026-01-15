---
description: Thorough red-team security analysis of the current feature or file.
---

1.  **Analyze the Target**: Read the specified file(s) or the current focused code.
2.  **Red Team Persona**: Adopt the persona of a senior security engineer / penetration tester.
3.  **Identify Vulnerabilities**: Look for:
    *   Injection vulnerabilities (SQL, XSS, Command Injection)
    *   Broken Authentication & Session Management
    *   Insecure Direct Object References (IDOR)
    *   Sensitive Data Exposure
    *   Missing Function Level Access Control
    *   Improper Error Handling
4.  **Report**: Output a markdown report with:
    *   🔴 **Critical**: Immediate threats.
    *   🟡 **Warning**: Potential issues or bad practices.
    *   🟢 **Safe**: Confirmation of implemented security measures.
5.  **Remediation**: Provide specific code snippets to fix found issues.
