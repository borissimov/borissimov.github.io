---
gh_issue_number: 32
type: "feature"
title: "Feature: Program Context Switcher in Library"
---

# TASK-32: Feature: Program Context Switcher in Library

Implement a mechanism to select and filter training programs in the Library.\n\nKey Tasks:\n1. Store: Add 'programs' array and 'activeProgramId' state.\n2. Store: Update 'fetchProgramManifest' to fetch user programs.\n3. UI: Replace static Library title with a selectable Program Dropdown.\n4. Logic: Filter 'programDays' based on the 'activeProgramId'.