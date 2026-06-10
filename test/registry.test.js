// @ts-check
'use strict';

/**
 * Tests for .github/scripts/_registry.cjs — the ownership-policy module.
 *
 * Covers the non-network surface:
 *  - EDITION_OWNED / HEIR_OWNED arrays (shape, no overlap, expected paths)
 *  - Module constants (memory repo name + remote URL)
 *  - readProfile / writeProfile filesystem I/O
 *
 * Skipped here: resolveMemoryBus (spawns git; integration concern), the
 * full scaffoldMemoryRepo flow (writes 8+ files + git init), and CLI mode
 * (covered by the manifest builder's own --check test).
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const reg = require('../.github/scripts/_registry.cjs');

// ── Module constants ──────────────────────────────────────────────────

test('exports: shape', () => {
    assert.equal(typeof reg.resolveMemoryBus, 'function');
    assert.equal(typeof reg.readProfile, 'function');
    assert.equal(typeof reg.writeProfile, 'function');
    assert.equal(typeof reg.scaffoldMemoryRepo, 'function');
    assert.equal(typeof reg.MEMORY_REPO_NAME, 'string');
    assert.equal(typeof reg.MEMORY_REMOTE, 'string');
    assert.equal(Array.isArray(reg.EDITION_OWNED), true);
    assert.equal(Array.isArray(reg.HEIR_OWNED), true);
});

test('MEMORY_REPO_NAME is the canonical sibling repo name', () => {
    assert.equal(reg.MEMORY_REPO_NAME, 'Alex_ACT_Memory');
});

test('MEMORY_REMOTE points at the canonical GitHub repo', () => {
    assert.match(reg.MEMORY_REMOTE, /^https:\/\/github\.com\/[\w-]+\/Alex_ACT_Memory(\.git)?$/);
});

// ── Ownership policy invariants ───────────────────────────────────────

test('EDITION_OWNED: non-empty', () => {
    assert.equal(reg.EDITION_OWNED.length > 0, true);
});

test('EDITION_OWNED: every entry is a string', () => {
    for (const p of reg.EDITION_OWNED) {
        assert.equal(typeof p, 'string', `expected string, got ${typeof p} for ${p}`);
        assert.equal(p.length > 0, true, 'empty paths are invalid');
    }
});

test('HEIR_OWNED: every entry is a string', () => {
    for (const p of reg.HEIR_OWNED) {
        assert.equal(typeof p, 'string', `expected string, got ${typeof p} for ${p}`);
        assert.equal(p.length > 0, true, 'empty paths are invalid');
    }
});

test('ownership: EDITION_OWNED and HEIR_OWNED do not contain duplicate exact entries', () => {
    // A literal path being in BOTH is a bug — upgrade logic can't classify it.
    // Glob overlap is allowed (e.g. .github/skills/** vs .github/skills/local/**),
    // but exact-string membership in both arrays is not.
    const editionSet = new Set(reg.EDITION_OWNED);
    const overlap = reg.HEIR_OWNED.filter(p => editionSet.has(p));
    assert.deepEqual(overlap, [], `paths cannot be in both arrays: ${overlap.join(', ')}`);
});

test('EDITION_OWNED: contains the load-bearing manifest path', () => {
    // The manifest is the Edition-Extension contract per ADR-009. Removing
    // it from EDITION_OWNED would let heir-side upgrades skip overwriting
    // it, freezing the contract at install time.
    assert.equal(
        reg.EDITION_OWNED.includes('.github/config/edition-manifest.json'),
        true,
        'edition-manifest.json must be EDITION_OWNED (ADR-009 contract)'
    );
});

test('EDITION_OWNED: contains the four artifact-category globs', () => {
    for (const glob of ['.github/instructions/**', '.github/skills/**', '.github/prompts/**', '.github/agents/**']) {
        assert.equal(reg.EDITION_OWNED.includes(glob), true, `${glob} must be EDITION_OWNED`);
    }
});

test('HEIR_OWNED: contains the four local/ artifact directories', () => {
    // The local/ subdirectories are how heirs add per-project skills without
    // colliding with Edition-shipped content. Missing any of them would break
    // the bootstrap-heir + upgrade-self contract.
    for (const glob of ['.github/skills/local/**', '.github/instructions/local/**', '.github/prompts/local/**', '.github/agents/local/**']) {
        assert.equal(reg.HEIR_OWNED.includes(glob), true, `${glob} must be HEIR_OWNED`);
    }
});

test('HEIR_OWNED: contains the heir marker path', () => {
    assert.equal(
        reg.HEIR_OWNED.includes('.github/.act-heir.json'),
        true,
        '.act-heir.json must be HEIR_OWNED'
    );
});

test('HEIR_OWNED: contains the heir-local copilot-instructions overlay', () => {
    assert.equal(
        reg.HEIR_OWNED.includes('.github/copilot-instructions.local.md'),
        true,
        'the .local.md overlay must be HEIR_OWNED so upgrades do not overwrite it'
    );
});

test('HEIR_OWNED: contains workspace-settings target', () => {
    // workspace-settings-merger MERGES into this file; if it were EDITION_OWNED
    // the upgrade path would clobber heir customisations.
    assert.equal(
        reg.HEIR_OWNED.includes('.vscode/settings.json'),
        true,
        '.vscode/settings.json must be HEIR_OWNED so the merger preserves customisations'
    );
});

// ── readProfile / writeProfile ────────────────────────────────────────

function mkMemoryRoot() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-memory-'));
    fs.mkdirSync(path.join(root, 'profile', 'default'), { recursive: true });
    return root;
}

function cleanup(p) {
    try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* best effort */ }
}

test('readProfile: returns null when no profile files exist', () => {
    const root = mkMemoryRoot();
    try {
        assert.equal(reg.readProfile(root), null);
    } finally { cleanup(root); }
});

test('readProfile: returns parsed JSON from profile/default/user-profile.json fallback', () => {
    const root = mkMemoryRoot();
    try {
        fs.writeFileSync(
            path.join(root, 'profile', 'default', 'user-profile.json'),
            JSON.stringify({ name: 'default-user', tier: 'baseline' })
        );
        // Force the non-existence of a user-specific path so fallback fires.
        // (USER/USERNAME env vars are read inside readProfile; we let whatever
        // value the test env has be the lookup, and rely on the file being
        // absent at <root>/profile/<that>/user-profile.json.)
        const previous = process.env.USERNAME;
        process.env.USERNAME = 'no-such-user-for-tests-' + Date.now();
        try {
            const profile = reg.readProfile(root);
            assert.equal(profile && profile.name, 'default-user');
            assert.equal(profile && profile.tier, 'baseline');
        } finally {
            if (previous === undefined) delete process.env.USERNAME;
            else process.env.USERNAME = previous;
        }
    } finally { cleanup(root); }
});

test('readProfile: returns user-specific profile when present (takes precedence over default)', () => {
    const root = mkMemoryRoot();
    try {
        const fakeUser = 'test-user-' + Date.now();
        fs.mkdirSync(path.join(root, 'profile', fakeUser), { recursive: true });
        fs.writeFileSync(
            path.join(root, 'profile', fakeUser, 'user-profile.json'),
            JSON.stringify({ name: 'specific-user' })
        );
        // Also write a default so we can prove precedence.
        fs.writeFileSync(
            path.join(root, 'profile', 'default', 'user-profile.json'),
            JSON.stringify({ name: 'default-user' })
        );
        // Manage both USER (Unix) and USERNAME (Windows). The function reads
        // USER || USERNAME; on macOS/Linux USER is always set to the real
        // login name, so setting USERNAME alone has no effect there.
        const prevUser = process.env.USER;
        const prevUsername = process.env.USERNAME;
        process.env.USER = fakeUser;
        process.env.USERNAME = fakeUser;
        try {
            const profile = reg.readProfile(root);
            assert.equal(profile && profile.name, 'specific-user', 'user-specific path must win over default');
        } finally {
            if (prevUser === undefined) delete process.env.USER; else process.env.USER = prevUser;
            if (prevUsername === undefined) delete process.env.USERNAME; else process.env.USERNAME = prevUsername;
        }
    } finally { cleanup(root); }
});

test('readProfile: returns null when profile JSON is malformed', () => {
    const root = mkMemoryRoot();
    try {
        fs.writeFileSync(path.join(root, 'profile', 'default', 'user-profile.json'), 'NOT JSON {');
        const previous = process.env.USERNAME;
        process.env.USERNAME = 'no-such-user-for-tests-' + Date.now();
        try {
            assert.equal(reg.readProfile(root), null);
        } finally {
            if (previous === undefined) delete process.env.USERNAME;
            else process.env.USERNAME = previous;
        }
    } finally { cleanup(root); }
});

test('writeProfile: persists JSON to profile/<user>/user-profile.json', () => {
    const root = mkMemoryRoot();
    try {
        const fakeUser = 'write-test-' + Date.now();
        // Manage both USER (Unix) and USERNAME (Windows). See readProfile test
        // above for the platform-precedence rationale.
        const prevUser = process.env.USER;
        const prevUsername = process.env.USERNAME;
        process.env.USER = fakeUser;
        process.env.USERNAME = fakeUser;
        try {
            reg.writeProfile(root, { name: fakeUser, written: true });
            const written = JSON.parse(
                fs.readFileSync(path.join(root, 'profile', fakeUser, 'user-profile.json'), 'utf8')
            );
            assert.equal(written.name, fakeUser);
            assert.equal(written.written, true);
        } finally {
            if (prevUser === undefined) delete process.env.USER; else process.env.USER = prevUser;
            if (prevUsername === undefined) delete process.env.USERNAME; else process.env.USERNAME = prevUsername;
        }
    } finally { cleanup(root); }
});
