'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const CORE_ROOT = path.join(ROOT, '.github', 'core');

const contracts = [
    'instructions/decision.instructions.md',
    'instructions/execution.instructions.md',
    'instructions/safety-authority.instructions.md',
    'instructions/continuity.instructions.md',
];

const operations = [
    'act-reference',
    'plan-and-track',
    'document',
    'visualize',
    'verify-and-repair',
    'consolidate',
    'capability-pack-manager',
];

const templates = [
    'plan.md',
    'preflight.md',
    'status.md',
    'tracker.md',
    'architecture.md',
    'handoff.md',
];

function read(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

test('candidate ships exactly the approved Core source artifacts', () => {
    for (const relativePath of contracts) {
        assert.equal(fs.existsSync(path.join(CORE_ROOT, relativePath)), true, relativePath);
    }
    for (const operation of operations) {
        const skill = path.join(CORE_ROOT, 'skills', operation, 'SKILL.md');
        assert.equal(fs.existsSync(skill), true, skill);
    }
    for (const template of templates) {
        assert.equal(fs.existsSync(path.join(CORE_ROOT, 'templates', template)), true, template);
    }

    assert.equal(fs.readdirSync(path.join(CORE_ROOT, 'instructions')).length, 4);
    assert.equal(fs.readdirSync(path.join(CORE_ROOT, 'skills')).length, 7);
    assert.equal(fs.readdirSync(path.join(CORE_ROOT, 'templates')).length, 6);
});

test('surface profile contract declares vscode and copilot-app only', () => {
    const profile = JSON.parse(read('.github/config/surface-profiles.json'));
    assert.deepEqual(Object.keys(profile.profiles).sort(), ['copilot-app', 'vscode']);
    assert.equal(profile.profiles['copilot-app'].cli_is_invocation_mode, true);
    assert.deepEqual(profile.profiles['copilot-app'].vscode_assets, []);
    assert.equal(profile.profiles.vscode.vscode_assets.includes('markdown-light.css'), true);
});

test('all current agents avoid the CLI-invalid model array shape', () => {
    const agentsDir = path.join(ROOT, '.github', 'agents');
    const agents = fs.readdirSync(agentsDir).filter(file => file.endsWith('.agent.md'));
    assert.equal(agents.length, 4);
    for (const agent of agents) {
        const content = fs.readFileSync(path.join(agentsDir, agent), 'utf8');
        assert.doesNotMatch(content, /^model:\s*\[/m, `${agent} uses model array`);
    }
});

test('VS Code-only prompts are stored under the vscode profile, not active prompts', () => {
    const profilePromptDir = path.join(ROOT, '.github', 'profiles', 'vscode', 'prompts');
    for (const prompt of [
        'configure-vscode-verify.prompt.md',
        'configure-vscode.prompt.md',
        'configure-workspace-verify.prompt.md',
        'configure-workspace.prompt.md',
    ]) {
        assert.equal(fs.existsSync(path.join(profilePromptDir, prompt)), true, prompt);
        assert.equal(fs.existsSync(path.join(ROOT, '.github', 'prompts', prompt)), false, prompt);
    }
});

test('adoption planner preserves existing project files and reports collisions without mutation', () => {
    const { createAdoptionPlan } = require(path.join(ROOT, '.github', 'scripts', 'adopt-edition.cjs'));
    const target = fs.mkdtempSync(path.join(os.tmpdir(), 'universal-edition-existing-'));
    try {
        fs.mkdirSync(path.join(target, '.git'));
        fs.mkdirSync(path.join(target, '.github', 'workflows'), { recursive: true });
        fs.mkdirSync(path.join(target, '.github', 'instructions'), { recursive: true });
        fs.writeFileSync(path.join(target, '.github', 'workflows', 'project.yml'), 'name: project\n');
        fs.writeFileSync(path.join(target, '.github', 'instructions', 'act-pass.instructions.md'), 'project-owned collision\n');
        const before = fs.readFileSync(path.join(target, '.github', 'workflows', 'project.yml'), 'utf8');

        const plan = createAdoptionPlan({ sourceRoot: ROOT, targetRoot: target, profile: 'copilot-app' });
        assert.equal(plan.profile, 'copilot-app');
        assert.equal(plan.conflicts.some(item => item.path === '.github/instructions/act-pass.instructions.md'), true);
        assert.equal(plan.preserved.some(item => item.path === '.github/workflows/project.yml'), true);
        assert.equal(plan.operations.some(item => item.path.startsWith('.vscode/')), false);
        assert.equal(fs.readFileSync(path.join(target, '.github', 'workflows', 'project.yml'), 'utf8'), before);
        assert.equal(fs.existsSync(path.join(target, '.github', '.act-heir.json')), false);
    } finally {
        fs.rmSync(target, { recursive: true, force: true });
    }
});

test('tool awareness and browser guidance are capability-based with explicit fallbacks', () => {
    const awareness = read('.github/instructions/tool-awareness.instructions.md');
    const categories = read('.github/instructions/tool-awareness-categories.instructions.md');
    const browser = read('.github/skills/browser-tools/SKILL.md');

    assert.match(awareness, /surface profile/i);
    assert.match(awareness, /capability discovery/i);
    assert.doesNotMatch(awareness, /VS Code 1\.122/);
    assert.match(categories, /capability class/i);
    assert.match(browser, /no-browser fallback/i);
    assert.match(browser, /host-provided browser/i);
});

test('agent authoring and delegation document the CLI-compatible contract', () => {
    const creator = read('.github/skills/agent-creator/SKILL.md');
    const review = read('.github/skills/agent-review/SKILL.md');
    const delegation = read('.github/instructions/agent-delegation.instructions.md');

    assert.match(creator, /scalar string or omit/i);
    assert.match(review, /model array/i);
    assert.match(delegation, /copilot --agent/i);
    assert.match(delegation, /manual fallback/i);
});

test('welcome and initialize use profile-aware, existing-project-safe paths', () => {
    const welcome = read('.github/prompts/welcome.prompt.md');
    const initialize = read('.github/prompts/initialize.prompt.md');

    assert.doesNotMatch(welcome, /36 instructions, 30 skills, 26 prompts/);
    assert.doesNotMatch(welcome, /\/mall install/);
    assert.match(welcome, /selected surface profile/i);
    assert.match(initialize, /adopt-edition\.cjs/);
    assert.match(initialize, /accept-plan-sha/);
});

test('deterministic candidate checkers validate profiles, templates, Mermaid, and SVG', () => {
    const scripts = path.join(ROOT, '.github', 'scripts');
    const profileResult = JSON.parse(execFileSync(process.execPath, [path.join(scripts, 'check-surface-profile.cjs')], { encoding: 'utf8' }));
    const templateResult = JSON.parse(execFileSync(process.execPath, [path.join(scripts, 'check-core-templates.cjs')], { encoding: 'utf8' }));
    assert.deepEqual(profileResult.profiles, ['copilot-app', 'vscode']);
    assert.equal(templateResult.templates, 6);

    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'universal-edition-render-'));
    try {
        const mermaid = path.join(temp, 'diagram.md');
        const svg = path.join(temp, 'diagram.svg');
        fs.writeFileSync(mermaid, "```mermaid\n%%{init: {'theme': 'base'}}%%\nflowchart LR\n  A[Start] --> B[Done]\n  linkStyle default stroke:#57606a,stroke-width:1.5px\n```\n");
        fs.writeFileSync(svg, '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>\n');
        const mermaidResult = JSON.parse(execFileSync(process.execPath, [path.join(scripts, 'check-mermaid.cjs'), mermaid], { encoding: 'utf8' }));
        const svgResult = JSON.parse(execFileSync(process.execPath, [path.join(scripts, 'check-svg.cjs'), svg], { encoding: 'utf8' }));
        assert.equal(mermaidResult.blocks, 1);
        assert.equal(svgResult.bytes > 0, true);
    } finally {
        fs.rmSync(temp, { recursive: true, force: true });
    }
});
