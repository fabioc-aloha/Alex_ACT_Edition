'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const INSTRUCTION = path.join(ROOT, '.github', 'instructions', 'mall-installation.instructions.md');
const PROMPTS = [
  'mall-install.prompt.md',
  'mall-search.prompt.md',
  'mall-show.prompt.md',
  'mall-refresh.prompt.md',
  'mall-contribute.prompt.md',
];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

test('all active Mall workflows use the shared version-aware installation contract', () => {
  const instruction = fs.readFileSync(INSTRUCTION, 'utf8');
  for (const prompt of PROMPTS) {
    const content = read(path.join('.github', 'prompts', prompt));
    assert.match(content, /mall-installation\.instructions\.md/, prompt);
    assert.doesNotMatch(content, /Phase 5b|when shipped/i, prompt);
  }

  for (const required of [
    '.mall-metadata.json',
    'skills/<skill-name>/',
    '.github/skills/local/<skill-name>/',
    'agents/*.agent.md',
    '.github/agents/local/',
    'commands/*.md',
    '.github/prompts/local/<name>.prompt.md',
    'mcpServers',
    '.mcp.json',
    '.mcp.json.bak',
    'component_paths',
    'Mall 2',
    'hooks',
    'extensions',
    'lspServers',
  ]) {
    assert.ok(instruction.includes(required), `installation contract missing: ${required}`);
  }
  assert.doesNotMatch(instruction, /both ship a SKILL\.md at the plugin root/i);
});

test('audit-mall-drift discovers metadata-only plugin installs and retains component paths', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-mall-install-'));
  try {
    const metadataDir = path.join(root, 'agent-only');
    fs.mkdirSync(metadataDir, { recursive: true });
    fs.writeFileSync(path.join(metadataDir, '.install.json'), JSON.stringify({
      plugin: 'agent-only',
      store: 'plugin-mall',
      version_at_install: '1.0.0',
      source_url: 'https://example.invalid/agent-only',
      mall_major: 3,
      component_paths: ['.github/agents/local/agent-only.agent.md'],
    }));

    const script = [
      `const audit = require(${JSON.stringify(path.join(ROOT, '.github', 'scripts', 'audit-mall-drift.cjs'))});`,
      `const scanned = audit.scanLocalPluginDirs(${JSON.stringify(root)});`,
      `const rows = audit.classify(scanned, [{ name: 'agent-only', store: 'plugin-mall', version: '1.0.0', source_url: 'https://example.invalid/agent-only' }]);`,
      `console.log('__RESULT__' + JSON.stringify({ scanned, rows }));`,
    ].join('');
    const probe = spawnSync(process.execPath, ['-e', script], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(probe.status, 0, probe.stderr);
    const marker = probe.stdout.split(/\r?\n/).find((line) => line.startsWith('__RESULT__'));
    assert.ok(marker, `audit module executed CLI or failed to export helpers:\n${probe.stdout}`);
    const result = JSON.parse(marker.slice('__RESULT__'.length));
    assert.equal(result.scanned.length, 1);
    assert.deepEqual(result.scanned[0].component_paths, ['.github/agents/local/agent-only.agent.md']);
    assert.equal(result.rows[0].state, 'IN_SYNC');
    assert.deepEqual(result.rows[0].component_paths, ['.github/agents/local/agent-only.agent.md']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});