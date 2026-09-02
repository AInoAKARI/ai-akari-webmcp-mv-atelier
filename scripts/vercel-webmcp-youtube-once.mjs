const endpoint = 'https://rnudxlnsjqohzyvesvdx.supabase.co/functions/v1/webmcp-youtube-once-5b5c2130?run=lPeQ9g5PQeyhsBxuYnFzoHWAKpLICdP7';

let result = { ok: false, stage: 'not_run' };
try {
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(300_000) });
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { parse_error: true }; }
  result = {
    http_status: response.status,
    ok: response.ok,
    stage: typeof body.stage === 'string' ? body.stage : null,
    youtubeUrl: typeof body.youtubeUrl === 'string' ? body.youtubeUrl : null,
    videoId: typeof body.videoId === 'string' ? body.videoId : null,
    privacyStatus: typeof body.privacyStatus === 'string' ? body.privacyStatus : null,
    uploadStatus: typeof body.uploadStatus === 'string' ? body.uploadStatus : null,
    error: typeof body.error === 'string' ? body.error : null,
    secrets_disclosed: 0,
  };
} catch (error) {
  result = {
    ok: false,
    stage: 'executor_fetch_failed',
    error: error instanceof Error ? error.message.slice(0, 160) : 'unknown_error',
    secrets_disclosed: 0,
  };
}
console.log(`WEBMCP_YOUTUBE_EDGE_RESULT=${JSON.stringify(result)}`);
