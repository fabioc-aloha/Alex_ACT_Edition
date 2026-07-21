---
description: "Maps tool-related requests to host-neutral capability classes and fallbacks when working with tools, MCP, GitHub, notebooks, browsers, or diagrams."
applyTo: "**/*tool*,**/*mcp*,**/*github*,**/*notebook*,**/*browser*,**/*playwright*,**/*figma*,**/*mcp*/**,**/*tool*/**"
lastReviewed: 2026-07-21
---

# Tool Capability Classes

Use capability class first and host tool name second.

| Capability class | Purpose | No-capability fallback |
| --- | --- | --- |
| Repository | Search, read, edit, references, diagnostics | Exact file/patch guidance |
| Terminal | Build, test, lint, Git, scripts | Command plus expected result |
| Web fetch | Public static content | User-provided source or mark unknown |
| Browser | Rendered DOM, interaction, screenshots | Static fetch or explicit refusal |
| GitHub | Issues, pull requests, releases, repository metadata | Local Git evidence or URL guidance |
| Cloud/service API | Read or mutate external resources | Local config review; approval before writes |
| Notebook | Inspect and execute cells | Script or documented manual steps |
| Diagram/render | Validate Mermaid, SVG, or pixels | Source validation and text fallback |
| Agent | Isolated delegated role | Direct skill execution or manual fallback |

Never retry by guessing adjacent tool names. Consult the selected surface
profile for discovery and invocation details.

## Anti-Patterns

| Avoid | Use instead |
| --- | --- |
| Hardcoded host registry names in Core | Capability class plus profile binding |
| Silent reduced mode | Name missing capability and consequence |

## Would Revise If

Revise by 2026-10-21 if a recurring tool request fits no capability class or a
fallback produces a false completion claim.
