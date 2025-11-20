---
name: generate-ui
description: "Prototyper prompt template to generate UI flow prompts (Base44)."
agent: "Base44Prototyper"
tools:
  - awesome-copilot/*
  - runSubagent
  - 'io.github.github/github-mcp-server/*'  
  - 'playwright/*'
---
---

Inputs:
- `${input:user_story}` — short user story.
- `${input:flow_name}` — flow identifier.

Template:
```
Goal: Create a Base44 prompt for UI flow `${input:flow_name}`
UserStory: ${input:user_story}
Constraints: (accessibility, responsiveness, Vanilla TS where applicable)
Examples: (provide 2 short examples)
Evaluation: (how to validate generated UI mockups / artifacts)
``` 
