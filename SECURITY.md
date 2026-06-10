# Security Policy — Alex_ACT_Edition

Edition is the heir-template repository for the Alex_ACT constellation. The static-fetch model in [docs/adrs/ADR-009-extension-github-fetch-brain.md](../Alex_ACT_Supervisor/docs/adrs/ADR-009-extension-github-fetch-brain.md) means **every Edition release fetched by the VS Code Marketplace Extension lands directly in heir workspaces on the next upgrade**. That makes Edition a high-value supply-chain target.

## Threat model summary

The accepted risk explicitly stated in ADR-009:

> Compromised Edition repo ships compromised brain to every heir on next upgrade.

Mitigations in place:

- Branch protection on `main` with required reviews
- GitHub Release published with `--target <commit-sha>` to pin the release object to a specific SHA (not a moving branch)
- Edition Contract manifest (`.github/config/edition-manifest.json`, spec 1.4+) validated by the Extension before any destructive install op
- `min_extension_version` floor in the manifest prevents older Extensions from installing a contract they don't understand

This policy is how you report a suspected violation of those controls.

## How to report a vulnerability or suspected compromise

In order of preference:

1. **GitHub private vulnerability reporting** — `Security` tab → `Report a vulnerability`. Routes to the maintainer without public disclosure.
2. **Email** — `fabio@correa.io` with `[ACT-SECURITY]` in the subject line.
3. **Inbound feedback channel** — write a file to `Alex_ACT_Memory/feedback/` with frontmatter `category: security` and `severity: high|critical` per the [Alex_ACT_Memory SCHEMA](https://github.com/fabioc-aloha/Alex_ACT_Memory/blob/main/SCHEMA.md). Only viable for users who already have AI-Memory wired (most active heirs).

Do not open a public issue or PR for security reports. Sanitize any logs you attach (strip secrets, paths with usernames, internal repo URLs).

## Response SLA

| Severity | Maintainer ack | First mitigation update |
| --- | --- | --- |
| Critical (active compromise, brain payload tampering, manifest bypass) | 24 hours | 72 hours |
| High (privilege escalation, supply-chain risk, data exposure in shipped brain) | 48 hours | 7 days |
| Medium / Low | 7 days | next Edition release |

Single-curator project — SLA is best-effort, not contractual.

## What to report

- Tampered brain content shipping through the Extension fetch (skill/instruction/prompt/agent file bytes differ from the tagged release)
- Edition Contract manifest values that the Extension trusted but turn out wrong (`min_extension_version`, `brain_subtrees`, `marker_schema`)
- Brain artefacts that bypass `system-prompt-skepticism.instructions.md` or `pii-memory-filter.instructions.md` in a reproducible way
- Credentials, tokens, PII, or real client names committed anywhere in this repo
- Compromise of the Edition release tag chain (force-pushed tags, unsigned commits on `main`, release object pointing at unexpected SHA)

## Where to report sibling-repo issues

- VS Code Extension surface (`extension.js`, manifest, walkthrough, signing): report to [Alex_ACT_Extension/SECURITY.md](https://github.com/fabioc-aloha/Alex_ACT_Extension/blob/main/SECURITY.md)
- Curator / framework / shared-core authorship (`act-pass`, `epistemic-calibration`, etc.): report to [Alex_ACT_Supervisor/SECURITY.md](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/SECURITY.md)
- Plugin Mall content: report to that plugin's upstream first; the Mall is a curated catalog, not the author of plugin content

## Scope

In scope:

- This repo (`Alex_ACT_Edition`) — brain content shipped to heirs
- The Edition release tag chain on `main`
- The Edition Contract manifest schema as consumed by Extension v9.4.0+

Out of scope:

- Heir projects deployed from Edition (those are user-owned)
- The Extension's host code (route to Extension repo)
- Third-party Mall plugins

## License

This project ships under [PolyForm-Noncommercial-1.0.0](LICENSE). The security policy applies regardless of license terms.

## Falsifiability

This policy is decoration if 12 months pass with zero security reports AND no incident occurred. Re-evaluate by **2027-06-10**. If decoration is the verdict, sunset and replace with a one-paragraph `## Security` section in `README.md`.
