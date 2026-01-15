---
description: Protocol to ensure changes are always pushed to remote
---

# Auto-Push Protocol

When applying a fix that the user is waiting to test on a separate device (e.g., mobile):

1. **COMMIT**: Always commit the changes immediately after the verify/edit step.
2. **PUSH**: Execute `git push` in the SAME turn or the immediately following turn.
3. **CONFIRM**: Do NOT tell the user "It is pushed" unless the `git push` command has been successfully issued.

> [!IMPORTANT]
> Failure to push prevents mobile debugging and frustrates the user.
