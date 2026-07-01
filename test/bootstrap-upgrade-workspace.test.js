// @ts-check
'use strict';

/**
 * End-to-end tests for the production bootstrap/upgrade scripts.
 *
 * These tests intentionally execute the scripts rather than only testing
 * helper modules. The 2026-06-29 workflow leak was caused by a correct helper
 * that production bootstrap/upgrade never called.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

function makeRoot(prefix) {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function seedMemorySibling(baseDir) {
    const memoryRoot = path.join(baseDir, 'Alex_ACT_Memory');
    fs.mkdirSync(memoryRoot, { recursive: true });
    execFileSync('git', ['init', '--quiet'], { cwd: memoryRoot });
}

function assertNoMemorySibling(baseDir) {
    assert.equal(fs.existsSync(path.join(baseDir, 'Alex_ACT_Memory')), false, 'lifecycle scripts must not create sibling memory repo by default');
}

function copyEditionToGitRepo() {
    const source = makeRoot('edition-source-');
    fs.cpSync(REPO_ROOT, source, {
        recursive: true,
        filter: (entry) => {
            const rel = path.relative(REPO_ROOT, entry).replace(/\\/g, '/');
            if (!rel) return true;
            if (rel === '.git' || rel.startsWith('.git/')) return false;
            if (rel.startsWith('.github-backup-')) return false;
            return true;
        },
    });
    execFileSync('git', ['init', '--quiet'], { cwd: source });
    execFileSync('git', ['checkout', '-b', 'main'], { cwd: source, stdio: 'ignore' });
    execFileSync('git', ['config', 'user.email', 'test@example.invalid'], { cwd: source });
    execFileSync('git', ['config', 'user.name', 'Edition Test'], { cwd: source });
    execFileSync('git', ['add', '.'], { cwd: source });
    execFileSync('git', ['commit', '--quiet', '-m', 'test fixture'], { cwd: source });
    return source;
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runBootstrap(editionRoot, target, id) {
    execFileSync(process.execPath, [
        '.github/scripts/bootstrap-heir.cjs',
        '--target', target,
        '--heir-id', id,
        '--heir-name', id,
        '--apply',
    ], { cwd: editionRoot, stdio: 'pipe' });
}

function runUpgrade(heirRoot, editionRoot) {
    execFileSync(process.execPath, [
        '.github/scripts/upgrade-self.cjs',
        '--apply',
        '--from', editionRoot,
        '--ref', 'main',
    ], { cwd: heirRoot, stdio: 'pipe' });
}

function runUpgradeRaw(heirRoot, editionRoot) {
    return execFileSync(process.execPath, [
        '.github/scripts/upgrade-self.cjs',
        '--apply',
        '--from', editionRoot,
        '--ref', 'main',
    ], { cwd: heirRoot, stdio: 'pipe' });
}

test('bootstrap: fresh heir gets VS Code CSS, safe workspace baseline, and no Edition workflows', () => {
    const base = makeRoot('edition-bootstrap-fresh-');
    const editionRoot = copyEditionToGitRepo();
    const heirRoot = path.join(base, 'fresh-heir');
    try {
        runBootstrap(editionRoot, heirRoot, 'fresh-heir');

        assertNoMemorySibling(base);

        assert.equal(fs.existsSync(path.join(heirRoot, '.vscode/markdown-light.css')), true);
        assert.equal(fs.existsSync(path.join(heirRoot, '.vscode/settings.json')), true);
        assert.equal(fs.existsSync(path.join(heirRoot, '.github/workflows')), false);
        assert.equal(fs.existsSync(path.join(heirRoot, 'test')), false, 'root test/ folder must not be copied to heirs');

        const settings = readJson(path.join(heirRoot, '.vscode/settings.json'));
        assert.deepEqual(settings['markdown.styles'], ['.vscode/markdown-light.css']);
        assert.equal(settings['chat.permissions.default'], 'default');
        assert.equal(settings['chat.agentSkillsLocations']['.github/skills/local'], true);
        assert.equal(settings['chat.promptFilesLocations']['.github/prompts/local'], true);
        assert.equal(settings['chat.agentFilesLocations']['.github/agents/local'], true);
    } finally {
        fs.rmSync(base, { recursive: true, force: true });
        fs.rmSync(editionRoot, { recursive: true, force: true });
    }
});

test('bootstrap: existing workspace settings override user defaults while discovery keys are merged', () => {
    const base = makeRoot('edition-bootstrap-existing-');
    const editionRoot = copyEditionToGitRepo();
    const heirRoot = path.join(base, 'existing-heir');
    try {
        fs.mkdirSync(path.join(heirRoot, '.vscode'), { recursive: true });
        fs.writeFileSync(path.join(heirRoot, '.vscode/settings.json'), JSON.stringify({
            'markdown.styles': ['custom.css'],
            'chat.permissions.default': 'autoApprove',
            'editor.tabSize': 4,
        }, null, 2));

        runBootstrap(editionRoot, heirRoot, 'existing-heir');

        assertNoMemorySibling(base);

        const settings = readJson(path.join(heirRoot, '.vscode/settings.json'));
        assert.deepEqual(settings['markdown.styles'], ['custom.css']);
        assert.equal(settings['chat.permissions.default'], 'autoApprove');
        assert.equal(settings['editor.tabSize'], 4);
        assert.equal(settings['chat.agentSkillsLocations']['.github/skills/local'], true);
        assert.equal(fs.existsSync(path.join(heirRoot, '.github/workflows')), false);
        assert.equal(fs.existsSync(path.join(heirRoot, 'test')), false, 'root test/ folder must not be copied to heirs');
    } finally {
        fs.rmSync(base, { recursive: true, force: true });
        fs.rmSync(editionRoot, { recursive: true, force: true });
    }
});

test('upgrade: refreshes Edition CSS, preserves heir workflows, and does not add Edition workflows', () => {
    const base = makeRoot('edition-upgrade-workspace-');
    const editionRoot = copyEditionToGitRepo();
    const heirRoot = path.join(base, 'upgrade-heir');
    try {
        runBootstrap(editionRoot, heirRoot, 'upgrade-heir');

        assertNoMemorySibling(base);

        fs.writeFileSync(path.join(heirRoot, '.vscode/markdown-light.css'), 'stale-css');
        fs.mkdirSync(path.join(heirRoot, '.github/workflows'), { recursive: true });
        fs.writeFileSync(path.join(heirRoot, '.github/workflows/heir-owned.yml'), 'name: heir-owned\n');

        runUpgrade(heirRoot, editionRoot);

        assertNoMemorySibling(base);
        assert.equal(fs.existsSync(path.join(heirRoot, 'test')), false, 'root test/ folder must not be copied on upgrade');

        assert.notEqual(fs.readFileSync(path.join(heirRoot, '.vscode/markdown-light.css'), 'utf8'), 'stale-css');
        assert.equal(fs.existsSync(path.join(heirRoot, '.github/workflows/heir-owned.yml')), true);
        assert.deepEqual(
            fs.readdirSync(path.join(heirRoot, '.github/workflows')).sort(),
            ['heir-owned.yml']
        );
        const settings = readJson(path.join(heirRoot, '.vscode/settings.json'));
        assert.equal(settings['chat.permissions.default'], 'default');
        assert.deepEqual(settings['markdown.styles'], ['.vscode/markdown-light.css']);
    } finally {
        fs.rmSync(base, { recursive: true, force: true });
        fs.rmSync(editionRoot, { recursive: true, force: true });
    }
});

test('upgrade: relocates unknown files inside known Edition skill dirs to local', () => {
    const base = makeRoot('edition-upgrade-skill-file-');
    const editionRoot = copyEditionToGitRepo();
    const heirRoot = path.join(base, 'skill-file-heir');
    try {
        runBootstrap(editionRoot, heirRoot, 'skill-file-heir');
        const customRel = path.join('.github', 'skills', 'code-review', 'project-note.md');
        const customPath = path.join(heirRoot, customRel);
        fs.mkdirSync(path.dirname(customPath), { recursive: true });
        fs.writeFileSync(customPath, 'heir custom note');

        runUpgrade(heirRoot, editionRoot);

        assert.equal(fs.existsSync(customPath), false, 'custom file must leave edition-owned skill folder');
        assert.equal(
            fs.readFileSync(path.join(heirRoot, '.github', 'skills', 'local', 'code-review', 'project-note.md'), 'utf8'),
            'heir custom note'
        );
    } finally {
        fs.rmSync(base, { recursive: true, force: true });
        fs.rmSync(editionRoot, { recursive: true, force: true });
    }
});

test('upgrade: rolls back .github when install fails after backup rename', () => {
    const base = makeRoot('edition-upgrade-rollback-');
    const editionRoot = copyEditionToGitRepo();
    const heirRoot = path.join(base, 'rollback-heir');
    try {
        runBootstrap(editionRoot, heirRoot, 'rollback-heir');
        const markerPath = path.join(heirRoot, '.github', '.act-heir.json');
        const beforeMarker = fs.readFileSync(markerPath, 'utf8');

        const assetPath = path.join(heirRoot, '.vscode', 'markdown-light.css');
        fs.rmSync(assetPath, { force: true });
        fs.mkdirSync(assetPath, { recursive: true });

        assert.throws(() => runUpgradeRaw(heirRoot, editionRoot), /Upgrade failed|EISDIR|EPERM|illegal operation|directory/i);

        assert.equal(fs.existsSync(path.join(heirRoot, '.github')), true, '.github must be restored after failed upgrade');
        assert.equal(fs.readFileSync(markerPath, 'utf8'), beforeMarker, 'marker should be from pre-upgrade brain after rollback');
    } finally {
        fs.rmSync(base, { recursive: true, force: true });
        fs.rmSync(editionRoot, { recursive: true, force: true });
    }
});
