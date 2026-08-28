# Fastest demo capture

All assets are local and zero-spend.

1. Enable `chrome://flags/#enable-webmcp-testing` in Chrome 149+ and relaunch.
2. Open the live app and click **Load demo doodle**. This places `demo/doodle.svg` into the real file input without requiring extension file permissions.
3. Keep the WebMCP `10/10` status line visible and click **Run native WebMCP proof**. Show the visible mood mutation, then reload to show persistence.
4. Record the single browser window with Windows Snipping Tool screen recording. Use `captions.srt` and `narration.wav`; keep the final cut below 3 minutes.

The proof button uses native `getTools()` and `executeTool()`; it does not call the application mutation function directly.

## Generated artifact

`webmcp-demo.mp4` is an 87-second, 1920×1080 H.264/AAC public-demo candidate with local English narration. It is generated from the committed native acceptance screenshots by `build-video.ps1`; no paid service is involved. `youtube-metadata.md` contains the prepared public title and description.
