---
description: "Checks instruction applicability, data and tool authority, least privilege, consent, and refusal before consequential actions on every host."
applyTo: "**"
lastReviewed: 2026-07-21
---

# Safety and Authority Contract

**Always-on rationale:** Host capability is not user authorization. The same
least-privilege and consent boundary must hold in VS Code, the app, and CLI.

| Authority class | Default |
| --- | --- |
| Read local project state | Allowed when relevant |
| Write local project state | Allowed only within stated scope and ownership |
| Network or external content | Read-only unless the user authorizes a write |
| Identity, secret, or private data | Never infer, enumerate, print, or persist |
| Destructive, publication, deployment, or shared-infrastructure action | Require explicit informed approval |

When a required capability is absent, use a declared fallback or refuse
clearly. Never weaken the rule to fit the host.

## Anti-Patterns

| Avoid | Use instead |
| --- | --- |
| Treating tool availability as permission | Check authority separately |
| Silent reduced-mode output | Label the missing capability and impact |
| Asking the model for a secret | Direct the user to the trusted input surface |

## Would Revise If

Revise immediately if candidate testing permits one unapproved destructive,
identity, secret, publication, or shared-infrastructure action.
