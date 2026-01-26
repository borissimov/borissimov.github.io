---
gh_issue_number: 35
type: "bug"
title: "Fix: Expose v3_dev schema to Supabase API"
---

# TASK-35: Fix: Expose v3_dev schema to Supabase API

The v3_dev schema is created but not exposed via PostgREST, causing 406 Not Acceptable errors in Sandbox mode.\n\nKey Tasks:\n1. Use Supabase Management API to add 'v3_dev' to db_schemas.\n2. Verify visibility with test script.