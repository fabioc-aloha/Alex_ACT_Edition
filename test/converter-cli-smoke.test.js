// @ts-check
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

function makeRoot(prefix) {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFile(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

function makeFakeScript(dir, name, jsBody) {
    const jsFile = path.join(dir, `${name}.js`);
    writeFile(jsFile, jsBody);
    return jsFile;
}

function makeFakeTools(binDir, logFile) {
    const pandoc = makeFakeScript(binDir, 'pandoc', `
const fs = require('node:fs');
const path = require('node:path');
const logFile = ${JSON.stringify(logFile)};
fs.appendFileSync(logFile, JSON.stringify({ tool: 'pandoc', args: process.argv.slice(2) }) + '\\n');
const args = process.argv.slice(2);
const output = args[args.indexOf('-o') + 1];
if (!output) process.exit(2);
fs.mkdirSync(path.dirname(output), { recursive: true });
const ext = path.extname(output).toLowerCase();
if (ext === '.html') fs.writeFileSync(output, '<p>fake html</p>');
else if (ext === '.txt') fs.writeFileSync(output, 'fake text\\n');
else if (ext === '.docx') fs.writeFileSync(output, 'fake docx payload with enough bytes for smoke test');
else if (ext === '.md') fs.writeFileSync(output, '![Alt](media/image1.png)\\n');
else fs.writeFileSync(output, 'fake output');
const mediaFlag = args.indexOf('--extract-media');
if (mediaFlag >= 0 && args[mediaFlag + 1]) {
  const mediaDir = path.join(args[mediaFlag + 1], 'media');
  fs.mkdirSync(mediaDir, { recursive: true });
  fs.writeFileSync(path.join(mediaDir, 'image1.png'), 'png-bytes');
}
`);
    const npx = makeFakeScript(binDir, 'npx', `
const fs = require('node:fs');
const path = require('node:path');
const logFile = ${JSON.stringify(logFile)};
const args = process.argv.slice(2);
fs.appendFileSync(logFile, JSON.stringify({ tool: 'npx', args }) + '\\n');
if (args[0] === 'mmdc') {
  const out = args[args.indexOf('-o') + 1];
  if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, 'png'); }
} else if (args[0] === 'svgexport') {
  const out = args[2];
  if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, 'png'); }
}
`);
    return { pandoc, npx };
}

function runNode(script, args, cwd, tools) {
    const env = { ...process.env, ACT_TOOL_PANDOC: tools.pandoc, ACT_TOOL_NPX: tools.npx };
    return execFileSync(process.execPath, [script, ...args], { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function readToolCalls(logFile) {
    return fs.readFileSync(logFile, 'utf8').trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

test('converter CLI smoke tests run with metacharacter paths through fake tools', () => {
    const root = makeRoot('converter cli smoke $semi; ');
    const binDir = path.join(root, 'bin');
    const logFile = path.join(root, 'tool-calls.jsonl');
    const workDir = path.join(root, 'workspace with spaces; and $chars');
    try {
        fs.mkdirSync(binDir, { recursive: true });
        fs.mkdirSync(workDir, { recursive: true });
        const tools = makeFakeTools(binDir, logFile);

        const markdown = path.join(workDir, 'source $(no-shell).md');
        const html = path.join(workDir, 'source $(no-shell).html');
        const docx = path.join(workDir, 'source $(no-shell).docx');
        writeFile(markdown, '# Title\n\n![Pic](pic.png)\n\n```mermaid\nflowchart TD\n  A-->B\n```\n');
        writeFile(path.join(workDir, 'pic.png'), 'png');
        writeFile(html, '<h1>Title</h1><img src="pic.png">');
        writeFile(docx, 'fake docx input');

        runNode(path.join(ROOT, '.github/skills/md-to-txt/scripts/md-to-txt.cjs'), [markdown, path.join(workDir, 'out $(no-shell).txt'), '--wrap', '0'], workDir, tools);
        runNode(path.join(ROOT, '.github/skills/md-to-html/scripts/md-to-html.cjs'), [markdown, path.join(workDir, 'out $(no-shell).html'), '--no-embed-images'], workDir, tools);
        runNode(path.join(ROOT, '.github/skills/html-to-md/scripts/html-to-md.cjs'), [html, path.join(workDir, 'out $(no-shell).md'), '--no-extract-images'], workDir, tools);
        runNode(path.join(ROOT, '.github/skills/docx-to-md/scripts/docx-to-md.cjs'), [docx, path.join(workDir, 'out-docx $(no-shell).md')], workDir, tools);
        runNode(path.join(ROOT, '.github/skills/md-to-eml/scripts/md-to-eml.cjs'), [markdown, path.join(workDir, 'out $(no-shell).eml')], workDir, tools);

        const calls = readToolCalls(logFile);
        assert.equal(calls.filter((call) => call.tool === 'pandoc').length >= 5, true);
        assert.equal(calls.some((call) => call.args.some((arg) => String(arg).includes('$(no-shell)'))), true, 'at least one metacharacter path should arrive as literal argv');
        assert.equal(calls.some((call) => call.args.some((arg) => String(arg).includes('no-shell:'))), false, 'shell expansion must not rewrite metacharacter path');
        assert.equal(fs.existsSync(path.join(workDir, 'media')), false, 'docx-to-md must not create/delete user media dir');
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});

test('Lua filters are present and syntactically plausible', () => {
    const filters = [
        '.github/skills/md-to-word/scripts/lua-filters/word-table-style.lua',
        '.github/skills/md-to-word/scripts/lua-filters/keep-headings.lua',
        '.github/skills/md-to-word/scripts/lua-filters/caption-labels.lua',
    ];
    for (const rel of filters) {
        const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        assert.match(content, /function\s+\w+\(/, `${rel} should define at least one Pandoc filter function`);
    }
});
