# Public demo script (under 3 minutes)

**0:00–0:20 — Human start**  Open the live URL. Say: “This is AIﾉアカリ☆ MV Atelier. I drop one doodle; the doodle is the source of truth.” Upload a simple sketch and show the visible preview.

**0:20–0:45 — Grounded analysis**  Point to palette, brightness, contrast and orientation. Click **Create 15s plan** and show three time-coded shots whose prompts contain the real image features.

**0:45–1:25 — Agent joins**  In a WebMCP-capable browser, discover `document.modelContext.getTools()`. Ask the agent to call `read_current_mv_project`, then `set_mood` with `uneasy` and `rewrite_shot` for `shot-2`. Keep the human screen visible while the cards change.

**1:25–1:55 — Human continues**  Change the title or mood in the UI, then ask the agent to call `reorder_shots` with all three IDs. Show that order changes and timecodes rebuild to 0–5, 5–10, 10–15 seconds.

**1:55–2:20 — Persistence and safety**  Call `save_mv_project`, reload, and show the same preview, metrics and shots. Call `inspect_provider_availability` and `render_or_prepare_video`; show truthful `prompt_ready` because no paid provider is configured.

**2:20–2:40 — Close**  “The human and agent are editing one artwork, not passing prompts between disconnected apps. You are me, I am you.” No copyrighted music is required.
