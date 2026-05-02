---
status: Captured
date: 2026-05-02
source: pre-v1-refactor tag (v0.9.9 + 2 commits at 05ba053)
method: chars/4 approximation across all .github/ artifacts
---

# Baseline: Edition v0.9.9 Token Inventory

## 1. Grand Total

Total brain: ~180K tokens across 108 artifact files. But most of this is executable code (muscles, scripts) that never loads into the context window.

**What loads into context per request:**

| Layer | Files | Tokens | Loads when |
| --- | --- | --- | --- |
| `copilot-instructions.md` | 1 | 773 | Always |
| Instructions (always-on) | 23 | 23,440 | Every request |
| Instructions (conditional) | 16 | 10,630 | Pattern-matched files |
| Skills (always-on) | 1 | 1,622 | Every request |
| Skills (conditional) | 15 | 45,231 | Pattern-matched files |
| Prompts | 25 | 14,428 | On invocation only |
| Agents | 3 | 3,582 | On invocation only |
| **Always-on total** | **25** | **25,835** | -- |

**Not loaded into context (executable):**

| Layer | Files | Tokens (in code) |
| --- | --- | --- |
| Muscles (.cjs) | 20 | 73,313 |
| Scripts (.cjs) | 4 | 6,702 |

## 2. Always-On Instructions by Functional Group

Target: 15K tokens (plan success criterion). Current: 23,440 tokens. Gap: **8,440 tokens to cut (~36%).**

### Group 1: Critical Thinking Core (6,647 tokens)

| Instruction | Tokens |
| --- | --- |
| alternatives-and-tradeoffs | 1,486 |
| act-foundations | 1,469 |
| system-prompt-skepticism | 1,319 |
| act-pass | 1,002 |
| problem-framing-audit | 777 |
| critical-thinking | 594 |

Note: `adversarial-review` (1,212 tokens) is conditional (`**/*review*`), not always-on.

### Group 2: Metacognition + Interpersonal (5,057 tokens)

| Instruction | Tokens |
| --- | --- |
| communication-craft | 1,697 |
| emotional-intelligence | 1,001 |
| reliance-nudges | 889 |
| knowledge-coverage | 811 |
| epistemic-calibration | 659 |

Note: `ai-writing-avoidance` (381 tokens) is conditional (`**/*writing*`), not always-on.

### Group 3: Session, Memory + Boundary Guards (7,167 tokens)

| Instruction | Tokens |
| --- | --- |
| cross-project-isolation | 1,387 |
| proactive-awareness | 1,277 |
| session-health-monitoring | 931 |
| memory-triggers | 864 |
| pii-memory-filter | 842 |
| terminal-command-safety | 798 |
| greeting-checkin | 592 |
| lint-discipline | 476 |

This is the largest group at 30.6% of always-on budget.

### Group 4: Principles + Situational (4,569 tokens)

| Instruction | Tokens |
| --- | --- |
| agent-delegation | 1,524 |
| worldview | 1,128 |
| partnership-charter | 1,017 |
| creative-loop | 900 |

Note: `debugging` (1,024 tokens) and `scope-management` (574 tokens) are conditional, not always-on.

## 3. Heaviest Conditional Artifacts

These fire frequently and dominate the budget when active:

| Artifact | Type | Tokens | Fires on |
| --- | --- | --- | --- |
| markdown-mermaid | Skill | 12,821 | `**/*.md` -- every markdown file |
| critical-thinking | Skill | 6,319 | `**/*critical*,**/*thinking*` |
| academic-paper-drafting | Skill | 4,813 | `**/*academic*,**/*paper*` |
| md-to-word | Skill | 4,617 | `**/*docx*,**/*word*` |
| creative-writing | Skill | 3,245 | `**/*fiction*,**/*story*` |
| mall-installation | Instr. | 2,654 | `**/.github/skills/local/**` |
| lint-clean-markdown | Skill | 1,458 | `**/*.md` -- every markdown file |

**Markdown file penalty:** When editing any `.md` file, `markdown-mermaid` (12.8K) + `lint-clean-markdown` (1.5K) + `md-to-html` (505) + `markdown-mermaid.instructions.md` (315) load, adding ~15K tokens on top of the always-on baseline. Total for a markdown editing session: ~41K tokens.

## 4. Top 10 Token Hogs (all types)

| # | Artifact | Type | Tokens |
| --- | --- | --- | --- |
| 1 | markdown-mermaid | Skill | 12,821 |
| 2 | critical-thinking | Skill | 6,319 |
| 3 | academic-paper-drafting | Skill | 4,813 |
| 4 | md-to-word | Skill | 4,617 |
| 5 | creative-writing | Skill | 3,245 |
| 6 | mall-installation | Instruction | 2,654 |
| 7 | problem-framing-audit | Skill | 2,109 |
| 8 | docx-to-md | Skill | 2,109 |
| 9 | md-to-html | Skill | 1,968 |
| 10 | md-to-eml | Skill | 1,836 |

## 5. DRY Opportunities

| Pattern | Current | Opportunity |
| --- | --- | --- |
| 5 converter instructions + 5 converter skills | 10 artifacts, ~12K tokens | 1 converter SA with format-specific reference files |
| markdown-mermaid skill (12.8K) | Monolithic file with rendering, validation, palette rules | Split: SA handles rendering; instruction keeps just the rules |
| critical-thinking skill (6.3K) + instruction (594) | Overlapping content with act-pass, problem-framing-audit | Consolidate: one instruction dispatches to the skill on demand |
| Greeting-checkin instruction (592) + skill (1,622) | Separate files with overlapping protocol description | Merge protocol into skill only; instruction becomes a thin trigger |

## 6. Observations

1. **The always-on budget (25.8K) already exceeds the 25K target for the whole brain.** The refactor is not optional; the current brain is materially over-budget.
2. **Muscles (73K) are irrelevant to the token budget** since they execute, not load. They can be large without cost.
3. **The markdown-mermaid skill (12.8K) is the single largest artifact** and fires on all `.md` files. This is the highest-value DRY target.
4. **Group 3 (session/memory/boundary) is the fattest always-on group** at 7.2K. Several of these (cross-project-isolation, proactive-awareness) carry content that rarely fires operationally. Candidates for conditional activation.
5. **Converter artifacts are the biggest DRY win**: 5 format-specific instructions + 5 format-specific skills + converter-qa = consolidation into 1 SA with shared logic.
6. **academic-paper-drafting (4.8K) and creative-writing (3.2K)** are domain-specialized skills that fire only for niche projects. Their token cost is justified only when active; no action needed.

## 7. Refactor Targets (to reach 15K always-on)

To cut from 23.4K to 15K (saving 8.4K):

| Action | Estimated savings |
| --- | --- |
| Make cross-project-isolation conditional (fleet heirs only) | ~1,400 |
| Make greeting-checkin conditional (first message only; thin trigger) | ~400 |
| Trim proactive-awareness (remove sections for absent infrastructure) | ~500 |
| Consolidate alternatives-and-tradeoffs into critical-thinking skill | ~1,200 |
| Trim communication-craft (move scaffolding rules to skill) | ~800 |
| Make agent-delegation conditional (only when SAs are loaded) | ~1,500 |
| Trim partnership-charter (move verbose tables to skill) | ~500 |
| Trim creative-loop (reduce stage tables) | ~400 |
| Make reliance-nudges conditional (fire on review/acceptance signals) | ~900 |
| Trim session-health-monitoring (remove proxy heuristics, template) | ~400 |
| **Total estimated** | **~8,000** |

These are estimates. Phase-by-phase verification will confirm actual savings.
