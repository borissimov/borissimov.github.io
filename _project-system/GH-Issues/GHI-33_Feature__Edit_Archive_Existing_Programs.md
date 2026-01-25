---
gh_issue_number: 33
type: "feature"
title: "Feature: Edit/Archive Existing Programs"
---

# TASK-33: Feature: Edit/Archive Existing Programs

Enable users to modify existing programs and safely archive them to manage clutter while preserving training history.\n\nKey Tasks:\n1. DB: Add 'archived_at' to v3.programs.\n2. Store: Implement 'fetchProgramDetails' for deep-loading nested program state.\n3. Store: Implement 'archiveProgram' (soft delete).\n4. UI: Add Edit/Archive controls to the Program Switcher overlay.\n5. Logic: Update 'saveProgram' to handle relational updates (upserts).