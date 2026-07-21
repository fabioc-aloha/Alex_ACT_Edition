#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function normalize(relativePath) {
    return relativePath.replace(/\\/g, '/');
}

function hashFile(filePath) {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function compareVersions(left, right) {
    const parse = (value) => String(value || '0.0.0').split('.').map(part => Number.parseInt(part, 10) || 0);
    const a = parse(left);
    const b = parse(right);
    for (let index = 0; index < 3; index++) {
        if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
    }
    return 0;
}

function walk(root) {
    if (!fs.existsSync(root)) return [];
    const files = [];
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const absolute = path.join(root, entry.name);
        if (entry.isDirectory()) files.push(...walk(absolute));
        else if (entry.isFile()) files.push(absolute);
    }
    return files;
}

function desiredFiles(sourceRoot, profile) {
    const files = new Map();
    const githubRoot = path.join(sourceRoot, '.github');
    for (const absolute of walk(githubRoot)) {
        const relative = normalize(path.relative(sourceRoot, absolute));
        if (relative.startsWith('.github/core/instructions/')) continue;
        if (relative.startsWith('.github/core/skills/')) continue;
        if (relative.startsWith('.github/profiles/')) continue;
        files.set(relative, absolute);
    }

    for (const absolute of walk(path.join(sourceRoot, '.github', 'core', 'instructions'))) {
        const base = path.basename(absolute);
        files.set(`.github/instructions/act-${base}`, absolute);
    }
    for (const operation of fs.readdirSync(path.join(sourceRoot, '.github', 'core', 'skills'))) {
        const operationRoot = path.join(sourceRoot, '.github', 'core', 'skills', operation);
        for (const absolute of walk(operationRoot)) {
            const suffix = normalize(path.relative(operationRoot, absolute));
            files.set(`.github/skills/${operation}/${suffix}`, absolute);
        }
    }
    for (const absolute of walk(path.join(sourceRoot, '.github', 'core', 'templates'))) {
        const suffix = normalize(path.relative(path.join(sourceRoot, '.github', 'core', 'templates'), absolute));
        files.set(`.github/core/templates/${suffix}`, absolute);
    }

    if (profile === 'vscode') {
        const promptRoot = path.join(sourceRoot, '.github', 'profiles', 'vscode', 'prompts');
        for (const absolute of walk(promptRoot)) {
            files.set(`.github/prompts/${path.basename(absolute)}`, absolute);
        }
        for (const absolute of walk(path.join(sourceRoot, '.vscode'))) {
            files.set(normalize(path.relative(sourceRoot, absolute)), absolute);
        }
    }

    if (profile === 'copilot-app') {
        for (const relative of [...files.keys()]) {
            if (relative.startsWith('.vscode/')) files.delete(relative);
        }
        files.delete('.github/config/heir-workspace-settings-baseline.json');
        files.delete('.github/config/welcome-baseline.json');
    }
    return files;
}

function createAdoptionPlan({ sourceRoot, targetRoot, profile }) {
    if (!['vscode', 'copilot-app'].includes(profile)) {
        throw new Error(`Unknown profile: ${profile}`);
    }
    if (!fs.existsSync(path.join(targetRoot, '.git'))) {
        throw new Error('Target must be a Git repository');
    }

    const desired = desiredFiles(sourceRoot, profile);
    const operations = [];
    const desiredPaths = new Set(desired.keys());
    for (const [relative, source] of [...desired.entries()].sort(([left], [right]) => left.localeCompare(right))) {
        const target = path.join(targetRoot, relative);
        if (!fs.existsSync(target)) {
            operations.push({ path: relative, action: 'create', source_hash: hashFile(source) });
            continue;
        }
        const sourceHash = hashFile(source);
        const targetHash = hashFile(target);
        operations.push({
            path: relative,
            action: sourceHash === targetHash ? 'identical' : 'conflict',
            source_hash: sourceHash,
            target_hash: targetHash,
        });
    }

    const preserved = [];
    for (const absolute of walk(targetRoot)) {
        const relative = normalize(path.relative(targetRoot, absolute));
        if (relative === '.git' || relative.startsWith('.git/')) continue;
        if (!desiredPaths.has(relative)) preserved.push({ path: relative, action: 'preserve' });
    }

    preserved.sort((left, right) => left.path.localeCompare(right.path));
    const editionVersion = fs.readFileSync(path.join(sourceRoot, '.github', 'VERSION'), 'utf8').trim();
    const markerPath = path.join(targetRoot, '.github', '.act-heir.json');
    let currentVersion = null;
    if (fs.existsSync(markerPath)) {
        try {
            currentVersion = JSON.parse(fs.readFileSync(markerPath, 'utf8')).edition_version || null;
        } catch {
            throw new Error('Existing ACT marker is invalid JSON');
        }
    }
    const comparison = currentVersion === null ? null : compareVersions(editionVersion, currentVersion);
    const direction = currentVersion === null
        ? 'install'
        : comparison > 0 ? 'upgrade' : comparison < 0 ? 'downgrade' : 'repair';
    const plan = {
        spec_version: '1.0',
        mode: 'dry-run',
        profile,
        edition_version: editionVersion,
        current_version: currentVersion,
        direction,
        source_root: path.resolve(sourceRoot),
        target_root: path.resolve(targetRoot),
        operations,
        conflicts: operations.filter(item => item.action === 'conflict'),
        preserved,
        marker: {
            path: '.github/.act-heir.json',
            edition: 'Alex_ACT_Edition',
            edition_version: editionVersion,
            profile,
        },
    };
    plan.plan_hash = hashValue(JSON.stringify(plan));
    return plan;
}

function ensureCleanGit(targetRoot) {
    let status;
    try {
        status = execFileSync('git', ['status', '--porcelain'], {
            cwd: targetRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    } catch (error) {
        throw new Error(`Cannot inspect target Git state: ${error.message}`);
    }
    if (status.trim()) throw new Error('Target Git worktree must be clean before apply');
    for (const statePath of [
        '.git/MERGE_HEAD',
        '.git/rebase-merge',
        '.git/rebase-apply',
    ]) {
        if (fs.existsSync(path.join(targetRoot, statePath))) {
            throw new Error('Target has an active merge or rebase');
        }
    }
}

function copyFile(source, target) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
}

function removeEmptyParents(filePath, stopRoot) {
    let current = path.dirname(filePath);
    const stop = path.resolve(stopRoot);
    while (current.startsWith(stop) && current !== stop) {
        try {
            if (fs.readdirSync(current).length > 0) return;
            fs.rmdirSync(current);
        } catch {
            return;
        }
        current = path.dirname(current);
    }
}

function rollbackAdoption({ targetRoot, backupDir }) {
    const manifestPath = path.join(backupDir, 'backup-manifest.json');
    if (!fs.existsSync(manifestPath)) throw new Error('Backup manifest is missing');
    const backup = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (path.resolve(targetRoot) !== path.resolve(backup.target_root)) {
        throw new Error('Backup target does not match requested rollback target');
    }

    for (const relative of [...backup.created].sort().reverse()) {
        const target = path.join(targetRoot, relative);
        if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
        removeEmptyParents(target, targetRoot);
    }
    for (const relative of backup.overwritten) {
        copyFile(path.join(backupDir, 'files', relative), path.join(targetRoot, relative));
    }
    fs.rmSync(backupDir, { recursive: true, force: true });
    removeEmptyParents(backupDir, targetRoot);
    return { ok: true, restored: backup.overwritten.length, removed: backup.created.length };
}

function applyAdoptionPlan({
    plan,
    acceptedPlanHash,
    conflictResolutions = {},
    injectFailureAfter = null,
    allowDowngrade = false,
}) {
    if (!plan || plan.spec_version !== '1.0') throw new Error('Unsupported adoption plan');
    const suppliedHash = plan.plan_hash;
    const hashInput = { ...plan };
    delete hashInput.plan_hash;
    const expectedHash = hashValue(JSON.stringify(hashInput));
    if (suppliedHash !== expectedHash || acceptedPlanHash !== expectedHash) {
        throw new Error('Accepted plan hash does not match the adoption plan');
    }
    if (plan.direction === 'downgrade' && !allowDowngrade) {
        throw new Error('Downgrade requires explicit authorization');
    }
    ensureCleanGit(plan.target_root);

    const unresolved = plan.conflicts.filter(item => !['overwrite', 'preserve'].includes(conflictResolutions[item.path]));
    if (unresolved.length > 0) {
        throw new Error(`Unresolved conflicts: ${unresolved.map(item => item.path).join(', ')}`);
    }

    const desired = desiredFiles(plan.source_root, plan.profile);
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const backupDir = path.join(plan.target_root, '.act-backups', `${timestamp}-${expectedHash.slice(0, 8)}`);
    const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'universal-edition-stage-'));
    const backup = {
        spec_version: '1.0',
        plan_hash: expectedHash,
        target_root: path.resolve(plan.target_root),
        created: [],
        overwritten: [],
    };

    fs.mkdirSync(path.join(backupDir, 'files'), { recursive: true });
    try {
        for (const operation of plan.operations) {
            if (operation.action === 'identical') continue;
            if (operation.action === 'conflict' && conflictResolutions[operation.path] === 'preserve') continue;
            const source = desired.get(operation.path);
            if (!source) throw new Error(`Plan source is unavailable: ${operation.path}`);
            copyFile(source, path.join(stageDir, operation.path));
            const target = path.join(plan.target_root, operation.path);
            if (fs.existsSync(target)) {
                copyFile(target, path.join(backupDir, 'files', operation.path));
                backup.overwritten.push(operation.path);
            } else {
                backup.created.push(operation.path);
            }
        }

        const markerPath = path.join(plan.target_root, plan.marker.path);
        if (fs.existsSync(markerPath)) {
            copyFile(markerPath, path.join(backupDir, 'files', plan.marker.path));
            if (!backup.overwritten.includes(plan.marker.path)) backup.overwritten.push(plan.marker.path);
        } else if (!backup.created.includes(plan.marker.path)) {
            backup.created.push(plan.marker.path);
        }
        fs.writeFileSync(path.join(backupDir, 'backup-manifest.json'), JSON.stringify(backup, null, 2) + '\n');

        let writes = 0;
        for (const operation of plan.operations) {
            if (operation.action === 'identical') continue;
            if (operation.action === 'conflict' && conflictResolutions[operation.path] === 'preserve') continue;
            copyFile(path.join(stageDir, operation.path), path.join(plan.target_root, operation.path));
            writes++;
            if (injectFailureAfter !== null && writes >= injectFailureAfter) {
                throw new Error('Injected adoption failure');
            }
            if (hashFile(path.join(plan.target_root, operation.path)) !== operation.source_hash) {
                throw new Error(`Post-write hash mismatch: ${operation.path}`);
            }
        }

        const marker = {
            $schema: 'https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/fleet/schema/act-heir.schema.json',
            spec_version: '1.0',
            edition: plan.marker.edition,
            edition_version: plan.marker.edition_version,
            profile: plan.marker.profile,
            heir_id: path.basename(path.resolve(plan.target_root)).toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
            deployed_at: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            plan_hash: expectedHash,
        };
        fs.mkdirSync(path.dirname(markerPath), { recursive: true });
        fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2) + '\n');
        return { ok: true, backup_dir: backupDir, plan_hash: expectedHash, writes };
    } catch (error) {
        if (fs.existsSync(path.join(backupDir, 'backup-manifest.json'))) {
            rollbackAdoption({ targetRoot: plan.target_root, backupDir });
        }
        throw error;
    } finally {
        fs.rmSync(stageDir, { recursive: true, force: true });
    }
}

if (require.main === module) {
    const getArg = (name) => {
        const index = process.argv.indexOf(name);
        return index >= 0 ? process.argv[index + 1] : null;
    };
    const getArgs = (name) => process.argv
        .map((value, index) => value === name ? process.argv[index + 1] : null)
        .filter(Boolean);
    const sourceRoot = getArg('--source') || path.resolve(__dirname, '..', '..');
    const targetRoot = getArg('--target') || process.cwd();
    const profile = getArg('--profile') || 'copilot-app';
    try {
        if (process.argv.includes('--rollback')) {
            const backupDir = getArg('--backup');
            if (!backupDir) throw new Error('Rollback requires --backup <directory>');
            console.log(JSON.stringify(rollbackAdoption({ targetRoot, backupDir }), null, 2));
        } else if (process.argv.includes('--apply')) {
            const planPath = getArg('--plan');
            const acceptedPlanHash = getArg('--accept-plan-sha');
            if (!planPath || !acceptedPlanHash) {
                throw new Error('Apply requires --plan <file> and --accept-plan-sha <sha256>');
            }
            const plan = JSON.parse(fs.readFileSync(path.resolve(planPath), 'utf8'));
            const conflictResolutions = {};
            for (const relative of getArgs('--overwrite')) conflictResolutions[normalize(relative)] = 'overwrite';
            for (const relative of getArgs('--preserve')) conflictResolutions[normalize(relative)] = 'preserve';
            console.log(JSON.stringify(applyAdoptionPlan({
                plan,
                acceptedPlanHash,
                conflictResolutions,
                allowDowngrade: process.argv.includes('--allow-downgrade'),
            }), null, 2));
        } else {
            const plan = createAdoptionPlan({ sourceRoot, targetRoot, profile });
            const planOut = getArg('--plan-out');
            if (planOut) {
                fs.mkdirSync(path.dirname(path.resolve(planOut)), { recursive: true });
                fs.writeFileSync(path.resolve(planOut), JSON.stringify(plan, null, 2) + '\n');
            }
            console.log(JSON.stringify(plan, null, 2));
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { applyAdoptionPlan, createAdoptionPlan, desiredFiles, rollbackAdoption };
