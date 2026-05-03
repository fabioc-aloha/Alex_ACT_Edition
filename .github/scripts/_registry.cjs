/**
 * _registry.cjs — best-effort heir registry in shared AI-Memory.
 *
 * Resolves the user's AI-Memory root (OneDrive, iCloud, Dropbox, or ~/AI-Memory)
 * and upserts the heir's row in <root>/heirs/registry.json. Best-effort: never
 * throws on failure — the registry is optional fleet-tracking, not load-bearing.
 *
 * Used by bootstrap-heir.cjs and upgrade-self.cjs.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();

// Cloud drive folder names to scan (order = priority).
// The first existing <HOME>/<name>/AI-Memory wins.
const CLOUD_DRIVE_NAMES = [
    'OneDrive - Correa Family',
    'OneDrive',
    'iCloudDrive',
    'iCloud Drive',
    'iCloud~com~apple~CloudDocs',
    'Dropbox',
];
const CANDIDATES = [
    ...CLOUD_DRIVE_NAMES.map(n => path.join(HOME, n, 'AI-Memory')),
    path.join(HOME, 'AI-Memory'),
];

function resolveAiMemoryRoot() {
    for (const candidate of CANDIDATES) {
        try {
            if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
                return candidate;
            }
        } catch {
            // continue
        }
    }
    return null;
}

/**
 * Upsert a heir row. Returns { ok: true, path } or { ok: false, reason }.
 * Honors marker.opt_in.fleet_inventory (default true). Never throws.
 */
function upsertHeir(marker, repoPath) {
    try {
        if (marker && marker.opt_in && marker.opt_in.fleet_inventory === false) {
            return { ok: false, reason: 'opted-out' };
        }
        const root = resolveAiMemoryRoot();
        if (!root) {
            return { ok: false, reason: 'no-ai-memory' };
        }
        const heirsDir = path.join(root, 'heirs');
        const registryPath = path.join(heirsDir, 'registry.json');
        fs.mkdirSync(heirsDir, { recursive: true });

        let registry = { schema: '1.0', heirs: {} };
        if (fs.existsSync(registryPath)) {
            try {
                registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
                if (!registry.heirs) registry.heirs = {};
            } catch {
                // corrupt — start fresh, don't lose write
                registry = { schema: '1.0', heirs: {} };
            }
        }

        const heirId = marker.heir_id;
        if (!heirId) return { ok: false, reason: 'no-heir-id' };

        registry.heirs[heirId] = {
            heir_id: heirId,
            heir_name: marker.heir_name || heirId,
            edition: marker.edition || 'Alex_ACT_Edition',
            edition_version: marker.edition_version || '0.0.0',
            repo_url: marker.repo_url || '',
            repo_path: repoPath || '',
            deployed_at: marker.deployed_at || new Date().toISOString(),
            last_sync_at: marker.last_sync_at || new Date().toISOString(),
            owner: (marker.contact && marker.contact.owner) || '',
        };
        registry.last_updated = new Date().toISOString();

        fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
        return { ok: true, path: registryPath };
    } catch (e) {
        return { ok: false, reason: `error: ${e.message}` };
    }
}

/**
 * Discover which cloud drive folders exist on this machine.
 * Returns an array of { name, path, hasAiMemory } objects.
 */
function discoverCloudDrives() {
    const drives = [];
    for (const name of CLOUD_DRIVE_NAMES) {
        const driveDir = path.join(HOME, name);
        if (fs.existsSync(driveDir) && fs.statSync(driveDir).isDirectory()) {
            const aiMemDir = path.join(driveDir, 'AI-Memory');
            drives.push({
                name,
                path: driveDir,
                hasAiMemory: fs.existsSync(aiMemDir) && fs.statSync(aiMemDir).isDirectory(),
            });
        }
    }
    // Also check ~/AI-Memory (local fallback, no cloud drive)
    const localFallback = path.join(HOME, 'AI-Memory');
    if (fs.existsSync(localFallback) && fs.statSync(localFallback).isDirectory()) {
        drives.push({ name: '~/AI-Memory', path: localFallback, hasAiMemory: true });
    }
    return drives;
}

/**
 * Create the AI-Memory folder structure in the given cloud drive.
 * @param {string} driveName - cloud drive folder name (e.g. 'OneDrive - Correa Family') or full path
 * @returns {{ ok: boolean, root: string, created: string[] }}
 */
function initAiMemory(driveName) {
    const root = driveName.includes(path.sep)
        ? path.join(driveName, 'AI-Memory')
        : path.join(HOME, driveName, 'AI-Memory');
    const dirs = [
        '',
        'feedback',
        path.join('feedback', 'alex-act'),
        'announcements',
        path.join('announcements', 'alex-act'),
        'heirs',
        'knowledge',
        'insights',
    ];
    const created = [];
    for (const d of dirs) {
        const full = path.join(root, d);
        if (!fs.existsSync(full)) {
            fs.mkdirSync(full, { recursive: true });
            created.push(d || 'AI-Memory/');
        }
    }
    // Create README files in key directories (only if missing)
    const readmes = {
        'README.md': '# AI-Memory\n\nShared fleet communication channel for ACT-Edition heirs.\n\n- `feedback/alex-act/` -- heirs write friction reports here\n- `announcements/alex-act/` -- Supervisor writes fleet-wide notes here\n- `heirs/` -- registry.json tracks deployed heirs\n- `knowledge/` -- shared knowledge base\n',
        [path.join('feedback', 'README.md')]: '# Feedback\n\nHeirs drop one markdown file per feedback item in `alex-act/`.\nThe Supervisor triages, ships fixes, and deletes processed files.\n',
        [path.join('feedback', 'alex-act', 'README.md')]: '# ACT Heir Feedback Inbox\n\nDrop feedback here. One markdown file per item.\nSupervisor triages and deletes after processing.\n',
        [path.join('announcements', 'alex-act', 'README.md')]: '# ACT Fleet Announcements\n\nRelease notes, breaking changes, and fleet-wide guidance.\nHeirs read on session start.\n',
    };
    for (const [rel, content] of Object.entries(readmes)) {
        const full = path.join(root, rel);
        if (!fs.existsSync(full)) {
            fs.writeFileSync(full, content);
            created.push(rel);
        }
    }
    return { ok: true, root, created };
}

module.exports = { resolveAiMemoryRoot, upsertHeir, discoverCloudDrives, initAiMemory };
