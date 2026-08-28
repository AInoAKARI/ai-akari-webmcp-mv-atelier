# Native WebMCP machine acceptance — GREEN

Captured on 2026-08-28 JST against the public production alias with Google Chrome `151.0.7922.174` and WebMCP testing enabled.

## Result

- `document.modelContext.getTools()` surfaced all 10 expected tool IDs.
- The committed `demo/doodle.svg` was assigned to the real file input by the production demo loader and analyzed from pixels.
- The visible proof control called native `document.modelContext.executeTool()` with discovered `set_mood`.
- Native result was `ok: true`; the visible mood changed from `dream` / 夢 to `uneasy` / 不穏.
- Reload preserved the same project title, doodle preview, uneasy mood, shot order and 0–5 / 5–10 / 10–15 second timecodes.
- Japanese browser default, `?lang=ja`, and `?lang=en` all rendered correctly. Native discovery remained 10/10 in both locales.
- Production `app.js` returned HTTP 200 and its SHA-256 exactly matched the local committed file.

Structured values are in `native-acceptance.json`.

## Screenshots

- `japanese-ui-native-10.png`: Japanese default UI and native 10/10 discovery.
- `english-ui-native-10.png`: complete English judge route and native 10/10 discovery.
- `native-visible-mutation-ja.png`: visible timeline, native execution status and compact `executeTool` result after mood mutation.
- `persistence-after-reload-ja.png`: same visible timeline after reload.
