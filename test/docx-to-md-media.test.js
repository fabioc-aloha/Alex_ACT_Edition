// @ts-check
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { extractImages } = require('../.github/skills/docx-to-md/scripts/docx-to-md.cjs');

test('extractImages copies from pandoc temp media dir without deleting user media folder', () => {
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-output-'));
    const pandocMediaDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pandoc-media-'));
    try {
        fs.mkdirSync(path.join(outputDir, 'media'), { recursive: true });
        fs.writeFileSync(path.join(outputDir, 'media', 'keep.txt'), 'user-owned');
        fs.mkdirSync(path.join(pandocMediaDir, 'media'), { recursive: true });
        fs.writeFileSync(path.join(pandocMediaDir, 'media', 'image1.png'), 'png-bytes');

        const md = extractImages('![Alt](media/image1.png)', outputDir, 'images', pandocMediaDir);

        assert.equal(md, '![Alt](images/image-001.png)');
        assert.equal(fs.readFileSync(path.join(outputDir, 'images', 'image-001.png'), 'utf8'), 'png-bytes');
        assert.equal(fs.readFileSync(path.join(outputDir, 'media', 'keep.txt'), 'utf8'), 'user-owned');
    } finally {
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.rmSync(pandocMediaDir, { recursive: true, force: true });
    }
});
