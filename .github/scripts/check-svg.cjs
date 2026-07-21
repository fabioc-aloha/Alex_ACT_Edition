#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function checkSvg(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!/<svg\b[^>]*(?:viewBox|width)=/i.test(content)) throw new Error('SVG root or dimensions missing');
    if (!/<\/(?:svg)>/i.test(content)) throw new Error('SVG closing element missing');
    if (!/<(path|rect|circle|line|polyline|polygon|text)\b/i.test(content)) throw new Error('SVG contains no visible element');
    if (/<script\b/i.test(content)) throw new Error('SVG scripts are not allowed');
    return { bytes: Buffer.byteLength(content) };
}

if (require.main === module) {
    try {
        const file = process.argv[2];
        if (!file) throw new Error('Required: <svg-file>');
        console.log(JSON.stringify(checkSvg(path.resolve(file)), null, 2));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { checkSvg };
