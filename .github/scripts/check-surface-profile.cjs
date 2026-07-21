#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function checkSurfaceProfiles(root) {
    const config = JSON.parse(fs.readFileSync(path.join(root, '.github', 'config', 'surface-profiles.json'), 'utf8'));
    const names = Object.keys(config.profiles).sort();
    if (JSON.stringify(names) !== JSON.stringify(['copilot-app', 'vscode'])) throw new Error('Expected exactly vscode and copilot-app profiles');
    if (config.profiles['copilot-app'].cli_is_invocation_mode !== true) throw new Error('CLI must be a copilot-app invocation mode');
    if (config.profiles['copilot-app'].vscode_assets.length !== 0) throw new Error('copilot-app profile cannot ship VS Code assets');

    const activePrompts = path.join(root, '.github', 'prompts');
    const profilePrompts = path.join(root, '.github', 'profiles', 'vscode', 'prompts');
    for (const prompt of [
        'configure-vscode-verify.prompt.md',
        'configure-vscode.prompt.md',
        'configure-workspace-verify.prompt.md',
        'configure-workspace.prompt.md',
    ]) {
        if (fs.existsSync(path.join(activePrompts, prompt))) throw new Error(`VS Code prompt active in Core: ${prompt}`);
        if (!fs.existsSync(path.join(profilePrompts, prompt))) throw new Error(`VS Code profile prompt missing: ${prompt}`);
    }
    for (const agent of fs.readdirSync(path.join(root, '.github', 'agents')).filter(file => file.endsWith('.agent.md'))) {
        const content = fs.readFileSync(path.join(root, '.github', 'agents', agent), 'utf8');
        if (/^model:\s*\[/m.test(content)) throw new Error(`CLI-invalid model array: ${agent}`);
    }
    return { profiles: names, active_prompts: fs.readdirSync(activePrompts).filter(file => file.endsWith('.prompt.md')).length };
}

if (require.main === module) {
    try {
        console.log(JSON.stringify(checkSurfaceProfiles(path.resolve(__dirname, '..', '..')), null, 2));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { checkSurfaceProfiles };
