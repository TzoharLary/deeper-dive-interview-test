---
name: refactor
description: "Engineer prompt template to request a refactor or code improvement."
agent: "RefactorEngineer"
tools:
  - edit/editFiles
  - runSubagent
---
---

Inputs:
- `${input:files}` — comma-separated list of file paths to change.
- `${input:goal}` — brief description of the refactor goal.

Template:
```
Goal: ${input:goal}
Files: ${input:files}
Constraints: Vanilla TypeScript only. Add Mini-Zod validators for public inputs where appropriate.
Deliverables: changed files diff, short rationale, test plan.
``` 
