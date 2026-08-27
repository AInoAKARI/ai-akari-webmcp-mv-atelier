# AIﾉアカリ☆ MV Atelier — WebMCP Challenge

Live demo: https://ai-akari-webmcp-mv-atelier.vercel.app (deployment URL is recorded after publish).

Drop one doodle and create a 15-second storyboard. The browser UI and WebMCP agent tools mutate the same local project, so a human can continue immediately after an agent edit.

## Run

Open `index.html` locally or deploy the repository as a static site. In Chrome 150+ with WebMCP enabled (or a ChatGPT in-app browser that supports WebMCP), open the page, upload a doodle, then inspect `document.modelContext.getTools()` in DevTools. The page registers tools once per document and uses the same state the human UI renders.

## Tools

`read_current_mv_project`, `analyze_current_doodle`, `create_mv_plan`, `set_mood`, `propose_shot`, `rewrite_shot`, `reorder_shots`, `inspect_provider_availability`, `save_mv_project`, `render_or_prepare_video`.

No credentials are included. When a provider is not verified, the app returns `prompt_ready`; it never claims a fake completed video. The image is analyzed locally with canvas pixels (palette, brightness, contrast, orientation, motion and emotional tone), and a compressed preview is stored with the project.

## What changed for the Challenge

Before Aug 25, AIﾉアカリ☆ already had a prompt-only MV planner and a zero-spend fallback concept in its private production code. During this Challenge, this public slice adds the WebMCP document API, image-grounded local analysis, visible preview, and bidirectional human/agent shared editing. No private repository, secret, paid provider or new environment variable is required.

## License

MIT. See `LICENSE`.
