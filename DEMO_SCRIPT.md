# <3 minute public demo script

Target: 2:20–2:40. No copyrighted music is required.

## 0:00–0:20 — The problem
Show the blank MV Atelier.

Voice: “Most creative agents make humans translate an image into prompts, then work somewhere else. AIﾉアカリ☆ MV Atelier keeps one artifact between us: one doodle, one project, one visible timeline.”

## 0:20–0:50 — Human starts
Upload a doodle. Show its preview, palette, brightness, contrast and orientation. Show the generated 0–15 second storyboard.

Voice: “The pixels are analyzed locally in the browser. Nothing here needs a paid vision model.”

## 0:50–1:15 — WebMCP discovery
Show `document.modelContext.getTools()` and the structured tool names.

Voice: “The site does not ask an agent to guess at buttons. It exposes the creative operations directly through WebMCP.”

## 1:15–1:50 — Agent edits the same state
Invoke `read_current_mv_project`, then `set_mood` with `uneasy`, then `rewrite_shot` for shot-2. Keep the human UI visible while it changes.

Voice: “The agent reads the exact project I see. When it changes mood or rewrites a shot, my screen changes because there is only one shared state.”

## 1:50–2:10 — Temporal graph integrity
Invoke `reorder_shots` with shot-3 first. Point to rebuilt 0–5 / 5–10 / 10–15 second timecodes.

Voice: “Even structural edits preserve a coherent timeline, so the result stays usable by a human editor.”

## 2:10–2:30 — Truthful boundary
Invoke `render_or_prepare_video`.

Voice: “No paid provider is required for this demo. If a verified executor is absent, it stops at prompt-ready instead of pretending a video was rendered.”

## 2:30–2:40 — End
Show doodle + timeline together.

Voice: “You are me, I am you: not because the agent imitates me, but because we can take turns shaping the same thing.”
