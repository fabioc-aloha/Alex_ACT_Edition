# ACT Edition for Sourcegraph Cody

**Artificial Critical Thinking for Sourcegraph's Cody AI**

[Cody](https://sourcegraph.com/cody) is Sourcegraph's AI coding assistant. Its superpower is **codebase-wide context** — Cody uses Sourcegraph's code intelligence to understand your entire codebase, not just the files you have open. It can answer questions about code you've never seen.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Cody to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Cody Native Capabilities

Cody brings enterprise-grade AI coding:

| Capability | What It Does |
|------------|--------------|
| **Codebase-wide context** | Understands your entire monorepo via Sourcegraph |
| **Code search integration** | Find relevant code across all repositories |
| **Multi-repo reasoning** | Answer questions spanning multiple repos |
| **IDE integration** | VS Code, JetBrains, Neovim, web |
| **Enterprise ready** | SOC 2, SSO, audit logs |
| **Custom commands** | Define organization-specific workflows |

**Official site**: [sourcegraph.com/cody](https://sourcegraph.com/cody)

---

## What ACT Adds

Cody has the widest context. ACT adds **disciplined reasoning**.

| Without ACT | With ACT |
|-------------|----------|
| Confident answers from vast context | Calibrated confidence with uncertainty markers |
| First solution from search results | Multiple approaches considered |
| Assumes your framing is correct | Challenges framing when evidence suggests otherwise |
| Hidden reasoning | Visible markers showing the thinking |

### The 10 ACT Tenets

| # | Tenet | What Cody Does Differently |
|---|-------|----------------------------|
| I | Hypothesis Primacy | States assumptions before searching code |
| II | Disconfirmation | Seeks evidence that contradicts the hypothesis |
| III | Multiple Hypotheses | Proposes alternative interpretations |
| IV | System Skepticism | Questions whether search results answer the real question |
| V | Calibrated Confidence | Admits when search results are ambiguous |
| VI | Materiality Gate | Applies rigor proportional to stakes |
| VII | Frame Before Solve | Clarifies what you're actually looking for |
| VIII | Adversarial Probe | Considers what might be missing from search |
| IX | Visible Markers | Shows reasoning about code relationships |
| X | Self-Application | Applies these rules to its own analysis |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/cody/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/cody/* /path/to/your/project/
```

This copies:
- `cody.json` — Cody configuration with ACT context
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Cody

Cody uses `cody.json` for project-specific configuration. ACT integrates via:

1. **Context specification** — Points Cody to instruction files
2. **Custom commands** — ACT-specific workflows
3. **Chat instructions** — Default behaviors in conversations

### Custom Commands for ACT

Add ACT workflows to your Cody configuration:

```json
{
  "commands": {
    "act-debug": {
      "prompt": "Read .github/instructions/hypothesis-driven-debugging.instructions.md and apply it to debug: {{{ selection }}}",
      "context": {
        "currentFile": true,
        "selection": true
      }
    },
    "act-review": {
      "prompt": "Read .github/instructions/critical-thinking.instructions.md and review this code for potential issues: {{{ selection }}}",
      "context": {
        "currentFile": true,
        "selection": true
      }
    }
  }
}
```

### Leveraging Codebase Context

Cody's codebase-wide context + ACT = powerful investigation:

```
@.github/instructions/root-cause-analysis.instructions.md

Why are we getting timeout errors in the payment service?
Search the codebase for all database calls and network requests.
```

Cody will search across your entire codebase and apply ACT's root cause analysis to the findings.

---

## ACT Delivery: Config + Context

Cody loads `cody.json` automatically and can include instruction files via context specification:

| Method | Usage |
|--------|-------|
| **@ mentions** | `@.github/instructions/act-pass.instructions.md` |
| **Custom commands** | Predefined workflows with ACT instructions |
| **Chat context** | Include instructions in command definitions |

**Example:**
```
@.github/instructions/act-foundations.instructions.md

I need to understand how authentication works across our microservices.
Apply critical thinking to analyze the auth flow.
```

---

## What's Included

```
.github/
├── copilot-instructions.md    # Identity
├── ABOUT.md                   # Architecture overview
├── episodic/                  # Session memory
│   └── calibration-log.md     # Track confidence over time
└── instructions/              # 51 cognitive instructions
    ├── act-foundations.instructions.md
    ├── act-pass.instructions.md
    ├── critical-thinking.instructions.md
    └── ... (48 more)

cody.json                      # Cody configuration
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| cody.json | ~200 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,000** |

Cody's enterprise context window handles ACT while maintaining codebase-wide awareness.

---

## Best Practices for Cody + ACT

1. **Define custom commands**: Create `/act-debug`, `/act-review`, `/act-refactor`
2. **Use @ mentions**: Reference instruction files for specific behaviors
3. **Leverage codebase search**: Combine ACT reasoning with Cody's search power
4. **Ask cross-repo questions**: "Apply ACT to find all implementations of this interface"

---

## Comparison with Other Platforms

| Feature | Cody | GitHub Copilot |
|---------|------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ❌ Manual | ✅ Via `applyTo` |
| Codebase-wide search | ✅ Best-in-class | ⚡ Partial |
| Multi-repo context | ✅ Native | ❌ |
| Enterprise features | ✅ Native | ✅ Native |

Cody's codebase-wide context + ACT = disciplined reasoning at scale.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
