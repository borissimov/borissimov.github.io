---
gh_issue_number: 34
type: "feature"
title: "Feature: v3_dev Schema Playground and Switcher"
---

# TASK-34: Feature: v3_dev Schema Playground and Switcher

Implement a separate development schema (v3_dev) and an in-app toggle to allow safe testing of relational mutations and schema changes.\n\nKey Tasks:\n1. DB: Create 'v3_dev' schema and clone production table structures.\n2. Client: Update 'supabaseClient.js' to support dynamic schema selection.\n3. Store: Refactor 'useProgramStore.js' to be schema-aware.\n4. UI: Implement a 'Developer Mode' toggle in the HubApp to switch between schemas.