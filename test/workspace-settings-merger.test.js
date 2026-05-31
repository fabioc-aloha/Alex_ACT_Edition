// @ts-check
'use strict';

/**
 * Tests for .github/scripts/shared/workspace-settings-merger.cjs.
 *
 * The merger is the load-bearing helper that lets bootstrap-heir.cjs and
 * upgrade-self.cjs lay an Edition-shipped baseline over a heir's
 * .vscode/settings.json WITHOUT clobbering heir customisations. A
 * regression here either drops heir settings (data loss) or fails to
 * apply baseline keys (broken UX).
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
    mergeWorkspaceSettings,
    writeMerged,
    formatChangeSummary
} = require('../.github/scripts/shared/workspace-settings-merger.cjs');

// ── Helpers ───────────────────────────────────────────────────────────

function mkRepoRoot() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'merger-repo-'));
}

function mkBaseline(settings) {
    const file = path.join(os.tmpdir(), `merger-baseline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`);
    fs.writeFileSync(file, JSON.stringify({ settings }, null, 2));
    return file;
}

function cleanup(p) {
    try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* best effort */ }
}

// ── mergeWorkspaceSettings: happy paths ───────────────────────────────

test('merge: applies baseline keys to empty settings.json', () => {
    const repo = mkRepoRoot();
    const baseline = mkBaseline({ 'editor.fontSize': 14, 'files.autoSave': 'onFocusChange' });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.ok, true);
        assert.equal(result.existed, false, 'no settings.json existed yet');
        assert.equal(result.changes.length, 2);
        assert.equal(result.merged['editor.fontSize'], 14);
        assert.equal(result.merged['files.autoSave'], 'onFocusChange');
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: preserves heir-only keys absent from baseline', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'editor.fontFamily': 'Cascadia Code',
        'workbench.colorTheme': 'Solarized Dark'
    }));
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.merged['editor.fontFamily'], 'Cascadia Code', 'heir-only key must be preserved');
        assert.equal(result.merged['workbench.colorTheme'], 'Solarized Dark', 'heir-only key must be preserved');
        assert.equal(result.merged['editor.fontSize'], 14, 'baseline key must be applied');
        assert.equal(result.changes.length, 1, 'only the baseline key counts as a change');
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: heir override of baseline key is replaced (baseline wins)', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'editor.fontSize': 11
    }));
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.merged['editor.fontSize'], 14, 'baseline value overrides heir value for keys baseline declares');
        assert.equal(result.changes.length, 1);
        assert.equal(result.changes[0].from, 11);
        assert.equal(result.changes[0].to, 14);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: no-op when settings already match baseline', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'editor.fontSize': 14
    }));
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.changes.length, 0, 'no changes when values already match');
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

// ── mergeWorkspaceSettings: deep merge of nested objects ──────────────

test('merge: deep-merges nested object keys', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'chat.tools': { 'heir.custom.tool': true, 'baseline.tool.A': false }
    }));
    const baseline = mkBaseline({
        'chat.tools': { 'baseline.tool.A': true, 'baseline.tool.B': true }
    });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        // Heir's tool preserved
        assert.equal(result.merged['chat.tools']['heir.custom.tool'], true);
        // Baseline.tool.A overridden (was false, baseline says true)
        assert.equal(result.merged['chat.tools']['baseline.tool.A'], true);
        // Baseline.tool.B added
        assert.equal(result.merged['chat.tools']['baseline.tool.B'], true);
        // Two effective sub-key changes (A and B), heir-only key not in changes list
        assert.equal(result.changes.length, 2);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: non-object scalar at heir position with object in baseline replaces wholesale', () => {
    // Edge case: heir has `chat.tools: "string"`, baseline says object.
    // Per the merger: existing non-object is treated as empty, baseline
    // wins; heir's string is discarded.
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'chat.tools': 'oops-not-an-object'
    }));
    const baseline = mkBaseline({
        'chat.tools': { 'baseline.tool': true }
    });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.deepEqual(result.merged['chat.tools'], { 'baseline.tool': true });
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

// ── mergeWorkspaceSettings: change tracking ───────────────────────────

test('merge: change records carry from/to/sub for nested edits', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({
        'chat.tools': { 'X': false }
    }));
    const baseline = mkBaseline({
        'chat.tools': { 'X': true }
    });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.changes.length, 1);
        const c = result.changes[0];
        assert.equal(c.key, 'chat.tools');
        assert.equal(c.sub, 'X');
        assert.equal(c.from, false);
        assert.equal(c.to, true);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: change records carry sub:null for top-level scalar changes', () => {
    const repo = mkRepoRoot();
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.changes[0].sub, null, 'top-level scalar change has sub:null');
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

// ── JSONC tolerance ──────────────────────────────────────────────────

test('merge: parses JSONC settings (// line comments)', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'),
        '// header comment\n{\n  "editor.fontSize": 12\n}'
    );
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.ok, true, 'JSONC must parse cleanly');
        assert.equal(result.hadComments, true, 'hadComments flag must surface');
        assert.equal(result.merged['editor.fontSize'], 14);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: parses JSONC settings (block comments)', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'),
        '{\n  /* block comment */\n  "editor.fontSize": 12\n}'
    );
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.ok, true, 'JSONC block comments must parse');
        assert.equal(result.hadComments, true);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('merge: hadComments is false when no comments present', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({ a: 1 }));
    const baseline = mkBaseline({ b: 2 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.hadComments, false);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

// ── Error paths ───────────────────────────────────────────────────────

test('merge: returns ok:false when baseline is unreadable', () => {
    const repo = mkRepoRoot();
    const bogusBaseline = path.join(os.tmpdir(), 'no-such-baseline-' + Date.now() + '.json');
    try {
        const result = mergeWorkspaceSettings(repo, bogusBaseline);
        assert.equal(result.ok, false);
        assert.match(result.error, /Cannot read baseline/);
    } finally { cleanup(repo); }
});

test('merge: returns ok:false when heir settings.json is malformed JSON', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), '{ not valid');
    const baseline = mkBaseline({ a: 1 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        assert.equal(result.ok, false);
        assert.match(result.error, /not valid JSON\/JSONC/);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

// ── writeMerged + formatChangeSummary ─────────────────────────────────

test('writeMerged: persists merged object to settings.json', () => {
    const repo = mkRepoRoot();
    const baseline = mkBaseline({ 'editor.fontSize': 14 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        writeMerged(result);
        const persisted = JSON.parse(fs.readFileSync(path.join(repo, '.vscode', 'settings.json'), 'utf8'));
        assert.equal(persisted['editor.fontSize'], 14);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('writeMerged: creates .vscode/ if missing', () => {
    const repo = mkRepoRoot();
    const baseline = mkBaseline({ a: 1 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        writeMerged(result);
        assert.equal(fs.existsSync(path.join(repo, '.vscode')), true);
        assert.equal(fs.existsSync(path.join(repo, '.vscode', 'settings.json')), true);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('formatChangeSummary: "already current" message when no changes', () => {
    const repo = mkRepoRoot();
    fs.mkdirSync(path.join(repo, '.vscode'));
    fs.writeFileSync(path.join(repo, '.vscode', 'settings.json'), JSON.stringify({ a: 1 }));
    const baseline = mkBaseline({ a: 1 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        const summary = formatChangeSummary(result, 'Applied');
        assert.match(summary, /already current/);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('formatChangeSummary: verb is interpolated into change summary', () => {
    const repo = mkRepoRoot();
    const baseline = mkBaseline({ a: 1 });
    try {
        const result = mergeWorkspaceSettings(repo, baseline);
        const summary = formatChangeSummary(result, 'Would apply');
        assert.match(summary, /Would apply/);
    } finally { cleanup(repo); fs.unlinkSync(baseline); }
});

test('formatChangeSummary: surfaces error from failed merge', () => {
    const summary = formatChangeSummary({ ok: false, error: 'something blew up' }, 'Applied');
    assert.match(summary, /something blew up/);
});
