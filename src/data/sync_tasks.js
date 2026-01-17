import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const FEATURES_DIR = './features';

// Helper to run shell commands and return output
function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch (e) {
        return null;
    }
}

async function sync() {
    console.log("🔄 Starting Task Mirror Sync...");

    if (!fs.existsSync(FEATURES_DIR)) {
        fs.mkdirSync(FEATURES_DIR);
    }

    // --- 1. PULL: GitHub -> Local ---
    console.log("📥 Pulling open issues from GitHub...");
    const issuesJson = run('gh issue list --state open --json number,title,body');
    if (issuesJson) {
        const issues = JSON.parse(issuesJson);
        issues.forEach(issue => {
            // Create a filename like GHI-004_Epic_Dynamic_Plan_Management.md
            const safeTitle = issue.title.replace(/[^a-z0-9]/gi, '_');
            const filename = `GHI-${issue.number}_${safeTitle}.md`;
            const filePath = path.join(FEATURES_DIR, filename);
            
            const content = `---
gh_issue_number: ${issue.number}
title: "${issue.title}"
---

${issue.body}`;

            fs.writeFileSync(filePath, content);
            console.log(`   ✅ Synced ${filename}`);
        });
    }

    // --- 2. PUSH: Local -> GitHub (New Files Only) ---
    console.log("📤 Checking for new local tickets to push...");
    const localFiles = fs.readdirSync(FEATURES_DIR);
    localFiles.forEach(file => {
        if (!file.startsWith('GHI-') && file.endsWith('.md')) {
            console.log(`   🚀 Found new local ticket: ${file}. Pushing to GitHub...`);
            const body = fs.readFileSync(path.join(FEATURES_DIR, file), 'utf8');
            const title = file.replace('.md', '').replace(/_/g, ' ');
            
            const newIssueUrl = run(`gh issue create --title "${title}" --body-file "${path.join(FEATURES_DIR, file)}"`);
            if (newIssueUrl) {
                console.log(`   ✅ Created Issue: ${newIssueUrl}`);
                // Delete the draft file; the next 'pull' cycle will bring it down with the correct GHI prefix
                fs.unlinkSync(path.join(FEATURES_DIR, file));
            }
        }
    });

    // --- 3. CLEAN: Remove local files for closed issues ---
    console.log("🧹 Cleaning up closed tasks...");
    const openIssueNumbers = JSON.parse(issuesJson || '[]').map(i => i.number.toString());
    localFiles.forEach(file => {
        if (file.startsWith('GHI-')) {
            const match = file.match(/GHI-(\d+)_/);
            if (match && !openIssueNumbers.includes(match[1])) {
                console.log(`   🗑️ Removing ${file} (Issue closed on GitHub)`);
                fs.unlinkSync(path.join(FEATURES_DIR, file));
            }
        }
    });

    console.log("✨ Sync Complete!");
}

sync();
