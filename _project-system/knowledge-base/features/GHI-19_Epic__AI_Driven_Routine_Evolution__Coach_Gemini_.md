---
gh_issue_number: 19
type: "Task"
title: "Epic: AI-Driven Routine Evolution (Coach Gemini)"
---

# TASK-19: Epic: AI-Driven Routine Evolution (Coach Gemini)

A comprehensive AI coaching system using Gemini 3.0 Flash to analyze user history and suggest routine optimizations.

### Components:
- **Data Aggregator:** Extracts Volume, RPE, and Consistency stats from logs.
- **Coach Gemini API:** Supabase Edge Function integrating with Gemini 3.0 Flash.
- **Insight Memory:** Database table for storing historical recommendations.
- **Hybrid Trigger:** Weekly pg_cron updates + User-triggered recalibration.
- **Actionable UI:** approve/apply routine changes suggested by the AI.