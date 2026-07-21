#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function section(text, startHeading, endHeading) {
    const start = text.indexOf(startHeading);
    const end = text.indexOf(endHeading, start);
    if (start < 0 || end < 0) throw new Error(`Missing register section: ${startHeading}`);
    return text.slice(start, end);
}

function primaryRows(text, start, end) {
    return [...section(text, start, end).matchAll(/^\| `([^`]+)` \| [^|]+ \| [^|]+ \| [^|]+ \| (Keep|Adapt|Optional|Retire) \|/gm)]
        .map(match => ({ artifact: match[1], disposition: match[2] }));
}

function assertExact(label, expected, actual) {
    const expectedSet = new Set(expected);
    const actualSet = new Set(actual);
    const missing = expected.filter(item => !actualSet.has(item));
    const extra = actual.filter(item => !expectedSet.has(item));
    const duplicates = actual.filter((item, index) => actual.indexOf(item) !== index);
    if (missing.length || extra.length || duplicates.length) {
        throw new Error(`${label} mismatch: missing=${missing.join(',')} extra=${extra.join(',')} duplicates=${duplicates.join(',')}`);
    }
}

function checkArtifactRegister({ manifestPath, registerPath }) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const register = fs.readFileSync(registerPath, 'utf8');
    const instructions = primaryRows(register, '### Instructions', '### Skills');
    const skills = primaryRows(register, '### Skills', '### Prompts');
    const prompts = primaryRows(register, '### Prompts', '### Agents');
    const agents = primaryRows(register, '### Agents', '### Supporting Shipped Files');
    const supportSection = section(register, '### Supporting Shipped Files', '### Aggregate Disposition');
    const support = [...supportSection.matchAll(/^\| `([^`]+)` \| (Keep|Adapt|Optional|Retire) \|/gm)]
        .map(match => ({ artifact: match[1], disposition: match[2] }));

    assertExact('instructions', manifest.instructions, instructions.map(item => `${item.artifact}.instructions.md`));
    assertExact('skills', manifest.skills, skills.map(item => item.artifact));
    const profilePrompts = manifest.universal_candidate
        ? manifest.universal_candidate.profile_files
            .filter(item => item.startsWith('vscode/prompts/'))
            .map(item => path.basename(item))
        : [];
    assertExact('prompts', manifest.prompts.concat(profilePrompts), prompts.map(item => item.artifact));
    assertExact('agents', manifest.agents, agents.map(item => item.artifact));

    const expectedSupport = [
        ...manifest.skill_files.filter(item => !/^[^/]+\/SKILL\.md$/.test(item)),
        ...manifest.scripts.map(item => `scripts/${item}`),
        manifest.copilot_instructions,
        ...manifest.configs.map(item => `config/${item}`),
        manifest.version_file,
        ...manifest.vscode_assets.map(item => `.vscode/${item}`),
        ...manifest.bootstrap_templates,
    ];
    assertExact('support', expectedSupport, support.map(item => item.artifact));
    return [...instructions, ...skills, ...prompts, ...agents, ...support]
        .reduce((counts, item) => ({ ...counts, [item.disposition]: (counts[item.disposition] || 0) + 1 }), {});
}

if (require.main === module) {
    const getArg = (name) => {
        const index = process.argv.indexOf(name);
        return index >= 0 ? process.argv[index + 1] : null;
    };
    try {
        const manifestPath = getArg('--manifest') || path.resolve(__dirname, '..', 'config', 'edition-manifest.json');
        const registerPath = getArg('--register');
        if (!registerPath) throw new Error('Required: --register <candidate-review.md>');
        console.log(JSON.stringify(checkArtifactRegister({ manifestPath, registerPath: path.resolve(registerPath) }), null, 2));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { checkArtifactRegister };
