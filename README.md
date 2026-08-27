# AIﾉアカリ☆ MV Atelier — WebMCP Challenge

Live demo: https://ai-akari-webmcp-mv-atelier.vercel.app (deployment URL is recorded after publish).

Drop one doodle and create a 15-second storyboard. The browser UI and WebMCP agent tools mutate the same local project, so a human can continue immediately after an agent edit.

## Run

Open `index.html` locally or deploy the repository as a static site. In a WebMCP-capable Chrome/ChatGPT browser, discover the tools from `navigator.modelContext`.

## Tools

`read_current_mv_project`, `analyze_current_doodle`, `create_mv_plan`, `set_mood`, `propose_shot`, `rewrite_shot`, `reorder_shots`, `inspect_provider_availability`, `save_mv_project`, `render_or_prepare_video`.

No credentials are included. When a provider is not verified, the app returns `prompt_ready`; it never claims a fake completed video.
