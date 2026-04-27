---
type: instruction
lifecycle: stable
inheritance: inheritable
description: "Technical Writing — clear documentation for peers, developers, and technical audiences"
application: "When writing documentation, API descriptions, architecture explanations, or technical guides"
applyTo: "**/*doc*,**/*readme*,**/*guide*,**/*api*"
currency: 2026-04-27
---

# Technical Writing

Write documentation that developers actually read and use.

## Core Principles

### 1. Lead with the Problem

| Don't Start With | Start With |
|------------------|------------|
| "This module provides..." | "When you need to X, use this module" |
| "The API offers..." | "To solve Y, call this endpoint" |
| "This document describes..." | [Skip the meta — just describe it] |

### 2. Show, Then Tell

```
✅ Right order:
1. Code example showing usage
2. Explanation of what it does
3. Edge cases and gotchas

❌ Wrong order:
1. Three paragraphs of theory
2. API reference table
3. Maybe an example if you scroll
```

### 3. One Idea Per Section

| Section | Contains |
|---------|----------|
| Overview | What it does, when to use it (3-5 sentences max) |
| Quick Start | Copy-paste example that works |
| API Reference | Parameters, returns, errors |
| Troubleshooting | Common problems → solutions |

## Structure Templates

### README Pattern

```markdown
# Project Name

One sentence: what it does.

## Quick Start
[Copy-paste example]

## Installation
[Steps]

## Usage
[Common patterns]

## API
[Reference if needed]
```

### API Endpoint Pattern

```markdown
## POST /resource

Creates a new resource.

### Request
[Example with all fields]

### Response
[Example response]

### Errors
| Code | Meaning | Fix |
|------|---------|-----|
| 400 | Invalid input | Check required fields |
| 409 | Already exists | Use PUT to update |
```

### Troubleshooting Pattern

```markdown
## Problem: X doesn't work

**Symptom**: Error message or behavior

**Cause**: Why this happens

**Fix**: 
1. Step one
2. Step two

**Verify**: How to confirm it's fixed
```

## Quality Checklist

| Check | Question |
|-------|----------|
| **Scannable** | Can someone find what they need in 10 seconds? |
| **Actionable** | Does every section tell the reader what to DO? |
| **Testable** | Can someone verify the examples work? |
| **Complete** | Are error cases documented? |
| **Current** | Does the doc match the actual behavior? |

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Wall of text | No one reads it | Add headers, break into sections |
| Orphan example | Code without context | Add "when to use" before, "what it does" after |
| Jargon soup | Excludes newcomers | Define terms on first use |
| Stale docs | Wrong information | Add "last verified" date, automate where possible |
| Passive voice | Unclear who acts | "The system does X" → "Call Y to do X" |

## Audience Calibration

| Audience | Assumes | Needs |
|----------|---------|-------|
| **New user** | Nothing | Glossary, prerequisites, full examples |
| **Experienced user** | Basic concepts | Quick reference, edge cases |
| **Contributor** | Deep knowledge | Architecture decisions, why not alternatives |

## The Edit Pass

Before publishing:

1. **Delete the first paragraph** — it's usually throat-clearing
2. **Check every heading** — does it tell you what's in the section?
3. **Run every code example** — does it actually work?
4. **Read it on mobile** — does it still make sense?
5. **Ask: "What question does this answer?"** — if unclear, rewrite

> **Documentation is a product. Ship it with the same care as code.**
