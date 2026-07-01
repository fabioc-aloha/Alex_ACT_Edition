// @ts-check
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { preprocessMarkdown } = require('../.github/scripts/shared/markdown-preprocessor.cjs');

test('preprocessMarkdown preserves fenced code while transforming prose', () => {
    const input = [
        'Before [[Ctrl+S]] ==marked== <!-- pagebreak -->',
        '',
        '```bash',
        'echo "[[Ctrl+S]] ==marked== <!-- pagebreak --> $\\alpha$"',
        '```',
        '',
        'After [[Ctrl+P]] ==done== <!-- pagebreak -->',
    ].join('\n');

    const output = preprocessMarkdown(input, { format: 'docx' });

    assert.match(output, /Before <kbd>Ctrl<\/kbd>\+<kbd>S<\/kbd> <mark>marked<\/mark> \\newpage/);
    assert.match(output, /After <kbd>Ctrl<\/kbd>\+<kbd>P<\/kbd> <mark>done<\/mark> \\newpage/);
    assert.match(output, /```bash\necho "\[\[Ctrl\+S\]\] ==marked== <!-- pagebreak --> \$\\alpha\$"\n```/);
});
