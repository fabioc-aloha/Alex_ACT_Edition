---
type: instruction
lifecycle: stable
inheritance: inheritable
description: Plugin store routing — connect browse and install requests to the right local store and the plugin-browser skill
application: When the user mentions plugins, stores, browse, or wants capabilities beyond the Mall
applyTo: '**/*plugin*,**/*browse*,**/*store*,**/*agent*'
currency: 2026-05-01
lastReviewed: 2026-05-01
---

# Plugin Store Routing

Route plugin requests to the right store and skill.

## When to Fire

| Trigger | Action |
| --- | --- |
| User says "browse plugins", "find a plugin", "search stores" | Fire `plugin-browser` skill |
| User says "install plugin X" | Fire `plugin-browser` skill Step 4 (install components) |
| `/browse-plugins` invoked | Fire `plugin-browser` skill |
| `/install-from-mall` finds no match in Mall | Suggest browsing plugin stores as fallback |
| Project needs agents, hooks, or MCP that Mall doesn't have | Suggest plugin stores proactively |

## Store Priority

1. **Alex_Skill_Mall** — first-party, curated, compliant frontmatter
2. **Production** (`.github-private`) — governance-reviewed plugins
3. **Official** (`copilot-plugins`) — GitHub-curated
4. **Community** (`awesome-copilot`) — mixed quality, review before installing
5. **Playground** — largest (800+) but uncurated, staging quality

Always check the Mall first. Plugin stores are the fallback for capabilities the Mall doesn't carry (agents, hooks, MCP servers, multi-agent orchestration).

## What Plugins Add That the Mall Doesn't

| Capability | Mall | Plugin stores |
| --- | --- | --- |
| Skills (SKILL.md) | 217 skills | Thousands more |
| Agents (.agent.md) | Not in Mall | Available |
| Hooks (hooks.json) | Not in Mall | Available |
| MCP servers (.mcp.json) | Not in Mall | Available |
| Multi-agent orchestration | Not in Mall | Available (e.g., deep-review) |
