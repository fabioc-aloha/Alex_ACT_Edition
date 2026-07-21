---
description: "Discovers available host capabilities before using tools and applies profile-specific invocation, authority, fallback, and evidence rules."
applyTo: "**"
lastReviewed: 2026-07-21
---

# Tool Awareness

**Always-on rationale:** Tool availability, invocation names, and authority vary
by surface profile. Capability discovery must happen before every unfamiliar
tool use so Core behavior never depends on one host's tool registry.

## Capability Discovery

1. Identify the selected surface profile from the project marker or session.
2. Inspect the tools the current host actually exposes; do not invent names.
3. Use the profile's discovery mechanism when tools are lazy-loaded.
4. Check read, write, network, identity, and destructive authority separately.
5. If the capability is absent, use the declared fallback or refuse clearly.

| Capability | Core fallback |
| --- | --- |
| File read/search | Use available repository read and search operations |
| File write | Produce a patch or exact manual edit when writes are unavailable |
| Terminal | Provide a command and expected output; never claim it ran |
| Browser | Use static fetch or request user-provided evidence |
| Agent delegation | Invoke a supported direct agent path or execute the skill manually |
| External API | Use local evidence or mark the claim unverified |

Profile-specific invocation details live under `.github/profiles/<profile>/`.
They may bind Core behavior but may not weaken safety, authority, or checks.

## Anti-Patterns

| Avoid | Use instead |
| --- | --- |
| Calling a remembered tool name | Discover the current host capability |
| Treating absence as failure | Use fallback or label the limitation |
| Treating capability as permission | Apply the authority contract |

## Would Revise If

Revise by 2026-10-21 if either profile needs a contradictory Core rule or if
capability discovery fails to prevent three missing-tool retries.
