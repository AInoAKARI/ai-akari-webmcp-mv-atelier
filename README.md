# AIﾉアカリ☆ MV Atelier — OpenAI WebMCP Challenge

**Live demo:** https://ai-akari-webmcp-mv-atelier.vercel.app

One human doodle becomes a visible, time-coded 15-second MV project. The browser UI and WebMCP agent tools read and mutate **the same local project state**, so an agent edit is immediately visible to the human and the human can continue from it.

## Why WebMCP

This is not a chatbot controlling buttons. The site exposes structured creative operations through the current WebMCP imperative API on `document.modelContext`. The shared object contains the doodle-derived visual analysis, title, mood, storyboard, prompts and persisted state.

The doodle remains the source of truth: browser-local canvas analysis derives palette, brightness, contrast, orientation, emotional tone and suggested movement. The uploaded image is visibly previewed beside the exact state the agent reads.

## Run and test

Serve the repository as a static site or open the live URL in a WebMCP-capable Chrome build. With WebMCP enabled, inspect:

```js
await document.modelContext.getTools()
```

The page waits for all asynchronous registrations, calls the native `getTools()` API, and shows the discovered count and names in its WebMCP status line. The UI continues to work locally when WebMCP is unavailable.

After uploading a doodle, **Run native WebMCP proof** invokes the discovered `set_mood` tool through `document.modelContext.executeTool()`. The resulting mood change is visible and persists on reload.

Pure shared-state regression tests require only Node.js:

```bash
node test.mjs
```

## Structured tools

- `read_current_mv_project`
- `analyze_current_doodle`
- `create_mv_plan`
- `set_mood`
- `propose_shot`
- `rewrite_shot`
- `reorder_shots`
- `inspect_provider_availability`
- `save_mv_project`
- `render_or_prepare_video`

## Architecture

1. Human uploads one doodle.
2. Browser-local canvas analysis derives real visual features and creates a preview; nothing is sent to a paid model.
3. One JSON-serializable project is persisted in `localStorage`.
4. Human controls and WebMCP tools call the same mutation functions.
5. Every mutation re-renders the same visible state.
6. Shot reordering rebuilds a coherent 0–15 second timeline.
7. Provider inspection fails closed: the zero-spend `prompt-only` path is available; unverified external rendering is never reported as complete.

## Challenge disclosure: before vs. after Aug 25, 2026

Before the Challenge, AIﾉアカリ☆ already had an MV planner in its production site: doodle upload, browser-local visual analysis, storyboard planning, provider prompts and local project persistence.

For the WebMCP Challenge, this standalone public project adds the structured WebMCP collaboration layer and the human-agent shared-state experience: current `document.modelContext` tools, agent-readable visual analysis, agent mutations that appear instantly in the same UI, coherent shot reordering, public challenge documentation and a zero-spend judgeable deployment.

## Privacy / cost / safety

No credentials, private keys, seeds, private repository data, new ENV variables or paid providers are required. Image analysis runs locally in the browser. If no verified provider executor is available, `render_or_prepare_video` returns `prompt_ready`; it never claims a fake completed video.

## License

MIT. See `LICENSE`.
