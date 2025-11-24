This file documents the story of the project and my thought process, but entirely through the lens of the AI workflow. In other words, how I managed the project’s development using AI tools and MCP systems, at which points they came in, how I constrained them, how I validated outputs, and what I learned about using them correctly inside a real project.

## Start: Understanding the Task and the Users

For me, the first step was to understand the target users of the system I’m building, and to understand their pain so I can know where my emphasis should be. After I understood the goal, I realized this is not just a “regular system to implement”, but that here there is a strong focus on safety. The goal is not only to build a “text editor”, but a system with guard rails. Some of the guiding questions I had from the very beginning were what a support engineer most wants and needs to see when they open the tool, and how I can create a page that feels comfortable, intuitive, and clear for a support engineer.

**AI workflow:** I used different LLMs to analyze `TASK.md` and run a kind of brainstorming about emphasis points, structure, good architecture, attention to language and library constraints, getting different perspectives on the users’ pain points, and turning those into concrete requirements the project has to satisfy. Each time, I required the LLM to explain what its answers were based on, to make sure there was no drift into generic conclusions that were not grounded in the task file.

**Output**  
Answers to “what hurts”, and a translation of those pains into emphasis points and requirements.

---

## Step 1: Mapping the AI and MCP Tooling, Then Writing a Strategy Document

**What happened at this stage**  
Before I started building infrastructure or code, I stopped to understand what tools I had available and what I already knew how to do with them, in parallel to the requirements I had just defined. The goal was to map which tools are actually relevant to the project and where each tool connects to a requirement or emphasis point – not yet at a precise “how to implement” level, but at a strategic fit level. Once I had a clear mapping, I wrote a strategy and requirements document that centralizes the product goals and preserves the logic and boundaries of the project – that is the `MASTER_PLAN`.

**AI workflow**  
I used the GitHub MCP server to go over official sources of each MCP server and key tool, usually public repositories. I had an agent gather the information and produce a structured file listing all tools of each server and what they can do. With this file, I went to LLMs and matched tools to requirements: who is part of the process, who isn’t, and at what stage each one is relevant.  
At this stage I also identified the Awesome Copilot MCP as a best-practices server. I used it to find patterns and workflows close to my goal, and then asked it to adapt them to my stack and the constraints of the task. In parallel, I kept in mind that the structure of agents and their instructions is changing quickly, so I did not rely on best practices blindly; I always checked against the up-to-date GitHub and VS Code documentation to see what is actually correct right now.

**Output**  
A tool catalog file for all MCP servers, a mapping of tools to requirements, and a `MASTER_PLAN` document that defines goals, boundaries, and the security model.

---

## Step 2: Setting Up AI Infrastructure, Agents, Configurations, and Basic Validation

**What happened at this stage**  
After I understood the tools and the boundaries, I set up the infrastructure of the system and of the AI workflow itself. I built several different agents to overcome the 128-tools-per-agent limit, and also to control each agent’s responsibility separately. I built a main agent that manages all the others and uses them when needed. The idea was that one agent shouldn’t hold all the tools and all the thinking, but instead manage a team of agents, each sharp in its own domain. For that reason I also built additional agents that can be called as subagents when needed, to get access to the full toolset without overloading one agent and without losing context.

**Defined agents**  
Master – a main agent that holds the big picture, distributes work, and decides when to call whom.  
Architect – responsible for deep decisions about file structure, data flow, separation between data, store, UI, and validations, and keeping the codebase clean Vanilla TS without React/framework habits.  
Engineer – responsible for actual code implementation according to decisions: API, store, editor UI, validations, types, removing `any`, ESLint.  
Prototyper – responsible for an external MVP and refining UX/UI based on user pains, without being bound to code constraints.  
QA – responsible for checking reliability, user flows, validations, tests, ESLint, and that changes do not break anything. This agent is there to critique, not to please.

**AI workflow**  
I created the project configuration files and ran them. I mapped which MCP servers each agent can access; not everyone got everything. I learned that it’s not enough to just “connect” all the servers – you need to give clear boundaries. So I did not give all agents free access to the GitHub MCP. Some of them got no permissions to it at all, so they couldn’t perform automatic actions like opening Pull Requests or pushing, even if “it seemed right” to them. Only specific agents, that I understood do not have a natural tendency to do such actions, got access.  
I used the Awesome Copilot MCP to import best practices for defining agents, and then adapted them for each agent according to the project’s requirements. All agents received the `MASTER_PLAN` as a constant context. For every complex task I used subagents to spin off a clean context. In parallel, I set up a basic validation layer to close safety gaps from the very beginning, to be extended later.

**Output**  
A set of agents with clear responsibility boundaries, runtime configurations and tool-access mapping per agent, and an initial validation layer that protects the code and the data.

---

## Step 3: Building a Phased Work Plan with LLMs and Task Master, with Output Control

**What happened at this stage**  
After the infrastructure and agents were up and running, I built a structured work plan that defines stages and groups of stages for building the system, according to the `MASTER_PLAN` and the constraints.

**AI workflow**  
For every major stage or group of stages I created a small task list in the Task Master MCP. The server broke it down into tasks and subtasks while accounting for dependencies, and that gave me a smoother execution order.  
During the work I discovered that Task Master does not always “understand” the assignment constraints. In some runs it produced plans that included libraries and technologies I am explicitly not allowed to use. Instead of accepting that, I built a workflow where agents review its outputs, filter out any forbidden usage, and correct the plan so it aligns with the `MASTER_PLAN`. I learned to use Task Master mainly for small, focused tasks, or with very sharp prompts that also instruct the agent to review the outputs coming back from that server and correct itself after using the tool.

**Output**  
A phased work plan, broken into subtasks, after filtering and fixing outputs that didn’t meet the constraints.

---

## Step 4: Creating a Fast MVP in Base44 via Playwright, Visual Checks, Then Translating to Vanilla TS

**What happened at this stage**  
I wanted a fast MVP to see a working product early. The master agent connected to the Playwright MCP, entered Base44, and automatically created an initial MVP, with a few iterations of build-and-improve. After that, it downloaded the code and translated whatever could be leveraged into Vanilla TS, without copying React, but reimplementing under the constraints.

**AI workflow**  
While working in Base44, the prototyper was activated to refine UI and UX according to user pains. During component construction, I also used Playwright and Chrome DevTools to write prompts according to the requirements, capture the actual state in different stages, and compare it to what I wanted to see, until I had a satisfying MVP. Afterwards, I asked the agents to adjust component by component based on the comparison to the generated MVP, using context from screenshots plus the code downloaded from Base44. During the translation to Vanilla TS, the master agent consulted with the architect and engineer to ensure the translation was architecturally sound and did not introduce disallowed dependencies.

**Output**  
A working MVP in Base44 and Vanilla TS code that implements the same product in a clean and safe way.

---

## Step 5: Local UI Refinement with Stagewise

**What happened at this stage**  
Once the MVP existed in Vanilla TS, I wanted fast, incremental UI polish on a real running system.

**AI workflow**  
I ran a local server with Stagewise, which lets you select a component, describe a change in chat, and get an immediate adjustment. It was more convenient than basic browser tools for small tweaks, especially once the structure was already locked in.

**Output**  
Focused UI improvements that made the interface sharper and clearer for the support user.

---

## Step 6: Manual Review of the Structure Suggested by the LLM, Code Cleanup, and Strengthening the Server Side

**What happened at this stage**  
I paused to look with my own eyes at all the files that had been added, checked that the LLM hadn’t “run ahead” with a structure that was convenient for it but not optimal for me, and fixed accordingly. I fixed ordering and cleanliness, and split the server file into several files to keep a slim server. Here I reinforced a principle that is important to me: the main server file is a thin entry point that delegates to logic living elsewhere.

**AI workflow**  
I consulted Gemini Pro 3 via my agent to get an external debug on the architecture and the code. I let it point out problems, and then manually chose what to adopt and what not to, aligning everything back to the `MASTER_PLAN`.

**Output**  
A cleaner code structure, a properly split server, and a strengthened architecture after both manual and external review.

---

## Step 7: QA Loops, Validating User Flows, Validations, and Tests

**What happened at this stage**  
I activated the QA agent to make sure the system really holds up in reality. This included loops of testing, fixing, and retesting until everything settled.

**AI workflow**  
The QA agent used the Playwright MCP and Chrome DevTools MCP to run all possible user flows end-to-end, not just a final “end of project” check. It also validated visual behavior of components against screenshots in UX-sensitive places. In parallel it went through all validation files to make sure every dangerous change is pre-validated, and ran existing test files to catch issues already covered by tests. After each loop, it returned gaps and explanations; I fixed them, and it ran again.

**Output**  
A system that passed full user-flow verification, validations, and tests, and remained stable after hardening.

---

## Step 8: Creating the README and Guide Using the GitHub Agent

**What happened at this stage**  
I created documentation that explains how to use the tool.

**AI workflow**  
I opened an issue in the repo, assigned it to the GitHub Copilot agent, and asked it to write a clear README and a detailed guide. I asked it to include screenshots of the system to make the explanations more tangible.

**Output**  
A README and guide with screenshots.

---

## Strengthening Security by Restricting Allowed Values in Configuration Fields

**What happened at this stage**  
As part of the security focus, I created specific value lists for sensitive fields. The goal was to avoid even a single path where a user could enter a value that would break JSON. This also allowed me to build a UI that only exposes legal options.

**AI workflow**  
I used LLMs to define the lists in a closed and structured way, then embedded them as validation rules and as the basis for UI components.

**Output**  
A closed set of values for sensitive fields, and validation that blocks invalid values up front.

---

## What I Learned About Working with AI and MCP in This Project

Throughout the work I realized that the power of AI only shows up if you manage it correctly:

* Build several agents, then a managing agent that uses them as subagents to get more tools and a clean context.
* Don’t run MCP servers “freely”; define boundaries and permissions for each agent according to its role.
* Use Task Master for small tasks or with very sharp instructions, and review its outputs to prevent drift into forbidden technologies.
* Use Playwright and Chrome DevTools not only at the end, but along the way: for replaying user flows and for screenshot-based UI matching when you need UI precision.
* Every structure the LLM suggests has to go through manual review before moving forward.
* When defining a work stage, perform the whole group of changes for that stage in a single session to preserve context, and only then decide what to keep.
