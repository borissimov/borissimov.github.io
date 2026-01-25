---
gh_issue_number: 30
type: "bug"
title: "Restore Session Metrics and Rename Component"
---

# TASK-30: Restore Session Metrics and Rename Component

The session volume and intensity calculations on the Agenda are broken because the component is looking for 'set_logs' instead of 'performance_logs'. Additionally, rename ActivityLogCard.jsx to CompletedSessionCard.jsx to align with V3 domain terminology.