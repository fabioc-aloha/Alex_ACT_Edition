---
description: "Browse local plugin stores for skills, agents, hooks, and MCP servers that match your project"
mode: agent
lastReviewed: 2026-05-01
---

# Browse Plugins

Search the local plugin store clones for capabilities this project needs.

## Steps

1. **Assess project needs** — read `copilot-instructions.local.md`, `README.md`, directory structure. Identify gaps not covered by Edition baseline or Mall.

2. **Search stores** — use the `plugin-browser` skill. Search production → official → playground → community in that order. Match by keyword against plugin names, READMEs, and SKILL.md content.

3. **Present matches** as a table with plugin name, store, components, and one-line description.

4. **On user selection**, extract the needed components into the heir's `local/` dirs following the plugin-browser skill Step 4.

5. **Adapt frontmatter** to Edition standards and commit.

## Quick search

If the user provides a keyword (e.g., `/browse-plugins security`), skip the project assessment and search directly.
