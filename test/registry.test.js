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
 * Mutating resolveMemoryBus and full scaffold flows remain integration
 * concerns. Read-only resolution and sanitized profile CLI behavior are tested.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const reg = require('../.github/scripts/_registry.cjs');
const {
    ProfileCryptoError,
    decryptEnvelope,
    encryptBuffer,
} = require('../.github/scripts/shared/profile-crypto.cjs');

// ── Module constants ──────────────────────────────────────────────────

test('exports: shape', () => {
    assert.equal(typeof reg.resolveMemoryBus, 'function');
    assert.equal(typeof reg.readMemorySecret, 'function');
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

test('resolveMemoryBus is read-only by default and does not scaffold', () => {
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-resolve-'));
    const heirRoot = path.join(parent, 'heir');
    const memoryRoot = path.join(parent, 'Alex_ACT_Memory');
    try {
        fs.mkdirSync(heirRoot);
        assert.equal(reg.resolveMemoryBus(heirRoot), null);
        assert.equal(fs.existsSync(memoryRoot), false);
    } finally { cleanup(parent); }
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

// ── Encrypted readProfile / writeProfile ──────────────────────────────

const PROFILE_PASSWORD = 'synthetic-edition-profile-password';

function mkMemoryRoot() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-memory-'));
    fs.mkdirSync(path.join(root, 'profile', 'default'), { recursive: true });
    return root;
}

function cleanup(p) {
    try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* best effort */ }
}

function withUser(fakeUser, operation) {
    const previous = {
        USER: process.env.USER,
        USERNAME: process.env.USERNAME,
        ALEX_ACT_MEMORY_PASSWORD: process.env.ALEX_ACT_MEMORY_PASSWORD,
    };
    process.env.USER = fakeUser;
    process.env.USERNAME = fakeUser;
    process.env.ALEX_ACT_MEMORY_PASSWORD = PROFILE_PASSWORD;
    try {
        return operation();
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
}

function writeEncryptedProfile(root, username, profile) {
    const dir = path.join(root, 'profile', username);
    fs.mkdirSync(dir, { recursive: true });
    const plaintext = Buffer.from(JSON.stringify(profile));
    const envelope = encryptBuffer(plaintext, PROFILE_PASSWORD);
    plaintext.fill(0);
    fs.writeFileSync(
        path.join(dir, 'user-profile.encrypted.json'),
        `${JSON.stringify(envelope, null, 2)}\n`
    );
}

function writeIgnoredEnv(root, lines) {
    spawnSync('git', ['init', '--quiet'], { cwd: root });
    fs.writeFileSync(path.join(root, '.gitignore'), '.env\n');
    fs.writeFileSync(path.join(root, '.env'), `${lines.join('\n')}\n`);
}

function withoutPasswordForUser(fakeUser, operation) {
    const previous = {
        USER: process.env.USER,
        USERNAME: process.env.USERNAME,
        ALEX_ACT_MEMORY_PASSWORD: process.env.ALEX_ACT_MEMORY_PASSWORD,
    };
    process.env.USER = fakeUser;
    process.env.USERNAME = fakeUser;
    delete process.env.ALEX_ACT_MEMORY_PASSWORD;
    try {
        return operation();
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
}

test('readProfile: returns null when no profile files exist', () => {
    const root = mkMemoryRoot();
    try {
        assert.equal(reg.readProfile(root), null);
    } finally { cleanup(root); }
});

test('readProfile: decrypts profile/default/user-profile.encrypted.json fallback', () => {
    const root = mkMemoryRoot();
    try {
        writeEncryptedProfile(root, 'default', { name: 'default-user', tier: 'baseline' });
        withUser('no-such-user-for-tests-' + Date.now(), () => {
            const profile = reg.readProfile(root);
            assert.equal(profile && profile.name, 'default-user');
            assert.equal(profile && profile.tier, 'baseline');
        });
    } finally { cleanup(root); }
});

test('readProfile: encrypted user-specific profile takes precedence over default', () => {
    const root = mkMemoryRoot();
    try {
        const fakeUser = 'test-user-' + Date.now();
        writeEncryptedProfile(root, fakeUser, { name: 'specific-user' });
        writeEncryptedProfile(root, 'default', { name: 'default-user' });
        withUser(fakeUser, () => {
            const profile = reg.readProfile(root);
            assert.equal(profile && profile.name, 'specific-user', 'user-specific path must win over default');
        });
    } finally { cleanup(root); }
});

test('readProfile: ignores legacy plaintext profile files', () => {
    const root = mkMemoryRoot();
    try {
        fs.writeFileSync(
            path.join(root, 'profile', 'default', 'user-profile.json'),
            JSON.stringify({ value: 'SYNTHETIC_PLAINTEXT_MUST_NOT_LOAD' })
        );
        withUser('no-such-user-for-tests-' + Date.now(), () => {
            assert.equal(reg.readProfile(root), null);
        });
    } finally { cleanup(root); }
});

test('readProfile: missing password skips safely while wrong password fails closed', () => {
    const root = mkMemoryRoot();
    try {
        writeEncryptedProfile(root, 'default', { name: 'default-user' });
        const previous = process.env.ALEX_ACT_MEMORY_PASSWORD;
        delete process.env.ALEX_ACT_MEMORY_PASSWORD;
        try {
            assert.equal(reg.readProfile(root, { projectRoot: root }), null);
            assert.throws(
                () => reg.readProfile(root, {
                    environment: { ALEX_ACT_MEMORY_PASSWORD: 'wrong-password' },
                    projectRoot: root,
                }),
                (cause) => cause instanceof ProfileCryptoError && cause.code === 'PROFILE_AUTH_FAILED'
            );
        } finally {
            if (previous === undefined) delete process.env.ALEX_ACT_MEMORY_PASSWORD;
            else process.env.ALEX_ACT_MEMORY_PASSWORD = previous;
        }
    } finally { cleanup(root); }
});

test('readProfile: loads the password from the authorized project env file', () => {
    const root = mkMemoryRoot();
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-project-'));
    try {
        writeEncryptedProfile(root, 'default', { name: 'env-file-user' });
        spawnSync('git', ['init', '--quiet'], { cwd: projectRoot });
        fs.writeFileSync(path.join(projectRoot, '.gitignore'), '.env\n');
        fs.writeFileSync(
            path.join(projectRoot, '.env'),
            `ALEX_ACT_MEMORY_PASSWORD="${PROFILE_PASSWORD}"\n`
        );
        const previous = process.env.ALEX_ACT_MEMORY_PASSWORD;
        delete process.env.ALEX_ACT_MEMORY_PASSWORD;
        try {
            const profile = reg.readProfile(root, { projectRoot });
            assert.equal(profile && profile.name, 'env-file-user');
        } finally {
            if (previous === undefined) delete process.env.ALEX_ACT_MEMORY_PASSWORD;
            else process.env.ALEX_ACT_MEMORY_PASSWORD = previous;
        }
    } finally {
        cleanup(root);
        cleanup(projectRoot);
    }
});

test('readProfile: falls back to the sibling Memory env file', () => {
    const root = mkMemoryRoot();
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-project-'));
    try {
        writeEncryptedProfile(root, 'default', { name: 'memory-env-user' });
        writeIgnoredEnv(root, [`ALEX_ACT_MEMORY_PASSWORD=${PROFILE_PASSWORD}`]);
        withoutPasswordForUser('no-such-user-for-tests-' + Date.now(), () => {
            const profile = reg.readProfile(root, { projectRoot });
            assert.equal(profile && profile.name, 'memory-env-user');
        });
    } finally {
        cleanup(root);
        cleanup(projectRoot);
    }
});

test('readProfile: project env overrides the sibling Memory env file', () => {
    const root = mkMemoryRoot();
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-project-'));
    try {
        writeEncryptedProfile(root, 'default', { name: 'project-env-user' });
        writeIgnoredEnv(root, ['ALEX_ACT_MEMORY_PASSWORD=wrong-memory-password']);
        writeIgnoredEnv(projectRoot, [`ALEX_ACT_MEMORY_PASSWORD=${PROFILE_PASSWORD}`]);
        withoutPasswordForUser('no-such-user-for-tests-' + Date.now(), () => {
            const profile = reg.readProfile(root, { projectRoot });
            assert.equal(profile && profile.name, 'project-env-user');
        });
    } finally {
        cleanup(root);
        cleanup(projectRoot);
    }
});

test('readMemorySecret returns one exact named value from Memory env', () => {
    const root = mkMemoryRoot();
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-project-'));
    try {
        writeIgnoredEnv(root, [
            'SYNTHETIC_SERVICE_KEY=memory-service-value',
            'UNRELATED_SECRET=must-not-return',
        ]);
        const environment = {};
        assert.equal(reg.readMemorySecret(root, 'SYNTHETIC_SERVICE_KEY', {
            environment,
            projectRoot,
        }), 'memory-service-value');
        assert.equal(environment.UNRELATED_SECRET, undefined);
        assert.equal(process.env.UNRELATED_SECRET, undefined);
    } finally {
        cleanup(root);
        cleanup(projectRoot);
    }
});

test('readMemorySecret rejects an unignored Memory env file', () => {
    const root = mkMemoryRoot();
    try {
        fs.writeFileSync(path.join(root, '.env'), 'SYNTHETIC_SERVICE_KEY=must-not-load\n');
        assert.throws(
            () => reg.readMemorySecret(root, 'SYNTHETIC_SERVICE_KEY', { environment: {} }),
            (cause) => cause instanceof ProfileCryptoError && cause.code === 'LOCAL_SECRET_ENV_NOT_IGNORED'
        );
    } finally { cleanup(root); }
});

test('writeProfile: persists only an encrypted local profile envelope', () => {
    const root = mkMemoryRoot();
    try {
        const fakeUser = 'write-test-' + Date.now();
        withUser(fakeUser, () => {
            reg.writeProfile(root, { name: fakeUser, written: true });
            const encryptedPath = path.join(root, 'profile', fakeUser, 'user-profile.encrypted.json');
            assert.equal(fs.existsSync(encryptedPath), true);
            assert.equal(fs.existsSync(path.join(root, 'profile', fakeUser, 'user-profile.json')), false);
            const envelope = JSON.parse(fs.readFileSync(encryptedPath, 'utf8'));
            const plaintext = decryptEnvelope(envelope, PROFILE_PASSWORD);
            const written = JSON.parse(plaintext.toString('utf8'));
            plaintext.fill(0);
            assert.deepEqual(written, { name: fakeUser, written: true });
        });
        assert.equal(fs.existsSync(path.join(root, '.git')), false, 'writeProfile must not initialize, commit, or push');
    } finally { cleanup(root); }
});

test('registry CLI reports profile availability without printing profile values', () => {
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-cli-'));
    const heirRoot = path.join(parent, 'heir');
    const memoryRoot = path.join(parent, 'Alex_ACT_Memory');
    const syntheticValue = 'SYNTHETIC_PROFILE_VALUE_MUST_NOT_PRINT';
    try {
        fs.mkdirSync(path.join(memoryRoot, '.git'), { recursive: true });
        fs.mkdirSync(heirRoot, { recursive: true });
        writeEncryptedProfile(memoryRoot, 'default', { value: syntheticValue });
        const result = spawnSync(process.execPath, [
            path.resolve(__dirname, '..', '.github', 'scripts', '_registry.cjs'),
            '--profile', heirRoot,
        ], {
            encoding: 'utf8',
            env: { ...process.env, ALEX_ACT_MEMORY_PASSWORD: PROFILE_PASSWORD },
        });
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /profile available/i);
        assert.equal(result.stdout.includes(syntheticValue), false);
        assert.equal(result.stderr.includes(syntheticValue), false);
    } finally { cleanup(parent); }
});
