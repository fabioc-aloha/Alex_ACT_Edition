// @ts-check
'use strict';

/**
 * Tests for .github/scripts/build-edition-manifest.cjs and the resulting
 * .github/config/edition-manifest.json.
 *
 * The manifest is the Edition-Extension contract per ADR-009. Extension
 * v9.4.0+ reads it at install time to validate min_extension_version,
 * brain_subtrees, and marker_schema before any destructive op. If this
 * contract drifts silently, heirs break.
 *
 * Strategy: invoke the script as a subprocess, inspect the output. Avoids
 * having to refactor the script to expose internals.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCRIPT = path.join(REPO_ROOT, '.github', 'scripts', 'build-edition-manifest.cjs');
const MANIFEST_PATH = path.join(REPO_ROOT, '.github', 'config', 'edition-manifest.json');
const CONTRACT_SIDECAR = path.join(REPO_ROOT, '.github', 'config', 'extension-contract.json');

function runScript(args) {
    return spawnSync('node', [SCRIPT, ...args], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        timeout: 30000
    });
}

function copyEditionFixture() {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-manifest-fixture-'));
    fs.cpSync(REPO_ROOT, fixture, {
        recursive: true,
        filter: (entry) => {
            const relative = path.relative(REPO_ROOT, entry).replace(/\\/g, '/');
            if (!relative) return true;
            if (relative === '.git' || relative.startsWith('.git/')) return false;
            if (relative.startsWith('.github-backup-')) return false;
            return true;
        },
    });
    return fixture;
}

// ── --check mode (CI gate) ────────────────────────────────────────────

test('--check: exits 0 when manifest is current', () => {
    const result = runScript(['--check']);
    assert.equal(result.status, 0, `expected exit 0, got ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.match(result.stdout, /current/);
});

test('--check: exits 1 when manifest content is stale', () => {
    const fixture = copyEditionFixture();
    const fixtureManifest = path.join(fixture, '.github', 'config', 'edition-manifest.json');
    try {
        const parsed = JSON.parse(fs.readFileSync(fixtureManifest, 'utf8'));
        parsed.skills = [...parsed.skills, 'this-skill-does-not-exist'];
        fs.writeFileSync(fixtureManifest, JSON.stringify(parsed, null, 2) + '\n');

        const result = runScript(['--root', fixture, '--check']);
        assert.equal(result.status, 1, 'mutated manifest must fail --check');
        assert.match(result.stderr, /stale/i);
    } finally {
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});

test('--check: exits 1 when manifest is missing', () => {
    const fixture = copyEditionFixture();
    const fixtureManifest = path.join(fixture, '.github', 'config', 'edition-manifest.json');
    try {
        fs.unlinkSync(fixtureManifest);
        const result = runScript(['--root', fixture, '--check']);
        assert.equal(result.status, 1, 'missing manifest must fail --check');
        assert.match(result.stderr, /missing/i);
    } finally {
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});

// ── Manifest content (load-bearing for Extension v9.4.0+) ─────────────

test('manifest: file exists', () => {
    assert.equal(fs.existsSync(MANIFEST_PATH), true, 'edition-manifest.json must exist');
});

function readManifest() {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

test('manifest: spec_version is 1.4 (current contract)', () => {
    const m = readManifest();
    assert.equal(m.spec_version, '1.4', 'spec must be 1.4 per ADR-009');
});

test('manifest: edition_version is a semver string', () => {
    const m = readManifest();
    assert.match(m.edition_version, /^\d+\.\d+\.\d+/);
});

test('manifest: ADR-009 contract fields present', () => {
    const m = readManifest();
    // All three fields exist (may be null if sidecar absent, but the keys
    // must be there — Extension reads them by name).
    assert.equal('min_extension_version' in m, true, 'min_extension_version key must exist');
    assert.equal('brain_subtrees' in m, true, 'brain_subtrees key must exist');
    assert.equal('marker_schema' in m, true, 'marker_schema key must exist');
});

test('manifest: ADR-009 contract values mirror the sidecar', () => {
    // When the sidecar exists, manifest fields must equal sidecar fields.
    // Drift here would mean the generator silently dropped a contract bump.
    if (!fs.existsSync(CONTRACT_SIDECAR)) {
        assert.fail('extension-contract.json sidecar missing — contract fields would be null');
    }
    const sidecar = JSON.parse(fs.readFileSync(CONTRACT_SIDECAR, 'utf8'));
    const m = readManifest();
    assert.equal(m.min_extension_version, sidecar.min_extension_version);
    assert.deepEqual(m.brain_subtrees, sidecar.brain_subtrees);
    assert.deepEqual(m.marker_schema, sidecar.marker_schema);
});

test('manifest: all listed skills resolve to real directories', () => {
    const m = readManifest();
    for (const skill of m.skills) {
        const skillDir = path.join(REPO_ROOT, '.github', 'skills', skill);
        assert.equal(fs.existsSync(skillDir), true, `manifest declares skill "${skill}" but ${skillDir} does not exist`);
        assert.equal(fs.statSync(skillDir).isDirectory(), true);
    }
});

test('manifest: all listed instructions resolve to real files', () => {
    const m = readManifest();
    for (const inst of m.instructions) {
        const instPath = path.join(REPO_ROOT, '.github', 'instructions', inst);
        assert.equal(fs.existsSync(instPath), true, `manifest declares instruction "${inst}" but file does not exist`);
    }
});

test('manifest: all listed prompts resolve to real files', () => {
    const m = readManifest();
    for (const p of m.prompts) {
        const promptPath = path.join(REPO_ROOT, '.github', 'prompts', p);
        assert.equal(fs.existsSync(promptPath), true, `manifest declares prompt "${p}" but file does not exist`);
    }
});

test('manifest: all listed agents resolve to real files', () => {
    const m = readManifest();
    for (const a of m.agents) {
        const agentPath = path.join(REPO_ROOT, '.github', 'agents', a);
        assert.equal(fs.existsSync(agentPath), true, `manifest declares agent "${a}" but file does not exist`);
    }
});

test('manifest: skip-local discipline (no "local/" entries in any category)', () => {
    const m = readManifest();
    // Each list-builder filters out `local/` per HEIR_OWNED contract. A
    // mutation that breaks the filter would leak heir-side scaffolding
    // into the Edition manifest. Pin the contract.
    const allEntries = [
        ...m.skills,
        ...m.skill_files,
        ...m.instructions,
        ...m.prompts,
        ...m.agents,
        ...m.scripts
    ];
    for (const entry of allEntries) {
        assert.equal(entry.includes('local/'), false, `manifest must not list local/ entries; got "${entry}"`);
    }
});

test('manifest: regenerates without leaking local/ entries (active filter test)', () => {
    // Edition source tree has no local/ dirs in production, so the static
    // skip-local test above passes trivially even if the filter is removed.
    // This test creates temporary local/ subdirs under each category,
    // regenerates the manifest, and verifies the filter actually fires.

    const fixture = copyEditionFixture();
    const fixtureManifest = path.join(fixture, '.github', 'config', 'edition-manifest.json');
    const tempDirs = [
        path.join(fixture, '.github', 'skills', 'local', '__test-local-skill__'),
        path.join(fixture, '.github', 'instructions', 'local'),
        path.join(fixture, '.github', 'prompts', 'local'),
        path.join(fixture, '.github', 'agents', 'local'),
        path.join(fixture, '.github', 'scripts', 'local')
    ];
    const tempFiles = [
        path.join(tempDirs[0], 'SKILL.md'),
        path.join(tempDirs[1], 'test-local.instructions.md'),
        path.join(tempDirs[2], 'test-local.prompt.md'),
        path.join(tempDirs[3], 'test-local.agent.md'),
        path.join(tempDirs[4], 'test-local.cjs')
    ];

    try {
        // Seed temp local/ dirs + sentinel files.
        for (const d of tempDirs) fs.mkdirSync(d, { recursive: true });
        for (const f of tempFiles) fs.writeFileSync(f, '<!-- test sentinel -->\n');

        // Regenerate the manifest (no --check; write mode).
        const result = spawnSync('node', [SCRIPT, '--root', fixture], { cwd: REPO_ROOT, encoding: 'utf8', timeout: 30000 });
        assert.equal(result.status, 0, `regen failed: ${result.stderr}`);

        // Read the freshly-written manifest, assert no local/ leakage.
        const fresh = JSON.parse(fs.readFileSync(fixtureManifest, 'utf8'));
        const allEntries = [
            ...fresh.skills,
            ...fresh.skill_files,
            ...fresh.instructions,
            ...fresh.prompts,
            ...fresh.agents,
            ...fresh.scripts
        ];
        const leaks = allEntries.filter(e => e === 'local' || e.includes('local/'));
        assert.deepEqual(leaks, [],
            'local/ entries leaked into manifest despite filter — the local-filter logic regressed'
        );
    } finally {
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});

test('manifest: bootstrap_templates only contains literal (non-glob) paths', () => {
    const m = readManifest();
    for (const tmpl of m.bootstrap_templates) {
        assert.equal(tmpl.includes('*'), false, `bootstrap_templates must be literal paths; got "${tmpl}"`);
        const abs = path.join(REPO_ROOT, tmpl);
        assert.equal(fs.existsSync(abs), true, `bootstrap_templates entry "${tmpl}" does not exist`);
        assert.equal(fs.statSync(abs).isFile(), true, `bootstrap_templates entry "${tmpl}" is not a file`);
    }
});

test('manifest: root test folder is never part of the heir install contract', () => {
    const m = readManifest();
    assert.equal((m.brain_subtrees || []).includes('test'), false, 'test/ must not be a brain_subtree');
    assert.equal((m.vscode_assets || []).some((entry) => String(entry).startsWith('test')), false, 'test/ must not be a vscode_asset');
    assert.equal((m.bootstrap_templates || []).some((entry) => String(entry).startsWith('test/')), false, 'test/ must not be a bootstrap_template');
});
