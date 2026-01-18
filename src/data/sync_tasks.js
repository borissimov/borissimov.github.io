import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const FEATURES_DIR = './features';

// Professional taxonomy categories
const WORK_TYPES = ['Feature', 'Bug', 'Enhancement', 'Refactor', 'Chore', 'Compatibility', 'Documentation', 'Security', 'Performance'];

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) {
        return null;
    }
}

function getLocalFiles() {
    if (!fs.existsSync(FEATURES_DIR)) return [];
    return fs.readdirSync(FEATURES_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const content = fs.readFileSync(path.join(FEATURES_DIR, f), 'utf8');
            const match = content.match(/gh_issue_number:\s*(\d+)/);
            return {
                filename: f,
                fullPath: path.join(FEATURES_DIR, f),
                number: match ? parseInt(match[1]) : null,
                content
            };
        });
}

async function sync() {
    console.log("🔄 Starting Professional Task Sync...");

    if (!fs.existsSync(FEATURES_DIR)) {
        fs.mkdirSync(FEATURES_DIR);
    }

    // --- 1. PULL & MERGE: GitHub -> Local ---
    console.log("📥 Syncing open issues from GitHub...");
    const issuesJson = run('gh issue list --state open --json number,title,body,labels');
    if (!issuesJson) {
        console.error("❌ Failed to fetch issues from GitHub. Check your 'gh' auth status.");
        return;
    }

    const remoteIssues = JSON.parse(issuesJson);
    const localTasks = getLocalFiles();
    const openIssueNumbers = remoteIssues.map(i => i.number);

    remoteIssues.forEach(issue => {
        const safeTitle = issue.title.replace(/[^a-z0-9]/gi, '_');
        const expectedFilename = `GHI-${issue.number}_${safeTitle}.md`;
        
        // Find if we already have this issue locally (by number, not filename)
        const existingLocal = localTasks.find(t => t.number === issue.number);
        
        // Determine primary work type from labels
        const typeLabel = issue.labels.find(l => 
            WORK_TYPES.some(wt => wt.toLowerCase() === l.name.toLowerCase())
        )?.name || 'Task';

        const newContent = `---
gh_issue_number: ${issue.number}
type: "${typeLabel}"
title: "${issue.title}"
---

# TASK-${issue.number}: ${issue.title}

${issue.body}`;

        if (existingLocal) {
            // Update existing file
            if (existingLocal.filename !== expectedFilename) {
                console.log(`   📝 Renaming ${existingLocal.filename} -> ${expectedFilename}`);
                fs.unlinkSync(existingLocal.fullPath);
            }
            
            // Only overwrite if content changed to avoid unnecessary git noise
            if (existingLocal.content !== newContent) {
                fs.writeFileSync(path.join(FEATURES_DIR, expectedFilename), newContent);
                console.log(`   ✅ Updated TASK-${issue.number}`);
            }
        } else {
            // Create new file
            fs.writeFileSync(path.join(FEATURES_DIR, expectedFilename), newContent);
            console.log(`   🆕 Created TASK-${issue.number}: ${issue.title}`);
        }
    });

    // --- 2. PUSH: Local Drafts -> GitHub ---
    console.log("📤 Checking for local drafts to push...");
    const drafts = fs.readdirSync(FEATURES_DIR)
        .filter(f => f.endsWith('.md') && !f.startsWith('GHI-'));

    drafts.forEach(file => {
        const fullPath = path.join(FEATURES_DIR, file);
        console.log(`   🚀 Found new draft: ${file}. Pushing to GitHub...`);
        
        const title = file.replace('.md', '').replace(/_/g, ' ');
        const newIssueUrl = run(`gh issue create --title "${title}" --body-file "${fullPath}"`);
        
        if (newIssueUrl) {
            console.log(`   ✅ Created Issue: ${newIssueUrl}`);
            fs.unlinkSync(fullPath); // Next pull will bring it back with GHI prefix
        }
    });

    // --- 3. CLEAN: Remove closed issues ---
    console.log("🧹 Cleaning up closed tasks...");
    const currentLocal = getLocalFiles();
    currentLocal.forEach(task => {
        if (task.number && !openIssueNumbers.includes(task.number)) {
            console.log(`   🗑️ Removing closed TASK-${task.number}: ${task.filename}`);
            fs.unlinkSync(task.fullPath);
        }
    });

    console.log("✨ Sync Complete!");
}

sync();