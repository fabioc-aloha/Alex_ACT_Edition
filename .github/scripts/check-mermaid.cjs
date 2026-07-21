#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function checkMermaid(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const blocks = [...content.matchAll(/```mermaid\s*\r?\n([\s\S]*?)```/g)].map(match => match[1]);
    if (blocks.length === 0) throw new Error('No Mermaid blocks found');
    for (const block of blocks) {
        if (!block.includes('%%{init:')) throw new Error('Mermaid block missing init directive');
        if (!/\b(flowchart|sequenceDiagram|stateDiagram|classDiagram)\b/.test(block)) throw new Error('Mermaid block missing supported diagram declaration');
        if (/flowchart/.test(block) && !block.includes('linkStyle default')) throw new Error('Flowchart missing linkStyle default');
    }
    return { blocks: blocks.length };
}

if (require.main === module) {
    try {
        const file = process.argv[2];
        if (!file) throw new Error('Required: <markdown-file>');
        console.log(JSON.stringify(checkMermaid(path.resolve(file)), null, 2));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { checkMermaid };
