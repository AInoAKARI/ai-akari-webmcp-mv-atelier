# OpenAI WebMCP Challenge checklist

## Machine-verifiable
- [x] Public code repository
- [x] Public live URL
- [x] OSS license file present and GitHub recognizes SPDX `MIT`
- [x] Current runtime uses `document.modelContext`
- [x] Structured tools operate on one shared project state
- [x] Visible doodle preview
- [x] Real local pixel analysis: palette / brightness / contrast / orientation / tone / movement
- [x] Agent-supplied mood/title are not overwritten by human DOM values
- [x] Reorder rebuilds coherent timecodes
- [x] Zero-spend / no-new-ENV / no-secret judge path
- [x] `SUBMISSION.md`
- [x] `DEMO_SCRIPT.md`
- [x] Node regression test
- [x] Native registration awaits all `registerTool()` promises before reporting discovery
- [x] Vercel production deployment is READY and live `app.js` bytes were rechecked after the implementation commit
- [x] Human→agent→human shared-edit E2E executed against the exact committed implementation with a `document.modelContext` contract shim; evidence recorded in Issue #1
- [x] Native Chrome 151: live `document.modelContext.getTools()` discovered all 10 tools
- [x] Native `executeTool(set_mood)` visibly mutated the shared UI and persisted after reload
- [x] Japanese browser default plus deterministic `?lang=ja` / `?lang=en` judge routes
- [x] Native acceptance JSON, Markdown and PNG evidence committed under `evidence/`

## Human gate — only after machine acceptance is green
- [ ] Confirm entrant eligibility and accept current Official Rules in Devpost
- [x] Generate and verify demo under 3 minutes (`demo/webmcp-demo.mp4`, 87 seconds)
- [ ] Publish demo publicly on YouTube
- [ ] Paste final submission wording / URLs into Devpost
- [ ] Final Submit before the official deadline

## Freeze rule
After the submission deadline, do not modify the submitted build/repository in a way that changes the judged entry unless the rules explicitly permit it.

## Kill condition
If native current WebMCP tool discovery and one visible shared-state mutation cannot be demonstrated on the live public URL without new spend, do not paper over it with screenshots or claims; fix the implementation before submission.
