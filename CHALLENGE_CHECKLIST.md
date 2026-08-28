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
- [x] 87-second H.264/AAC demo generated and publicly reachable from production
- [x] ChatGPT Chrome extension file-URL access enabled by the user on 2026-08-28; this is no longer a human gate
- [x] Devpost machine-fillable payload committed as `automation/DEVPOST_AUTOFILL.json`

## Automatic submission lane — do not return these as human copy/paste work
- [ ] Publish the existing demo publicly on YouTube through the first browser-capable authenticated executor
- [ ] Capture and persist the public YouTube URL
- [ ] Fill/save all safe machine-fillable Devpost fields from `automation/DEVPOST_AUTOFILL.json`
- [ ] Update Issue #1 and this checklist with the externally verified URLs/state

## Truly unavoidable human gate only
- [ ] Devpost login / identity confirmation only if the authenticated executor cannot reuse an existing valid session
- [ ] Confirm entrant eligibility and accept the current Official Rules where Devpost requires the entrant personally to consent
- [ ] CAPTCHA, if presented
- [ ] Final irreversible Submit only if the current surface requires the entrant's explicit final action

Do not ask the user to paste submission wording, repo URLs, demo URLs, Codex prompts, or file paths. Browser interaction alone is not a human gate.

## Freeze rule
After the submission deadline, do not modify the submitted build/repository in a way that changes the judged entry unless the rules explicitly permit it.

## Kill condition
If native current WebMCP tool discovery and one visible shared-state mutation cannot be demonstrated on the live public URL without new spend, do not paper over it with screenshots or claims; fix the implementation before submission.
