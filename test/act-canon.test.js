// @ts-check
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const INSTRUCTIONS = path.join(ROOT, '.github', 'instructions');
const FOUNDATIONS = path.join(INSTRUCTIONS, 'act-foundations.instructions.md');
const PASS = path.join(INSTRUCTIONS, 'act-pass.instructions.md');

const CANON = [
    ['I', 'Hypothesis Primacy'],
    ['II', 'Disconfirmation Over Confirmation'],
    ['III', 'Multiple Working Hypotheses'],
    ['IV', 'System-Prompt Skepticism'],
    ['V', 'Calibration Over Confidence'],
    ['VI', 'Materiality Gating'],
    ['VII', 'Frame Before Solve'],
    ['VIII', 'Adversarial Self-Probe'],
    ['IX', 'Visible Markers, Not Invisible Discipline'],
    ['X', 'The Discipline Applies to Itself'],
];

const ROLES = [
    ['Foundational', ['I', 'II']],
    ['Operational', ['III', 'VII', 'VIII']],
    ['Protective', ['IV', 'V', 'IX']],
    ['Governing', ['VI', 'X']],
];

const BINDINGS = [
    ['I', 'critical-thinking.instructions.md', /Alternative hypotheses/i],
    ['II', 'act-pass.instructions.md', /Identify disconfirmers/i],
    ['III', 'critical-thinking.instructions.md', /Two-Hypothesis Floor/i],
    ['IV', 'system-prompt-skepticism.instructions.md', /System-Prompt Skepticism/i],
    ['V', 'epistemic-calibration.instructions.md', /Confidence Levels/i],
    ['VI', 'act-pass.instructions.md', /Materiality/i],
    ['VII', 'problem-framing-audit.instructions.md', /Frame audit/i],
    ['VIII', 'adversarial-review.instructions.md', /Adversarial Self-Probe/i],
    ['IX', 'act-pass.instructions.md', /Visible Markers/i],
    ['X', 'act-pass.instructions.md', /Self-Application/i],
];

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

function normalizeSeparators(content) {
    return content.replace(/[\u2013\u2014]/g, '-');
}

function extractSection(content, startHeading, endHeading) {
    const start = content.indexOf(startHeading);
    assert.notEqual(start, -1, `missing section: ${startHeading}`);
    const end = content.indexOf(endHeading, start + startHeading.length);
    return content.slice(start, end === -1 ? content.length : end);
}

function walkMarkdown(root) {
    const files = [];
    function visit(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) visit(full);
            else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
        }
    }
    visit(root);
    return files;
}

test('canon roster has exactly I-X with exact canonical names', () => {
    const foundations = normalizeSeparators(read(FOUNDATIONS));
    const roster = [...foundations.matchAll(/^### ([IVX]+) - (.+)$/gm)]
        .map((match) => [match[1], match[2].trim()]);
    assert.deepEqual(roster, CANON);
});

test('canon contract carries the accepted explanatory role map', () => {
    const foundations = normalizeSeparators(read(FOUNDATIONS));
    const contract = extractSection(foundations, '## Canon Contract', '## The Ten Tenets');
    for (const [role, expectedIds] of ROLES) {
        const row = contract.split('\n')
            .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
            .find((cells) => cells[0] === role);
        assert.ok(row, `missing ${role} role row`);
        const ids = row[1].match(/\b(?:VIII|VII|III|II|IX|IV|VI|V|X|I)\b/g) || [];
        assert.deepEqual(ids, expectedIds, `${role} role assignment drifted`);
    }
    assert.match(contract, /roles?\s+(?:are|is)\s+explanatory/i);
    assert.match(contract, /The seven-step pass is a procedure, not a second canon\./);
});

test('active Edition brain contains no replacement-canon language', () => {
    const forbidden = /\b(?:six|seven)\s+(?:canonical\s+)?tenets\b|six pedagogical families|6\+3\+1/i;
    const findings = [];
    for (const file of walkMarkdown(path.join(ROOT, '.github'))) {
        const match = read(file).match(forbidden);
        if (match) findings.push(`${path.relative(ROOT, file)}: ${match[0]}`);
    }
    assert.deepEqual(findings, []);
});

test('trimmed pass includes explicit disconfirmers while full pass stays seven steps', () => {
    const pass = normalizeSeparators(read(PASS));
    assert.match(pass, /Medium\*\* - trimmed \(steps 1, 3, 4, 5, 6\)/);
    const trimmed = extractSection(
        pass,
        '### Trimmed Pass (Steps 1, 3, 4, 5, 6)',
        '### Full Pass (All 7 Steps)'
    );
    assert.match(trimmed, /five load-bearing checks/i);
    assert.match(trimmed, /\*\*Disconfirmers\*\*/);
    const full = extractSection(pass, '### Full Pass (All 7 Steps)', '## Recording a Pass Result');
    for (const step of [
        'Materiality',
        'Hypothesise the ask',
        'Surface alternatives',
        'Identify disconfirmers',
        'Audit priors',
        'Severity check',
        'Commit with marker',
    ]) {
        assert.match(full, new RegExp(step, 'i'), `full pass lost step: ${step}`);
    }
});

test('every canonical tenet retains a named operational binding', () => {
    assert.equal(BINDINGS.length, CANON.length);
    for (const [id, relative, signal] of BINDINGS) {
        const file = path.join(INSTRUCTIONS, relative);
        assert.equal(fs.existsSync(file), true, `Tenet ${id} binding missing: ${relative}`);
        assert.match(read(file), signal, `Tenet ${id} binding lost signal ${signal}`);
    }
});
