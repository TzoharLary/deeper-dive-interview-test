---
name: update-status
description: "Prompt template for Architect to update phase status in task manager."
agent: "agent"
tools:
  - task_master
---

Use this template to submit concise phase updates to the `task_manager`.

Inputs:
- `${input:phase}` — phase identifier (e.g., "Phase 1: Discovery").
- `${input:status}` — one-word status (e.g., "IN_PROGRESS", "COMPLETE").
- `${input:notes}` — short notes (1-3 sentences).

Template:
```
Phase: ${input:phase}
Status: ${input:status}
Notes: ${input:notes}
ActionItems: (list up to 5 short tasks)
``` 
