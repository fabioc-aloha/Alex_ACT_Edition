#!/usr/bin/env node
/**
 * migrate-to-edition.cjs — migrate an old Alex heir to Alex_ACT_Edition.
 *
 * Run from the heir's repo root (cwd). Snapshots the existing .github/ to
 * .github-old-<date>/, clones Edition to a temp dir, runs bootstrap-heir
 * against the heir cwd, then surfaces a triage report of what's in the
 * snapshot so you can manually port custom content into local/ slots.
 *
 * Identity (heir-id, owner, repo-url, heir-name) is auto-derived from
 * `git remote get-url origin` when the heir has a GitHub remote. Slug rules:
 * lowercase repo name with non-alphanumerics → hyphens. Override any field
 * with a flag.
 *
 * Usage (from inside the heir repo):
 *   node C:\Development\migrate-to-edition.cjs                  # dry-run, all auto
 *   node C:\Development\migrate-to-edition.cjs --apply          # auto-detect + commit
 *   node C:\Development\migrate-to-edition.cjs --heir-id foo \
 *       --owner bar --apply                                     # explicit override
 *
 * Without --apply, runs dry: prints the plan, the triage table, no file moves.
 *
 * After --apply the heir is on Edition. Future upgrades use
 * `node .github/scripts/upgrade-self.cjs` from the heir's own repo.
 *
 * Recovery: the original brain lives at .github-old-<date>/ — restore by
 * deleting .github/ and renaming the snapshot back.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const EDITION_REPO = 'https://github.com/fabioc-aloha/Alex_ACT_Edition.git';

function arg(name, fallback) {
    const i = process.argv.indexOf(name);
    if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
    return fallback;
}

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');

const HEIR_ROOT = process.cwd();
const GH = path.join(HEIR_ROOT, '.github');
const MARKER = path.join(GH, '.act-heir.json');

// --- Auto-derive identity from git remote ------------------------------------
// Run before pre-flight so the user sees what was detected and can override.

function tryGitRemote() {
    try {
        const url = execFileSync('git', ['-C', HEIR_ROOT, 'remote', 'get-url', 'origin'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
        return url || null;
    } catch {
        return null;
    }
}

function parseGitHubRemote(url) {
    if (!url) return null;
    // Handle https://github.com/owner/repo(.git) and git@github.com:owner/repo(.git)
    const m = url.match(/github\.com[:/]+([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/i);
    if (!m) return null;
    return { owner: m[1], repo: m[2] };
}

function slugify(repo) {
    // Insert hyphens at camelCase / PascalCase / letter-digit boundaries so
    // FabricCapacity -> fabric-capacity, Alex_ACT_Edition -> alex-act-edition,
    // foo2bar -> foo-2-bar (mostly cosmetic; collapses below).
    return repo
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')           // fabricCapacity -> fabric-Capacity
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')         // ACTEdition -> ACT-Edition
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')                      // underscores, dots, etc.
        .replace(/-+/g, '-')                               // collapse runs
        .replace(/^-+|-+$/g, '')                           // trim
        .slice(0, 64);
}

const remoteUrl = tryGitRemote();
const remote = parseGitHubRemote(remoteUrl);
const detected = {
    repoUrl: remote ? `https://github.com/${remote.owner}/${remote.repo}` : null,
    owner: remote ? remote.owner : null,
    repo: remote ? remote.repo : null,
    heirId: remote ? slugify(remote.repo) : null,
    heirName: remote ? remote.repo : null,
};

const HEIR_ID = arg('--heir-id', detected.heirId);
const HEIR_NAME = arg('--heir-name', detected.heirName);
const OWNER = arg('--owner', detected.owner);
const REPO_URL = arg('--repo-url', detected.repoUrl);

console.log(`Alex Edition Migration`);
console.log(`Heir cwd: ${HEIR_ROOT}`);
console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY-RUN (use --apply to commit)'}`);
if (remoteUrl) {
    console.log(`Detected: ${remoteUrl}`);
} else {
    console.log(`Detected: no git remote (pass flags manually)`);
}
console.log(`  heir-id : ${HEIR_ID || '(none)'}${detected.heirId === HEIR_ID ? ' [auto]' : ' [override]'}`);
console.log(`  owner   : ${OWNER || '(none)'}${detected.owner === OWNER ? ' [auto]' : ' [override]'}`);
console.log(`  repo-url: ${REPO_URL || '(none)'}${detected.repoUrl === REPO_URL ? ' [auto]' : ' [override]'}`);
console.log('');

// --- Pre-flight ---------------------------------------------------------------

const errors = [];
const warnings = [];

if (!fs.existsSync(GH)) {
    errors.push(`No .github/ at ${HEIR_ROOT}. This doesn't look like an Alex heir.`);
}
if (fs.existsSync(MARKER)) {
    errors.push(`${MARKER} already exists. This heir is already on Edition. Use upgrade-self.cjs instead.`);
}
if (!HEIR_ID) {
    errors.push('Could not derive --heir-id from git remote. Pass it explicitly.');
}
if (HEIR_ID && (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(HEIR_ID) || HEIR_ID.length < 2)) {
    errors.push(`Invalid heir-id "${HEIR_ID}". Must be lowercase alphanumeric + hyphens, 2-64 chars. Pass --heir-id to override.`);
}
if (!OWNER) {
    warnings.push('No owner detected or provided. Pass --owner for AI-Memory registry.');
}

if (errors.length) {
    console.error('Pre-flight failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(2);
}
for (const w of warnings) console.warn(`  warning: ${w}`);

// --- Snapshot path ------------------------------------------------------------

const date = new Date().toISOString().slice(0, 10);
let snapshot = path.join(HEIR_ROOT, `.github-old-${date}`);
let n = 1;
while (fs.existsSync(snapshot)) {
    snapshot = path.join(HEIR_ROOT, `.github-old-${date}-${++n}`);
}
const snapshotName = path.basename(snapshot);

// --- Old-brain triage (read-only inventory) ----------------------------------

function listFiles(dir, prefix = '') {
    if (!fs.existsSync(dir)) return [];
    const out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) out.push(...listFiles(path.join(dir, e.name), rel));
        else out.push(rel);
    }
    return out;
}

const oldFiles = listFiles(GH);

// Buckets: what to do with each file in the old brain
const triage = {
    dropExtensionOnly: [],   // agents/, hooks/, episodic/, extension-UI configs
    dropReplacedByEdition: [], // standard instructions Edition ships
    dropMasterContent: [],   // AlexMaster files marked inheritance: inheritable | master-only
    extractIdentity: [],     // copilot-instructions.md (cherry-pick identity sections)
    portToLocal: [],         // custom content that should live under local/
    review: [],              // anything we can't classify confidently
};

const EXTENSION_ONLY_PATTERNS = [
    /^agents\//,
    /^hooks\//,
    /^episodic\//,
    /^muscles\/hooks\//,
    /^config\/(loop-menu|taglines|review-rules|review-cadence|token-budget|rai-reliance-metrics|cognitive-config|MASTER-ALEX-PROTECTED|config-layers|context-discovery|goals|assignment-log|correlation-vector|session-metrics|session-tool-log|knowledge-artifacts|unknowns)\.json/,
    /^config\/.*\.schema\.json/,
    /^config\/.*-template\.json/,
];

const EDITION_SHIPPED_INSTRUCTIONS = new Set([
    'critical-thinking', 'epistemic-calibration', 'emotional-intelligence',
    'session-health-monitoring', 'system-prompt-skepticism', 'problem-framing-audit',
    'act-pass', 'pii-memory-filter', 'cross-project-isolation', 'proactive-awareness',
    'knowledge-coverage', 'learned-patterns', 'terminal-command-safety',
    'mall-installation',
]);

const EDITION_SHIPPED_SKILLS = new Set([
    'markdown-mermaid', 'md-to-html', 'md-to-word', 'md-to-eml', 'docx-to-md',
]);

const EDITION_SHIPPED_PROMPTS = new Set([
    'welcome', 'feedback', 'save-session-note', 'install-from-mall',
    'status', 'upgrade', 'note', 'fleet', 'find-skill', 'finalize-migration',
]);

// Read the `inheritance:` field from a YAML/Markdown frontmatter block.
// Returns one of: 'inheritable', 'master-only', 'custom', null (no frontmatter or tag missing).
function readInheritance(absPath) {
    try {
        const buf = fs.readFileSync(absPath, 'utf8');
        if (!buf.startsWith('---')) return null;
        const end = buf.indexOf('\n---', 3);
        if (end < 0) return null;
        const fm = buf.slice(3, end);
        const m = fm.match(/^\s*inheritance\s*:\s*([a-z-]+)\s*$/m);
        return m ? m[1] : null;
    } catch {
        return null;
    }
}

// Read the leading JSDoc `@inheritance` tag from a .cjs file.
function readJsdocInheritance(absPath) {
    try {
        const buf = fs.readFileSync(absPath, 'utf8').slice(0, 2000);
        const m = buf.match(/@inheritance\s+([a-z-]+)/);
        return m ? m[1] : null;
    } catch {
        return null;
    }
}

function isMasterTier(tier) {
    return tier === 'inheritable' || tier === 'master-only';
}

for (const rel of oldFiles) {
    const abs = path.join(GH, rel);
    if (EXTENSION_ONLY_PATTERNS.some(p => p.test(rel))) {
        triage.dropExtensionOnly.push(rel);
        continue;
    }
    if (rel === 'copilot-instructions.md') {
        triage.extractIdentity.push(rel);
        continue;
    }
    const m = rel.match(/^instructions\/([^/]+)\.instructions\.md$/);
    if (m && EDITION_SHIPPED_INSTRUCTIONS.has(m[1])) {
        triage.dropReplacedByEdition.push(rel);
        continue;
    }
    const sk = rel.match(/^skills\/([^/]+)\//);
    if (sk && EDITION_SHIPPED_SKILLS.has(sk[1])) {
        triage.dropReplacedByEdition.push(rel);
        continue;
    }
    const pr = rel.match(/^prompts\/([^/]+)\.prompt\.md$/);
    if (pr && EDITION_SHIPPED_PROMPTS.has(pr[1])) {
        triage.dropReplacedByEdition.push(rel);
        continue;
    }

    // Frontmatter-based classification: master-tier files were inherited from
    // AlexMaster and were either consolidated into Edition or dropped. Either
    // way, don't port them — Edition's curated set is the new baseline.
    if (/^instructions\/[^/]+\.instructions\.md$/.test(rel) ||
        /^prompts\/[^/]+\.prompt\.md$/.test(rel)) {
        const tier = readInheritance(abs);
        if (isMasterTier(tier)) {
            triage.dropMasterContent.push(rel);
            continue;
        }
    }
    if (/^skills\/[^/]+\/SKILL\.md$/.test(rel)) {
        const tier = readInheritance(abs);
        if (isMasterTier(tier)) {
            triage.dropMasterContent.push(rel);
            continue;
        }
    }
    // Sibling skill files (anything inside a skill folder whose SKILL.md is
    // master-tier) ride along with the SKILL.md decision.
    const skillDirMatch = rel.match(/^skills\/([^/]+)\//);
    if (skillDirMatch) {
        const skillRoot = path.join(GH, 'skills', skillDirMatch[1], 'SKILL.md');
        const tier = readInheritance(skillRoot);
        if (isMasterTier(tier)) {
            triage.dropMasterContent.push(rel);
            continue;
        }
    }
    if (/^muscles\/[^/]+\.cjs$/.test(rel)) {
        const tier = readJsdocInheritance(abs);
        if (isMasterTier(tier)) {
            triage.dropMasterContent.push(rel);
            continue;
        }
    }

    if (rel.startsWith('instructions/') || rel.startsWith('skills/') ||
        rel.startsWith('prompts/') || rel.startsWith('muscles/')) {
        triage.portToLocal.push(rel);
        continue;
    }
    if (rel === 'VERSION' || rel === 'LICENSE' || rel === 'ABOUT.md' ||
        rel === 'config/sync-policy.json' || rel === 'config/markdown-light.css' ||
        rel === 'config/README.md') {
        triage.dropReplacedByEdition.push(rel);
        continue;
    }
    triage.review.push(rel);
}

// --- Plan summary -------------------------------------------------------------

console.log(`Old brain inventory (${oldFiles.length} files in .github/):`);
console.log(`  drop (extension-only)        : ${triage.dropExtensionOnly.length}`);
console.log(`  drop (replaced by Edition)   : ${triage.dropReplacedByEdition.length}`);
console.log(`  drop (master-tier inherited) : ${triage.dropMasterContent.length}`);
console.log(`  extract identity from        : ${triage.extractIdentity.length}`);
console.log(`  port to local/ (manual)      : ${triage.portToLocal.length}`);
console.log(`  review (uncertain)           : ${triage.review.length}`);
console.log('');

if (triage.portToLocal.length || triage.review.length) {
    console.log('Files needing manual attention after bootstrap:');
    for (const rel of triage.portToLocal.slice(0, 20)) {
        let dest = '?';
        if (rel.startsWith('instructions/')) dest = rel.replace('instructions/', '.github/instructions/local/');
        else if (rel.startsWith('skills/')) dest = rel.replace('skills/', '.github/skills/local/');
        else if (rel.startsWith('prompts/')) dest = rel.replace('prompts/', '.github/prompts/local/');
        else if (rel.startsWith('muscles/')) dest = rel.replace('muscles/', '.github/muscles/local/');
        console.log(`    ${snapshotName}/${rel}  ->  ${dest}`);
    }
    if (triage.portToLocal.length > 20) {
        console.log(`    ... and ${triage.portToLocal.length - 20} more`);
    }
    if (triage.review.length) {
        console.log('  review (no clear destination):');
        for (const rel of triage.review.slice(0, 10)) console.log(`    ${snapshotName}/${rel}`);
        if (triage.review.length > 10) console.log(`    ... and ${triage.review.length - 10} more`);
    }
    console.log('');
}

console.log('Plan:');
console.log(`  1. Rename ${GH}  ->  ${snapshot}`);
console.log(`  2. Clone ${EDITION_REPO} to a temp dir`);
console.log(`  3. Run bootstrap-heir.cjs --target . --heir-id ${HEIR_ID}${OWNER ? ` --owner ${OWNER}` : ''} --apply`);
console.log(`  4. Run heir-doctor.cjs`);
console.log(`  5. Print restore hints (you port custom content manually)`);
console.log('');

if (!APPLY) {
    console.log('DRY-RUN complete. Re-run with --apply to migrate.');
    process.exit(0);
}

// --- Apply --------------------------------------------------------------------

console.log(`[1/5] Snapshotting ${GH}  ->  ${snapshot}`);
fs.renameSync(GH, snapshot);

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-migrate-'));
const editionDir = path.join(tmpRoot, 'edition');
console.log(`[2/5] Cloning Edition to ${editionDir}`);
const clone = spawnSync('git', ['clone', '--depth', '1', EDITION_REPO, editionDir], { stdio: 'inherit' });
if (clone.status !== 0) {
    console.error('git clone failed. Restoring snapshot.');
    fs.renameSync(snapshot, GH);
    process.exit(1);
}

console.log(`[3/5] Running bootstrap-heir`);
const bootstrap = path.join(editionDir, '.github', 'scripts', 'bootstrap-heir.cjs');
const bootArgs = [bootstrap, '--target', '.', '--heir-id', HEIR_ID, '--apply'];
if (HEIR_NAME) { bootArgs.push('--heir-name', HEIR_NAME); }
if (OWNER) { bootArgs.push('--owner', OWNER); }
if (REPO_URL) { bootArgs.push('--repo-url', REPO_URL); }
const boot = spawnSync(process.execPath, bootArgs, { stdio: 'inherit', cwd: HEIR_ROOT });
if (boot.status !== 0) {
    console.error('bootstrap-heir failed. Snapshot is at:', snapshot);
    console.error('Restore: rm -rf .github && mv', snapshotName, '.github');
    process.exit(1);
}

console.log(`[4/5] Running heir-doctor`);
const doctor = path.join(HEIR_ROOT, '.github', 'muscles', 'heir-doctor.cjs');
spawnSync(process.execPath, [doctor], { stdio: 'inherit', cwd: HEIR_ROOT });

// Cleanup temp clone
try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }

console.log('');
console.log(`[5/5] Done. Mechanical migration complete — heir is on Edition.`);
console.log('');
console.log('━'.repeat(72));
console.log('  NEXT: run the semantic pass');
console.log('━'.repeat(72));
console.log('');
console.log('  The script handled the deterministic work (snapshot, fresh brain,');
console.log('  marker, registry). The semantic pass needs your judgment:');
console.log('');
console.log('    - extracting identity from the old copilot-instructions.md');
console.log('    - porting custom content into local/ slots');
console.log('    - reviewing files the triage couldn\'t classify');
console.log('');
console.log('  In this heir, open an AI chat session and run:');
console.log('');
console.log('      /finalize-migration');
console.log('');
console.log('  (or paste .github/prompts/finalize-migration.prompt.md into the chat).');
console.log('');
console.log(`  Snapshot is at: ${snapshotName}/  (keep until commit lands clean)`);
console.log('━'.repeat(72));
