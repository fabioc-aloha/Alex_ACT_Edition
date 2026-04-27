# Platform Adapters

Self-contained Alex ACT Edition brain for 6 AI coding platforms.

Each platform folder contains a **complete cognitive architecture** — the same 51 instructions, the same 10 ACT tenets, just delivered through that platform's native configuration format.

---

## Quick Install

| Platform | Official Site | Command |
|----------|--------------|---------|
| **GitHub Copilot** | [github.com/features/copilot](https://github.com/features/copilot) | ✅ Works out of the box (root `.github/`) |
| **Claude Code** | [claude.ai/code](https://claude.ai/code) | `cp -r platforms/claude/* /your/project/` |
| **Cursor** | [cursor.com](https://cursor.com) | `cp -r platforms/cursor/* /your/project/` |
| **Windsurf** | [codeium.com/windsurf](https://codeium.com/windsurf) | `cp -r platforms/windsurf/* /your/project/` |
| **Aider** | [aider.chat](https://aider.chat) | `cp -r platforms/aider/* /your/project/` |
| **Continue.dev** | [continue.dev](https://continue.dev) | `cp -r platforms/continue/* /your/project/` |
| **Sourcegraph Cody** | [sourcegraph.com/cody](https://sourcegraph.com/cody) | `cp -r platforms/cody/* /your/project/` |

---

## What Each Platform Contains

Every platform folder includes:

| File | Purpose |
|------|---------|
| `README.md` | Platform-specific guide with native capabilities |
| Platform config | `.cursorrules`, `CLAUDE.md`, `.windsurfrules`, etc. |
| `.github/` | **Complete brain** (51 instructions, ~48K tokens) |

---

## Platform Comparison

| Capability | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|------------|---------|--------|--------|----------|-------|----------|------|
| **Full 51 instructions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Auto-load by context** | ✅ | ❌ | ❌ | ❌ | ⚡ | ❌ | ❌ |
| **`applyTo` patterns** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Pre-load at startup** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **VS Code memory** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Terminal-first** | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Multi-model** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Codebase-wide context** | ⚡ | ⚡ | ✅ | ✅ | ⚡ | ⚡ | ✅ |
| **Agentic Flows** | ⚡ | ✅ | ⚡ | ✅ | ❌ | ❌ | ❌ |
| **Episodic memory** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Native | ⚡ Partial/Via tools | ❌ Not available

---

## ACT Delivery Mechanisms

How instructions reach the AI varies by platform, but **coverage is identical**.

| Delivery | Platforms | How It Works |
|----------|-----------|-------------|
| **Auto** | Copilot | `applyTo: "**"` in YAML frontmatter auto-injects instructions by file pattern |
| **Pre-load** | Aider | `read:` directive loads instruction files into context at startup |
| **Manual** | Claude, Cursor, Windsurf, Continue, Cody | Config instructs agent to read `.github/instructions/` on demand |

### GitHub Copilot (Best Integration)

VS Code reads `applyTo` patterns from YAML frontmatter and injects matching instructions automatically:

```yaml
---
applyTo: "**"  # Matches all files → always loads
---
```

### Aider (Runner-up)

The `read:` directive pre-loads files at startup — no manual prompting needed:

```yaml
read:
  - .github/instructions/act-foundations.instructions.md
  - .github/instructions/critical-thinking.instructions.md
```

### Others (Manual Read)

Config files instruct the agent to read instruction files when relevant:

```markdown
## How to Use This Brain
Before complex tasks, read the relevant instruction from `.github/instructions/`
```

The agent has full access — it just needs to be asked.

---

## What's the Same Everywhere

All 6 platforms receive **identical ACT coverage**:

- **51 instructions** organized across 12 categories
- **10 ACT tenets** fully operationalized
- **Episodic memory** for session-to-session continuity
- **~48,000 tokens** of cognitive architecture

The only difference is how instructions reach the AI, not what instructions exist.

---

## Platform Strengths

Choose based on your workflow:

| If you value... | Use |
|-----------------|-----|
| Best ACT integration | **GitHub Copilot** |
| Extended thinking | **Claude Code** |
| Fast inline editing | **Cursor** |
| Agentic Flows | **Windsurf** |
| Terminal-first, multi-model | **Aider** |
| Open source, any LLM | **Continue** |
| Codebase-wide search | **Cody** |

---

## Platform READMEs

Each platform folder has a detailed README covering:
- Native capabilities and official links
- ACT integration specifics
- Installation and configuration
- Best practices for that platform

See:
- [claude/README.md](claude/README.md)
- [cursor/README.md](cursor/README.md)
- [windsurf/README.md](windsurf/README.md)
- [aider/README.md](aider/README.md)
- [continue/README.md](continue/README.md)
- [cody/README.md](cody/README.md)
