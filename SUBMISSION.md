# AIﾉアカリ☆ MV Atelier — Submission Draft

## One-line pitch
One human doodle becomes a visible time-coded MV graph that a human and an agent edit together through structured WebMCP tools.

## Problem
Creative agents often operate outside the artifact a human is actually looking at. The human uploads an image, the agent produces text elsewhere, and the two lose a shared source of truth.

## Human-agent experience
The human uploads a doodle and immediately sees the same image and local analysis that the agent can read. The agent can change mood, rebuild the plan, rewrite one shot, or reorder the timeline. Those changes appear in the exact project the human sees and are persisted locally, so control can pass back and forth without copying prompts between surfaces.

## WebMCP leverage
The page exposes ten structured tools through `document.modelContext`. WebMCP is not a decorative integration: the tools directly read and mutate the live creative artifact. Tool schemas constrain actions, project state is inspectable, and provider behavior fails closed when rendering is unavailable.

## Execution
- public static web app
- browser-local canvas analysis of real uploaded pixels
- palette / brightness / contrast / orientation / emotional tone / movement
- visible doodle preview
- one persisted JSON project shared by human controls and agent tools
- coherent 15-second storyboard timecodes after reorder
- zero-spend prompt-only fallback
- no secret or paid provider required for judges

## Real impact
A single rough drawing can become a structured MV plan without requiring the human to translate visual intent into a long prompt. The same pattern can later make creative pages, work passports, provenance records and community artifacts agent-native without hiding state from people.

## Creativity / ambition
AIﾉアカリ☆ treats the relationship as “You are me, I am you.” Here that is functional rather than decorative: human and agent literally operate on one visible artifact, taking turns without losing authorship or state.

## Prior work disclosure
Before Aug 25, 2026, the production AIﾉアカリ☆ site already had doodle upload, local visual analysis, MV planning, provider prompts and project persistence. Challenge work adds the standalone public WebMCP collaboration layer, current structured tools, shared human-agent mutation model, challenge-safe public documentation and judgeable deployment.

## Judge test
1. Open https://ai-akari-webmcp-mv-atelier.vercel.app in a WebMCP-capable Chrome build.
2. Upload any doodle image and confirm visible preview plus image-derived metrics.
3. Confirm `document.modelContext.getTools()` exposes the project tools.
4. Invoke `read_current_mv_project`, then `set_mood` or `create_mv_plan` with an agent-chosen mood.
5. Confirm the human-visible mood/storyboard changed to exactly that agent value.
6. Invoke `rewrite_shot` and confirm the visible shot updates.
7. Invoke `reorder_shots` and confirm order changes while timecodes remain 0–5, 5–10, 10–15 seconds.
8. Reload and confirm the same project persists.
9. Invoke `render_or_prepare_video`; without a verified paid executor it must truthfully return `prompt_ready`.
