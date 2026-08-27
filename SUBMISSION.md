# WebMCP Challenge submission draft

## Problem

Creative tools usually force a person to translate a sketch into prompts, then repeatedly copy text between an agent and an editor. That breaks the creative loop.

## Human + agent UX

AIﾉアカリ☆ MV Atelier starts from one visible doodle. The human sees the uploaded preview and real local visual features. A WebMCP agent reads the same project, changes mood or shots, and the human sees the mutation immediately. The human can then edit the title/mood, save, and ask the agent to continue. Browser localStorage keeps the same project across reloads.

## WebMCP leverage

Ten structured tools expose meaningful project operations through `document.modelContext`: read/analyze, plan/mood, propose/rewrite/reorder shots, provider inspection, save, and render-or-prepare. These are not button wrappers: they preserve the temporal graph and return the exact shared state.

## Execution and safety

The live demo is static and zero-spend. Canvas analysis is local. Provider inspection is fail-closed; without verified credentials/executor, video status is `prompt_ready`, never fake completion.

## Impact and ambition

The same source image, project state and time-coded MV graph are understandable to both a person and an agent. This is a small but complete foundation for collaborative visual storytelling.

## Prior vs Challenge work

The private AIﾉアカリ☆ codebase already contained a prompt-only MV planner. This public repository is a safe standalone extraction. WebMCP registration, local image grounding, preview, shared mutation, submission assets and the public deployment were added for the Challenge.

## Test

Open the [live demo](https://ai-akari-webmcp-mv-atelier.vercel.app), upload any doodle, click **Create 15s plan**, then use a WebMCP-capable browser to run `read_current_mv_project`, `set_mood`, `rewrite_shot`, `reorder_shots`, and `save_mv_project`. Verify each result in the visible UI and reload to verify persistence.
