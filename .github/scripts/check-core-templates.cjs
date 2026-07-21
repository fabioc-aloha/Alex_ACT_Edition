#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const requirements = {
    'plan.md': ['Goal', 'Scope', 'Alternatives', 'Tasks and Dependencies', 'Checker and Stop Condition', 'Rollback'],
    'preflight.md': ['Intended Diff', 'Owners and Prerequisites', 'Checks', 'Rollback', 'Approval'],
    'status.md': ['Outcome', 'Evidence', 'Current State', 'Blockers and Risks', 'Decisions and Next Checkpoint'],
    'tracker.md': ['Item', 'Owner', 'State', 'Evidence', 'Next Action', 'Review Date'],
    'architecture.md': ['Context and Decisions', 'Boundaries and Interfaces', 'Diagram', 'Risks and Roadmap', 'Falsifiers'],
    'handoff.md': ['Shipped', 'In Progress', 'Pending Decisions', 'Evidence', 'Resume Point'],
};

function checkCoreTemplates(root) {
    const templateRoot = path.join(root, '.github', 'core', 'templates');
    const files = fs.readdirSync(templateRoot).sort();
    if (JSON.stringify(files) !== JSON.stringify(Object.keys(requirements).sort())) throw new Error('Core template inventory mismatch');
    for (const [file, fields] of Object.entries(requirements)) {
        const content = fs.readFileSync(path.join(templateRoot, file), 'utf8');
        for (const field of fields) {
            if (!content.includes(field)) throw new Error(`${file} missing ${field}`);
        }
        if (content.split(/\r?\n/).length > 40) throw new Error(`${file} exceeds compact template ceiling`);
    }
    return { templates: files.length };
}

if (require.main === module) {
    try {
        console.log(JSON.stringify(checkCoreTemplates(path.resolve(__dirname, '..', '..')), null, 2));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { checkCoreTemplates };
