# Human-browser automation lane

This lane reuses the real signed-in Google Chrome through the ChatGPT browser extension. It is the default for WebMCP acceptance and later authenticated Devpost or YouTube work; no cookie, token, profile file or secret is copied.

## Stable app contract

- live: `https://ai-akari-webmcp-mv-atelier.vercel.app`
- Japanese: `?lang=ja`
- English: `?lang=en`
- demo fixture: `[data-testid="load-demo-doodle"]`
- native discovery status: `[data-testid="webmcp-status"]`
- discovered IDs: `[data-testid="native-tool-list"]`
- native mutation: `[data-testid="native-webmcp-proof"]`
- visible mood: `[data-testid="mood-select"]`
- project: `[data-testid="project-title"]`
- timeline: `[data-testid="shots"]`
- operation result: `[data-testid="operation-status"]`

The demo loader fetches the committed SVG, assigns it to the real file input through `DataTransfer`, and dispatches the normal `change` event. It avoids browser-extension file permission dependencies without bypassing authentication or browser security.

## In-page evidence surface

`globalThis.__akariAcceptance.snapshot()` returns only application-owned acceptance state: locale, native discovery evidence, last native proof and the visible project. `loadDemoDoodle()` and `runNativeProof()` use the same handlers as the visible buttons.

## Reuse boundary

For Devpost and YouTube, keep using the same Chrome extension session and claim the already-open authenticated tab. Never inspect cookies, profile storage, passwords or tokens. Stop only for login, CAPTCHA, identity confirmation, rules consent or final irreversible submission when the current session cannot proceed.
