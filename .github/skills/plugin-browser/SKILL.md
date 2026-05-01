---
type: skill
lifecycle: stable
inheritance: inheritable
name: plugin-browser
description: Browse local plugin stores (production, playground, official, community) to find skills, agents, and plugins for the current project
tier: standard
applyTo: '**/*plugin*,**/*browse*,**/*store*'
currency: 2026-05-01
lastReviewed: 2026-05-01
---

# Plugin Browser

Browse local plugin marketplace clones to find skills, agents, hooks, and MCP servers that match the current project's needs. Plugins are the official cross-platform packaging format for AI customizations.

## When to Use

- User asks to browse or search for plugins
- User invokes `/browse-plugins`
- During `/install-from-mall` when the Mall doesn't have what's needed
- Proactively when the project would benefit from a plugin's capabilities

## Plugin Stores

Four local stores, ordered by quality bar:

| Store | Path | Size | Quality | Source |
| --- | --- | --- | --- | --- |
| **Production** | `C:\Development\.github-private\plugins\` | ~37 plugins | Governance-reviewed, promoted | `agency-microsoft/.github-private` |
| **Playground** | `C:\Development\playground\plugins\` | ~805 plugins | Staging, uncurated | `agency-microsoft/playground` |
| **Official** | `C:\Development\copilot-plugins\` | GitHub official | Curated by GitHub | `github/copilot-plugins` |
| **Community** | `C:\Development\awesome-copilot\` | Community | Mixed quality | `github/awesome-copilot` |

Cross-platform paths: on macOS/Linux, stores are at `~/Development/<name>` or wherever the user cloned them. The AI should search common locations if the Windows paths don't exist.

## Plugin Anatomy

Each plugin is a directory with:

```text
<plugin-name>/
├── plugin.json              # Manifest: name, description, version
├── agency.json              # Engine compatibility (claude, copilot)
├── README.md                # What it does, how to use
├── skills/
│   └── <name>/SKILL.md      # Agent skill (same format as Mall skills)
├── agents/
│   └── <name>.md            # Agent persona definitions
├── hooks/
│   └── hooks.json           # Lifecycle automation
├── .mcp.json                # MCP server definitions
└── scripts/                 # Supporting automation
```

Not every plugin has all components. Many are skill-only or agent-only.

## Browse Protocol

### Step 1 — Assess project needs

Same as the Skill Selection Protocol in `mall-installation.instructions.md`:
- What does this project do? (language, framework, domain)
- What skills/agents does it already have?
- What gaps exist?

### Step 2 — Search stores in priority order

Search production first (highest quality), then official, then playground (largest), then community.

For each store, search by:
- Plugin directory names (grep for keywords)
- `README.md` content (first paragraph describes the plugin)
- `plugin.json` or `agency.json` description fields
- `skills/*/SKILL.md` content

### Step 3 — Evaluate matches

For each match, extract:

| Field | Where to find it |
| --- | --- |
| Name | Directory name or `plugin.json` `name` field |
| Description | `README.md` first paragraph or `plugin.json` `description` |
| Components | Count skills/, agents/, hooks, .mcp.json |
| Engine | `agency.json` `engines` field (claude, copilot, or both) |
| Category | `agency.json` `category` field |

Present as a table:

```markdown
| Plugin | Store | Components | Description |
| --- | --- | --- | --- |
| deep-review | Production | 1 skill, 3 agents | Adversarial code review with advocate/skeptic/architect |
```

### Step 4 — Install selected plugin components

Plugins are NOT installed whole. Extract the components the project needs:

| Component | Install to | Method |
| --- | --- | --- |
| `skills/<name>/SKILL.md` | `.github/skills/local/<name>/` | Copy contents (same as Mall install) |
| `agents/<name>.md` | `.github/agents/<name>.agent.md` | Copy, rename to `.agent.md` |
| Root `*.md` agents | `.github/agents/<name>.agent.md` | Copy, rename to `.agent.md` |
| `hooks/hooks.json` | `.github/hooks.json` | Merge into existing, or create |
| `.mcp.json` | `.mcp.json` at repo root | Merge server entries |
| `scripts/*` | `.github/scripts/` or project scripts | Copy if needed by hooks/skills |

**Critical**: Do not copy `plugin.json`, `agency.json`, `README.md`, `CONTRIBUTING.md`, `LICENSE`, `SECURITY.md`, or `CODEOWNERS` — those are plugin packaging metadata, not project artifacts.

### Step 5 — Adapt to Edition conventions

After copying, verify:
- Skills have compliant frontmatter (`type`, `lifecycle`, `inheritance`, `name`, `description`, `tier`, `applyTo`, `currency`, `lastReviewed`)
- Agent files use `.agent.md` extension (VS Code convention)
- No absolute paths or plugin-root references (`${CLAUDE_PLUGIN_ROOT}`) — rewrite to relative paths
- No namespace prefixes in skill names (causes silent load failure)

## Anti-Patterns

| Anti-pattern | Fix |
| --- | --- |
| Installing the whole plugin directory | Extract only the components needed |
| Copying plugin metadata (plugin.json, agency.json) | These are packaging artifacts, not project files |
| Installing skills into edition-owned paths | Always use `local/` subdirs |
| Ignoring engine compatibility | Check agency.json — Claude-only plugins may need adaptation |
| Installing 800 playground plugins | Apply the selection filter. Most are irrelevant to any given project |

## Keeping Stores Updated

```bash
git -C ~/Development/.github-private pull --ff-only
git -C ~/Development/playground pull --ff-only
git -C ~/Development/copilot-plugins pull --ff-only
git -C ~/Development/awesome-copilot pull --ff-only
```
