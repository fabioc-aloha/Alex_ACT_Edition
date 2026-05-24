#!/usr/bin/env node
/**
 * init-edition.cjs — initialize Alex_ACT_Edition into the currently-open
 * (empty or near-empty) project workspace.
 *
 * Run from the project's repo root (cwd). Clones Edition to a temp dir,
 * runs bootstrap-heir against the cwd, then heir-doctor.
 *
 * Identity (heir-id, owner, repo-url, heir-name) is auto-derived from
 * `git remote get-url origin` when the project has a GitHub remote.
 * Override any field with a flag.
 *
 * Usage (from inside the new project's repo):
 *   node C:\Development\init-edition.cjs                   # dry-run, all auto
 *   node C:\Development\init-edition.cjs --apply           # commit changes
 *   node C:\Development\init-edition.cjs --heir-id foo \
 *       --owner bar --apply                                 # explicit override
 *
 * Without --apply, runs dry: prints the plan, no file writes.
 *
 * After --apply the project is on Edition. Future upgrades use
 * `node .github/scripts/upgrade-self.cjs` from the project repo.
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

const PROJECT_ROOT = process.cwd();
const GH = path.join(PROJECT_ROOT, '.github');
const MARKER = path.join(GH, '.act-heir.json');
const GIT_DIR = path.join(PROJECT_ROOT, '.git');

// --- Auto-derive identity from git remote ------------------------------------

function tryGitRemote() {
  try {
    const url = execFileSync('git', ['-C', PROJECT_ROOT, 'remote', 'get-url', 'origin'], {
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
  const m = url.match(/github\.com[:/]+([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

function slugify(repo) {
  return repo
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function fallbackHeirIdFromCwd() {
  return slugify(path.basename(PROJECT_ROOT));
}

const remoteUrl = tryGitRemote();
const remote = parseGitHubRemote(remoteUrl);
const detected = {
  repoUrl: remote ? `https://github.com/${remote.owner}/${remote.repo}` : null,
  owner: remote ? remote.owner : null,
  repo: remote ? remote.repo : null,
  heirId: remote ? slugify(remote.repo) : fallbackHeirIdFromCwd(),
  heirName: remote ? remote.repo : path.basename(PROJECT_ROOT),
};

const HEIR_ID = arg('--heir-id', detected.heirId);
const HEIR_NAME = arg('--heir-name', detected.heirName);
const OWNER = arg('--owner', detected.owner);
const REPO_URL = arg('--repo-url', detected.repoUrl);

console.log('Alex Edition Init');
console.log(`Project cwd: ${PROJECT_ROOT}`);
console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY-RUN (use --apply to commit)'}`);
if (remoteUrl) {
  console.log(`Detected: ${remoteUrl}`);
} else {
  console.log(`Detected: no git remote (heir-id derived from folder name)`);
}
console.log(`  heir-id : ${HEIR_ID || '(none)'}${detected.heirId === HEIR_ID ? ' [auto]' : ' [override]'}`);
console.log(`  owner   : ${OWNER || '(none)'}${detected.owner === OWNER ? ' [auto]' : ' [override]'}`);
console.log(`  repo-url: ${REPO_URL || '(none)'}${detected.repoUrl === REPO_URL ? ' [auto]' : ' [override]'}`);
console.log('');

// --- Pre-flight ---------------------------------------------------------------

const errors = [];
const warnings = [];

if (fs.existsSync(MARKER)) {
  errors.push(`${MARKER} already exists. This project is already an Edition heir. Use upgrade-self.cjs instead.`);
}
if (fs.existsSync(GH)) {
  errors.push(
    `.github/ already exists at ${GH}. ` +
    `init-edition is for fresh projects. ` +
    `If this project is already an Edition heir, use upgrade-self.cjs instead.`
  );
}
if (!HEIR_ID) {
  errors.push('Could not derive --heir-id. Pass it explicitly with --heir-id <name>.');
}
if (HEIR_ID && (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(HEIR_ID) || HEIR_ID.length < 2)) {
  errors.push(`Invalid heir-id "${HEIR_ID}". Must be lowercase alphanumeric + hyphens, 2-64 chars. Pass --heir-id to override.`);
}
if (!fs.existsSync(GIT_DIR)) {
  warnings.push('No .git/ directory. Run `git init` first if you want this project under version control.');
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
console.log('');

// --- Plan summary -------------------------------------------------------------

console.log('Plan:');
console.log(`  1. Clone ${EDITION_REPO} to a temp dir`);
console.log(`  2. Run bootstrap-heir.cjs --target . --heir-id ${HEIR_ID}${OWNER ? ` --owner ${OWNER}` : ''} --apply`);
console.log(`  3. Run heir-doctor.cjs`);
console.log(`  4. Print next-steps banner`);
console.log('');

if (!APPLY) {
  console.log('DRY-RUN complete. Re-run with --apply to initialize.');
  process.exit(0);
}

// --- Apply --------------------------------------------------------------------

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-init-'));
const editionDir = path.join(tmpRoot, 'edition');

console.log(`[1/3] Cloning Edition to ${editionDir}`);
const clone = spawnSync('git', ['clone', '--depth', '1', EDITION_REPO, editionDir], { stdio: 'inherit' });
if (clone.status !== 0) {
  console.error('git clone failed. Check network / git availability.');
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }
  process.exit(1);
}

console.log(`[2/3] Running bootstrap-heir`);
const bootstrap = path.join(editionDir, '.github', 'scripts', 'bootstrap-heir.cjs');
if (!fs.existsSync(bootstrap)) {
  console.error(`bootstrap-heir.cjs not found at ${bootstrap}. Edition clone may be incomplete.`);
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }
  process.exit(1);
}
const bootArgs = [bootstrap, '--target', '.', '--heir-id', HEIR_ID, '--apply'];
if (HEIR_NAME) { bootArgs.push('--heir-name', HEIR_NAME); }
if (OWNER) { bootArgs.push('--owner', OWNER); }
if (REPO_URL) { bootArgs.push('--repo-url', REPO_URL); }
const boot = spawnSync(process.execPath, bootArgs, { stdio: 'inherit', cwd: PROJECT_ROOT });
if (boot.status !== 0) {
  console.error('bootstrap-heir failed.');
  console.error(`If a partial .github/ was written at ${GH}, remove it and rerun.`);
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }
  process.exit(1);
}

// Fresh-project templates: README.md and assets/ from Edition. These are
// copied only on init (fresh projects), never on migrate or upgrade. They
// are heir-owned the moment they land — never overwritten by future upgrades.
function copyDirRecursive(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(s, d);
    } else if (entry.isFile()) {
      if (!fs.existsSync(d)) fs.copyFileSync(s, d);
    }
  }
}
const freshTemplates = [
  { rel: 'README.md', kind: 'file' },
  { rel: 'assets', kind: 'dir' },
];
let freshCopied = 0;
for (const t of freshTemplates) {
  const src = path.join(editionDir, t.rel);
  const dst = path.join(PROJECT_ROOT, t.rel);
  if (!fs.existsSync(src)) continue;
  if (fs.existsSync(dst)) continue;
  if (t.kind === 'file') {
    fs.copyFileSync(src, dst);
    freshCopied += 1;
  } else if (t.kind === 'dir') {
    copyDirRecursive(src, dst);
    freshCopied += 1;
  }
}
if (freshCopied > 0) {
  console.log(`Copied ${freshCopied} fresh-project template${freshCopied === 1 ? '' : 's'}: README.md, assets/`);
}

console.log(`[3/3] Running heir-doctor`);
const doctor = path.join(PROJECT_ROOT, '.github', 'muscles', 'heir-doctor.cjs');
if (fs.existsSync(doctor)) {
  spawnSync(process.execPath, [doctor], { stdio: 'inherit', cwd: PROJECT_ROOT });
} else {
  console.warn(`heir-doctor.cjs not found at ${doctor} (skipping)`);
}

// Cleanup temp clone
try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }

console.log('');
console.log('━'.repeat(72));
console.log('  Done. Project initialized as an Edition heir.');
console.log('━'.repeat(72));
console.log('');
console.log('  Next steps:');
console.log('');
console.log('    1. Open this workspace in VS Code with GitHub Copilot.');
console.log('    2. In a chat session, run:  /welcome');
console.log('       (orientation tour — identity, tenets, surfaces, what to try next)');
console.log('    3. Customize identity in:   .github/copilot-instructions.local.md');
console.log('    4. Add custom content in:   .github/{instructions,skills,prompts,muscles}/local/');
console.log('');
console.log('  Future upgrades:  node .github/scripts/upgrade-self.cjs');
console.log('━'.repeat(72));
