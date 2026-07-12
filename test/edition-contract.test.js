// @ts-check
'use strict';

/**
 * Edition contract pinning test.
 *
 * The shipped .github/config/edition-manifest.json is the contract that
 * Alex_ACT_Extension v9.4.0+ reads at install time (ADR-009). This test
 * pins the load-bearing fields so any silent regression in the generator
 * or in the extension-contract.json sidecar fails CI before publish.
 *
 * Distinct from build-edition-manifest.test.js: that file tests the
 * GENERATOR; this file tests the SHIPPED ARTIFACT (the live manifest the
 * Extension will fetch). Both are needed — generator could be correct
 * while the manifest is stale.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(REPO_ROOT, '.github', 'config', 'edition-manifest.json');
const SIDECAR = path.join(REPO_ROOT, '.github', 'config', 'extension-contract.json');
const VERSION = path.join(REPO_ROOT, '.github', 'VERSION');
const PACKAGE = path.join(REPO_ROOT, 'package.json');
const README = path.join(REPO_ROOT, 'README.md');

function readJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

test('contract: manifest file exists', () => {
    assert.equal(fs.existsSync(MANIFEST), true);
});

test('contract: sidecar file exists', () => {
    assert.equal(fs.existsSync(SIDECAR), true);
});

test('contract: spec_version is at least 1.4', () => {
    const m = readJson(MANIFEST);
    // 1.4 is the first spec version with the static-fetch contract.
    // Bumps to 1.5+ are allowed; downgrades break Extension v9.4.0.
    const [major, minor] = String(m.spec_version).split('.').map(Number);
    assert.equal(major >= 1, true, `spec_version major ${major} must be ≥ 1`);
    if (major === 1) {
        assert.equal(minor >= 4, true, `spec_version 1.${minor} must be 1.4 or later for ADR-009`);
    }
});

test('contract: min_extension_version is a non-empty semver string', () => {
    const m = readJson(MANIFEST);
    assert.equal(typeof m.min_extension_version, 'string', 'must be a string');
    assert.match(m.min_extension_version, /^\d+\.\d+\.\d+/, 'must look like semver');
});

test('contract: brain_subtrees is a non-empty array of strings', () => {
    const m = readJson(MANIFEST);
    assert.equal(Array.isArray(m.brain_subtrees), true);
    assert.equal(m.brain_subtrees.length > 0, true, 'at least one subtree is required');
    for (const sub of m.brain_subtrees) {
        assert.equal(typeof sub, 'string');
        assert.equal(sub.length > 0, true);
        assert.equal(sub.includes('..'), false, 'no .. segments allowed in brain_subtrees');
    }
});

test('contract: every brain_subtree resolves to a real directory', () => {
    const m = readJson(MANIFEST);
    for (const sub of m.brain_subtrees) {
        const abs = path.join(REPO_ROOT, sub);
        assert.equal(fs.existsSync(abs), true, `brain_subtrees declares "${sub}" but ${abs} does not exist`);
        assert.equal(fs.statSync(abs).isDirectory(), true, `${sub} is not a directory`);
    }
});

test('contract: marker_schema has file_name (string) and version (number)', () => {
    const m = readJson(MANIFEST);
    assert.equal(typeof m.marker_schema, 'object');
    assert.equal(m.marker_schema === null, false);
    assert.equal(typeof m.marker_schema.file_name, 'string');
    assert.equal(typeof m.marker_schema.version, 'number');
    assert.equal(m.marker_schema.version >= 1, true);
});

test('contract: manifest and sidecar agree on min_extension_version', () => {
    const m = readJson(MANIFEST);
    const s = readJson(SIDECAR);
    assert.equal(m.min_extension_version, s.min_extension_version,
        'sidecar drift: manifest was generated from a different sidecar than the one on disk');
});

test('contract: manifest and sidecar agree on brain_subtrees', () => {
    const m = readJson(MANIFEST);
    const s = readJson(SIDECAR);
    assert.deepEqual(m.brain_subtrees, s.brain_subtrees, 'sidecar drift');
});

test('contract: manifest and sidecar agree on marker_schema', () => {
    const m = readJson(MANIFEST);
    const s = readJson(SIDECAR);
    assert.deepEqual(m.marker_schema, s.marker_schema, 'sidecar drift');
});

test('contract: marker_schema.file_name is .act-heir.json (Extension reads this name)', () => {
    const m = readJson(MANIFEST);
    // The Extension's installFromTarball uses marker_schema.file_name as the
    // path to write. Changing this name is a breaking change for every
    // existing heir. Pin it.
    assert.equal(m.marker_schema.file_name, '.act-heir.json');
});

test('metadata: VERSION matches manifest edition_version', () => {
    const manifest = readJson(MANIFEST);
    const version = fs.readFileSync(VERSION, 'utf8').trim();
    assert.equal(version, manifest.edition_version);
});

test('metadata: private package does not duplicate the Edition version', () => {
    const packageJson = readJson(PACKAGE);
    assert.equal(packageJson.private, true);
    assert.equal(Object.prototype.hasOwnProperty.call(packageJson, 'version'), false);
});

test('metadata: active README inventory counts match the manifest', () => {
    const manifest = readJson(MANIFEST);
    const readme = fs.readFileSync(README, 'utf8');
    const checks = [
        ['skills', manifest.skills.length, /\b(\d+)\s+skills\b/gi],
        ['instructions', manifest.instructions.length, /\b(\d+)\s+instructions\b/gi],
        ['prompts', manifest.prompts.length, /\b(\d+)\s+prompts\b/gi],
        ['agents', manifest.agents.length, /\b(\d+)\s+(?:worker\s+)?agents\b/gi],
    ];
    for (const [label, expected, pattern] of checks) {
        const values = [...readme.matchAll(pattern)].map((match) => Number(match[1]));
        assert.equal(values.length > 0, true, `README has no active ${label} count`);
        assert.deepEqual(values, values.map(() => expected),
            `README ${label} counts ${values.join(', ')} must all equal manifest count ${expected}`);
    }
});

test('heir-doctor scans shipped skill files when local skills exist', () => {
    const heirRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-heir-doctor-'));
    const githubRoot = path.join(heirRoot, '.github');
    const doctorSource = path.join(REPO_ROOT, '.github', 'skills', 'greeting-checkin', 'scripts', 'heir-doctor.cjs');
    const write = (relativePath, content) => {
        const absolutePath = path.join(heirRoot, relativePath);
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, content);
    };

    try {
        write('.github/.act-heir.json', JSON.stringify({
            heir_id: 'doctor-regression',
            edition_version: '4.0.1',
            last_sync_at: new Date().toISOString(),
        }));
        write('.github/VERSION', '4.0.1\n');
        write('.github/scripts/_registry.cjs', 'module.exports = { EDITION_OWNED: [".github/**"], HEIR_OWNED: [".github/skills/local/**"] };\n');
        write('.github/scripts/upgrade-self.cjs', '');
        write('.github/scripts/bootstrap-heir.cjs', '');
        write('.github/config/cognitive-config.json', '{}\n');
        write('.github/config/edition-manifest.json', JSON.stringify({
            skills: ['greeting-checkin', 'shipped-skill'],
            skill_files: [
                'greeting-checkin/scripts/heir-doctor.cjs',
                'shipped-skill/SKILL.md',
            ],
            prompts: [],
            agents: [],
        }));
        write('.github/copilot-instructions.local.md', '# Local identity\n');
        write('.github/skills/shipped-skill/SKILL.md', '# Shipped\n');
        write('.github/skills/local/custom-skill/SKILL.md', '# Local\n');
        const doctorPath = path.join(githubRoot, 'skills', 'greeting-checkin', 'scripts', 'heir-doctor.cjs');
        fs.mkdirSync(path.dirname(doctorPath), { recursive: true });
        fs.copyFileSync(doctorSource, doctorPath);

        const result = spawnSync(process.execPath, [doctorPath, '--json'], {
            cwd: heirRoot,
            encoding: 'utf8',
        });

        assert.equal(result.status, 0, result.stderr || result.stdout);
        const findings = JSON.parse(result.stdout);
        assert.deepEqual(findings.errors, []);
        assert.deepEqual(findings.warnings, []);
    } finally {
        fs.rmSync(heirRoot, { recursive: true, force: true });
    }
});
