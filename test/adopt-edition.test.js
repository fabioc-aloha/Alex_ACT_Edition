'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const {
    applyAdoptionPlan,
    createAdoptionPlan,
    rollbackAdoption,
} = require(path.join(ROOT, '.github', 'scripts', 'adopt-edition.cjs'));

function makeGitRepo(prefix) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'test@example.invalid'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'Universal Edition Test'], { cwd: root });
    fs.writeFileSync(path.join(root, 'README.md'), '# Existing project\n');
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['commit', '--quiet', '-m', 'baseline'], { cwd: root });
    return root;
}

function snapshot(root) {
    const result = new Map();
    function walk(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            if (entry.name === '.git' || entry.name === '.act-backups') continue;
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) walk(absolute);
            else if (entry.isFile()) {
                result.set(path.relative(root, absolute).replace(/\\/g, '/'), fs.readFileSync(absolute));
            }
        }
    }
    walk(root);
    return result;
}

function assertSnapshot(actualRoot, expected) {
    const actual = snapshot(actualRoot);
    assert.deepEqual([...actual.keys()].sort(), [...expected.keys()].sort());
    for (const [relative, bytes] of expected) {
        assert.deepEqual(actual.get(relative), bytes, relative);
    }
}

test('plan has a deterministic hash and dry-run does not mutate target', () => {
    const target = makeGitRepo('universal-edition-plan-');
    try {
        const before = snapshot(target);
        const first = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        const second = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.match(first.plan_hash, /^[a-f0-9]{64}$/);
        assert.equal(first.plan_hash, second.plan_hash);
        assertSnapshot(target, before);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});

test('apply installs copilot-app profile, preserves project files, and supports manual rollback', () => {
    const target = makeGitRepo('universal-edition-apply-');
    try {
        fs.mkdirSync(path.join(target, '.github', 'workflows'), { recursive: true });
        fs.writeFileSync(path.join(target, '.github', 'workflows', 'project.yml'), 'name: project\n');
        execFileSync('git', ['add', '.'], { cwd: target });
        execFileSync('git', ['commit', '--quiet', '-m', 'project workflow'], { cwd: target });
        const before = snapshot(target);
        const plan = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.deepEqual(plan.conflicts, []);

        const result = applyAdoptionPlan({ plan, acceptedPlanHash: plan.plan_hash });
        assert.equal(result.ok, true);
        assert.equal(fs.existsSync(path.join(target, '.github', '.act-heir.json')), true);
        assert.equal(fs.existsSync(path.join(target, '.github', 'instructions', 'act-decision.instructions.md')), true);
        assert.equal(fs.existsSync(path.join(target, '.github', 'skills', 'plan-and-track', 'SKILL.md')), true);
        assert.equal(fs.existsSync(path.join(target, '.github', 'workflows', 'project.yml')), true);
        assert.equal(fs.existsSync(path.join(target, '.vscode', 'markdown-light.css')), false);
        assert.equal(fs.existsSync(path.join(result.backup_dir, 'backup-manifest.json')), true);

        rollbackAdoption({ targetRoot: target, backupDir: result.backup_dir });
        assertSnapshot(target, before);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});

test('apply refuses unresolved conflicts', () => {
    const target = makeGitRepo('universal-edition-conflict-');
    try {
        fs.mkdirSync(path.join(target, '.github', 'instructions'), { recursive: true });
        fs.writeFileSync(path.join(target, '.github', 'instructions', 'act-pass.instructions.md'), 'project collision\n');
        execFileSync('git', ['add', '.'], { cwd: target });
        execFileSync('git', ['commit', '--quiet', '-m', 'collision'], { cwd: target });
        const before = snapshot(target);
        const plan = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.equal(plan.conflicts.some(item => item.path === '.github/instructions/act-pass.instructions.md'), true);
        assert.throws(
            () => applyAdoptionPlan({ plan, acceptedPlanHash: plan.plan_hash }),
            /Unresolved conflicts/,
        );
        assertSnapshot(target, before);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});

test('injected failure rolls back every touched path automatically', () => {
    const target = makeGitRepo('universal-edition-failure-');
    try {
        const before = snapshot(target);
        const plan = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.throws(
            () => applyAdoptionPlan({
                plan,
                acceptedPlanHash: plan.plan_hash,
                injectFailureAfter: 3,
            }),
            /Injected adoption failure/,
        );
        assertSnapshot(target, before);
        assert.equal(fs.existsSync(path.join(target, '.github', '.act-heir.json')), false);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});

test('downgrade plan requires explicit authorization', () => {
    const target = makeGitRepo('universal-edition-downgrade-');
    try {
        fs.mkdirSync(path.join(target, '.github'), { recursive: true });
        fs.writeFileSync(path.join(target, '.github', '.act-heir.json'), JSON.stringify({
            edition: 'Alex_ACT_Edition',
            edition_version: '9.0.0',
            profile: 'copilot-app',
        }, null, 2) + '\n');
        execFileSync('git', ['add', '.'], { cwd: target });
        execFileSync('git', ['commit', '--quiet', '-m', 'newer edition marker'], { cwd: target });
        const before = snapshot(target);
        const plan = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.equal(plan.direction, 'downgrade');
        assert.throws(
            () => applyAdoptionPlan({ plan, acceptedPlanHash: plan.plan_hash }),
            /Downgrade requires explicit authorization/,
        );
        assertSnapshot(target, before);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});
