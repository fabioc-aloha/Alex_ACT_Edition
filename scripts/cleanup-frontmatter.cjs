#!/usr/bin/env node
/**
 * Cumulative frontmatter cleanup sweeps (2026-05-26).
 *
 * Skills (.github/skills/*\/SKILL.md):
 *   - DROP: type, application, applyTo, inheritance, tier, currency, lifecycle
 *   - ADD:  name (kebab folder name) if missing
 *
 * Instructions / agents / prompts:
 *   - DROP: inheritance, tier, currency, lifecycle
 *
 * Rationale per pass:
 *   - inheritance: Supervisor no longer copies to heirs; scope by file location.
 *   - tier: brain-qa enforced but no loader reads it. Dead enforcement.
 *   - currency: cosmetic on skills/instructions; real consumer is
 *     copilot-instructions.md only. lastReviewed covers the review cadence.
 *   - lifecycle: never enforced by any loader; only consumer was prose
 *     vocabulary in falsifier blocks. Replaced by plain-English
 *     "sunset this rule" / "remove this rule" wording.
 *
 * Operates on the frontmatter block only (between the first pair of `---`).
 * Does not touch the body.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL_DROP = new Set(['type', 'application', 'applyTo', 'inheritance', 'tier', 'currency', 'lifecycle']);
const OTHER_DROP = new Set(['type', 'application', 'inheritance', 'tier', 'currency', 'lifecycle']);

function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, acc);
        else if (e.isFile() && e.name.endsWith('.md')) acc.push(full);
    }
    return acc;
}

function cleanFile(file) {
    const isSkill = /[\\/]SKILL\.md$/i.test(file);
    const isInstruction = file.endsWith('.instructions.md');
    const isAgent = file.endsWith('.agent.md');
    const isPrompt = file.endsWith('.prompt.md');
    if (!(isSkill || isInstruction || isAgent || isPrompt)) return null;

    const drop = isSkill ? SKILL_DROP : OTHER_DROP;
    const content = fs.readFileSync(file, 'utf8');
    if (!content.startsWith('---')) return null;
    const lines = content.split(/\r?\n/);
    let end = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '---') { end = i; break; }
    }
    if (end < 0) return null;

    // Detect existing top-level keys in frontmatter
    const headerLines = lines.slice(1, end);
    const keyOf = (line) => {
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:/);
        return m ? m[1] : null;
    };

    const removed = [];
    const kept = [];
    for (const line of headerLines) {
        const k = keyOf(line);
        if (k && drop.has(k)) { removed.push(k); continue; }
        kept.push(line);
    }

    // For skills: ensure `name:` exists; add at top if missing.
    let added = null;
    if (isSkill) {
        const hasName = kept.some(l => keyOf(l) === 'name');
        if (!hasName) {
            const folderName = path.basename(path.dirname(file));
            kept.unshift(`name: ${folderName}`);
            added = `name: ${folderName}`;
        }
    }

    if (removed.length === 0 && !added) return { file, removed: [], added: null, changed: false };

    const newContent = ['---', ...kept, '---', ...lines.slice(end + 1)].join('\n');
    if (newContent === content) return { file, removed, added, changed: false };
    fs.writeFileSync(file, newContent, 'utf8');
    return { file, removed, added, changed: true };
}

const targets = [
    path.join(ROOT, '.github', 'skills'),
    path.join(ROOT, '.github', 'instructions'),
    path.join(ROOT, '.github', 'agents'),
    path.join(ROOT, '.github', 'prompts'),
];

const files = targets.flatMap(d => walk(d));
const results = files.map(cleanFile).filter(r => r && r.changed);

for (const r of results) {
    const rel = path.relative(ROOT, r.file).replace(/\\/g, '/');
    const parts = [];
    if (r.added) parts.push(`+${r.added}`);
    if (r.removed.length) parts.push(`-${r.removed.join(', -')}`);
    console.log(`${rel}\t${parts.join(' | ')}`);
}
console.log(`\n${results.length} files changed.`);
