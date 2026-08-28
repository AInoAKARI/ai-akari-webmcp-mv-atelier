import { createPlan, rewriteProjectShot, reorderProjectShots } from './logic.mjs';
import { resolveLocale, translate } from './i18n.mjs';

const PROJECT_KEY = 'akari-webmcp-mv-project-v2';
const LOCALE_KEY = 'akari-ui-locale-v1';
const $ = (id) => document.getElementById(id);
let locale = resolveLocale({
  search: location.search,
  stored: localStorage.getItem(LOCALE_KEY),
  languages: navigator.languages || [navigator.language],
});
let project = normalizeProject(readSavedProject());
let registeredTools = [];

const tr = (token, params = {}) => translate(token, locale, params);

function readSavedProject() {
  try { return JSON.parse(localStorage.getItem(PROJECT_KEY) || 'null'); } catch { return null; }
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function projectId() {
  return globalThis.crypto?.randomUUID?.() || `mv-${Date.now()}`;
}

function inferTone(analysis = {}) {
  if (analysis.tone) return analysis.tone;
  if (analysis.brightness < 38) return 'dark';
  if (analysis.brightness > 72) return 'bright';
  if (analysis.contrast > 52) return 'graphic';
  return 'soft';
}

function normalizeProject(value) {
  if (!value) return null;
  return {
    ...value,
    analysis: {
      ...value.analysis,
      tone: inferTone(value.analysis),
      movement: ['portrait', 'landscape', 'square'].includes(value.analysis?.movement)
        ? value.analysis.movement
        : value.analysis?.orientation || 'square',
    },
  };
}

function moodLabel(value) {
  return tr(`MOOD_${String(value || 'dream').toUpperCase()}`);
}

function orientationLabel(value) {
  return tr(`ORIENTATION_${String(value || 'square').toUpperCase()}`);
}

function toneLabel(value) {
  return tr(`TONE_${String(value || 'soft').toUpperCase()}`);
}

function movementLabel(value) {
  return tr(`MOVEMENT_${String(value || 'square').toUpperCase()}`);
}

function localizeParams(params = {}) {
  return {
    ...params,
    mood: moodLabel(params.mood),
    orientation: orientationLabel(params.orientation),
    tone: toneLabel(params.tone),
    movement: movementLabel(params.movement),
  };
}

function contentText(content) {
  if (typeof content === 'string') return content;
  if (content?.text) return content.text;
  if (content?.token) return tr(content.token, localizeParams(content.params));
  return '';
}

function visibleProject() {
  if (!project) return null;
  const result = clone(project);
  result.analysis.toneLabel = toneLabel(project.analysis.tone);
  result.analysis.movementLabel = movementLabel(project.analysis.movement);
  result.analysis.orientationLabel = orientationLabel(project.analysis.orientation);
  result.shots = project.shots.map((shot) => ({
    ...clone(shot),
    action: contentText(shot.action),
    prompt: contentText(shot.prompt),
  }));
  return result;
}

function setStatus(token, params = {}) {
  $('status').textContent = tr(token, params);
}

function saveProject(next, messageToken = '', params = {}) {
  project = normalizeProject(next);
  localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  render();
  if (messageToken) setStatus(messageToken, params);
  return visibleProject();
}

function applyTranslations() {
  document.documentElement.lang = locale;
  document.title = `AIﾉアカリ☆ MV Atelier · ${tr('RELATIONSHIP_CORE')}`;
  document.querySelector('meta[name="description"]').content = tr('APP_DESCRIPTION');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = tr(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', tr(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
    element.setAttribute('alt', tr(element.dataset.i18nAlt));
  });
  $('language').value = locale;
  if (!project) $('title').value = tr('DEFAULT_TITLE');
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('file_read_failed'));
    reader.readAsDataURL(file);
  });
}

function hex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

async function analyzeImage(file) {
  const original = await readDataUrl(file);
  const img = new Image();
  img.src = original;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('image_load_failed'));
  });

  const maxSide = 960;
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('canvas_unavailable');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const pixels = ctx.getImageData(0, 0, width, height).data;
  const buckets = new Map();
  const luminances = [];
  const stride = Math.max(4, Math.floor(Math.sqrt((width * height) / 12000))) * 4;
  for (let i = 0; i < pixels.length; i += stride) {
    if (pixels[i + 3] < 32) continue;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    luminances.push(lum);
    if (lum > 245) continue;
    const key = hex(Math.round(r / 51) * 51, Math.round(g / 51) * 51, Math.round(b / 51) * 51);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const avg = luminances.length ? luminances.reduce((a, b) => a + b, 0) / luminances.length : 128;
  const variance = luminances.length ? luminances.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / luminances.length : 0;
  const brightness = Math.round((avg / 255) * 100);
  const contrast = Math.min(100, Math.round((Math.sqrt(variance) / 96) * 100));
  const palette = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([color]) => color);
  const ratio = width / height;
  const orientation = ratio > 1.12 ? 'landscape' : ratio < 0.88 ? 'portrait' : 'square';
  const tone = brightness < 38 ? 'dark' : brightness > 72 ? 'bright' : contrast > 52 ? 'graphic' : 'soft';

  return {
    analysis: {
      palette: palette.length ? palette : ['#d9d9d9', '#7c7c7c', '#232323'],
      brightness,
      contrast,
      orientation,
      movement: orientation,
      tone,
    },
    dataUrl: canvas.toDataURL('image/jpeg', 0.84),
  };
}

function render() {
  $('projectTitle').textContent = project?.title || tr('NO_PROJECT');
  $('shots').replaceChildren();
  if (project) {
    project.shots.forEach((shot) => {
      const article = document.createElement('article');
      article.className = 'shot';
      article.dataset.shotId = shot.id;
      const heading = document.createElement('b');
      heading.textContent = `${shot.id} · ${shot.start.toFixed(1)}–${shot.end.toFixed(1)}s`;
      const action = document.createElement('p');
      action.textContent = contentText(shot.action);
      const prompt = document.createElement('small');
      prompt.textContent = contentText(shot.prompt);
      article.append(heading, action, prompt);
      $('shots').append(article);
    });
  }

  if (!project) {
    $('analysis').textContent = tr('UPLOAD_BEGIN');
    $('preview').hidden = true;
    $('palette').replaceChildren();
    $('metrics').textContent = '';
    return;
  }

  $('title').value = project.title;
  $('mood').value = project.mood;
  $('fileLabel').textContent = project.fileName;
  $('preview').src = project.sourceImageDataUrl;
  $('preview').hidden = false;
  $('analysis').textContent = tr('ANALYSIS_SUMMARY', {
    tone: toneLabel(project.analysis.tone),
    movement: movementLabel(project.analysis.movement),
  });
  $('metrics').textContent = tr('METRICS', {
    brightness: project.analysis.brightness,
    contrast: project.analysis.contrast,
    orientation: orientationLabel(project.analysis.orientation),
  });
  $('palette').replaceChildren();
  project.analysis.palette.forEach((color) => {
    const item = document.createElement('i');
    item.title = color;
    item.style.backgroundColor = color;
    $('palette').append(item);
  });
}

function regenerate(overrides = {}, source = 'human') {
  if (!project) return { ok: false, reason: 'no_mv_project' };
  const next = createPlan(project, overrides);
  return { ok: true, project: saveProject(next, 'STATUS_UPDATED', { source: tr(source === 'agent' ? 'SOURCE_AGENT' : 'SOURCE_HUMAN') }) };
}

async function onFile(file) {
  setStatus('STATUS_READING_PIXELS');
  const { analysis, dataUrl } = await analyzeImage(file);
  const now = new Date().toISOString();
  project = {
    id: projectId(),
    title: $('title').value.trim() || file.name.replace(/\.[^.]+$/, '') || tr('DEFAULT_TITLE'),
    mood: $('mood').value,
    fileName: file.name,
    sourceImageDataUrl: dataUrl,
    analysis,
    shots: [],
    createdAt: now,
    updatedAt: now,
  };
  saveProject(project);
  regenerate({}, 'human');
  setStatus('STATUS_ANALYZED');
}

async function handleFile(file) {
  if (!file) return;
  try { await onFile(file); } catch (error) { setStatus('STATUS_ANALYSIS_FAILED', { error: error.message || error }); }
}

async function loadDemoDoodle() {
  try {
    const response = await fetch(new URL('./demo/doodle.svg', location.href));
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const file = new File([await response.blob()], 'doodle.svg', { type: 'image/svg+xml' });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    $('file').files = transfer.files;
    $('file').dispatchEvent(new Event('change', { bubbles: true }));
  } catch (error) {
    setStatus('STATUS_DEMO_FAILED', { error: error.message || error });
  }
}

$('file').onchange = (event) => handleFile(event.target.files?.[0]);
$('loadDemo').onclick = loadDemoDoodle;
$('create').onclick = () => project && regenerate({ title: $('title').value, mood: $('mood').value }, 'human');
$('save').onclick = () => project && saveProject(project, 'STATUS_SAVED');
$('prepare').onclick = () => setStatus(project ? 'STATUS_PROMPT_READY' : 'STATUS_UPLOAD_FIRST');
$('language').onchange = () => {
  localStorage.setItem(LOCALE_KEY, $('language').value);
  const url = new URL(location.href);
  url.searchParams.set('lang', $('language').value);
  location.assign(url);
};

async function runNativeProof() {
  if (!project) {
    setStatus('STATUS_UPLOAD_FIRST');
    return null;
  }
  try {
    const modelContext = document.modelContext;
    const discovered = await modelContext.getTools();
    const tool = discovered.find((item) => item.name === 'set_mood');
    if (!tool || !modelContext.executeTool) throw new Error('native_set_mood_unavailable');
    const mood = project.mood === 'uneasy' ? 'dream' : 'uneasy';
    const result = await modelContext.executeTool(tool, JSON.stringify({ mood }));
    let parsedResult = result;
    if (typeof result === 'string') {
      try { parsedResult = JSON.parse(result); } catch { parsedResult = { raw: result }; }
    }
    const resultProject = parsedResult?.project || visibleProject();
    const resultSummary = {
      ok: parsedResult?.ok === true,
      projectId: resultProject?.id,
      mood: resultProject?.mood,
      shotOrder: resultProject?.shots?.map((shot) => shot.id),
      timecodes: resultProject?.shots?.map((shot) => [shot.start, shot.end]),
    };
    globalThis.__akariLastNativeProof = {
      tool: tool.name,
      mood,
      result: resultSummary,
      project: visibleProject(),
      at: new Date().toISOString(),
    };
    $('nativeResult').textContent = tr('NATIVE_RESULT_OUTPUT', { tool: tool.name, result: JSON.stringify(resultSummary) });
    $('nativeResult').hidden = false;
    setStatus('STATUS_NATIVE_RESULT', { mood: moodLabel(mood) });
    return globalThis.__akariLastNativeProof;
  } catch (error) {
    setStatus('STATUS_NATIVE_FAILED', { error: error.message || error });
    return null;
  }
}

$('nativeProof').onclick = runNativeProof;

function schema(properties, required = []) {
  return { type: 'object', properties, required, additionalProperties: false };
}

function buildTools() {
  return [
    {
      name: 'read_current_mv_project', title: tr('TOOL_READ_TITLE'), description: tr('TOOL_READ_DESC'), inputSchema: schema({}),
      execute: () => project ? { ok: true, project: visibleProject() } : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'analyze_current_doodle', title: tr('TOOL_ANALYZE_TITLE'), description: tr('TOOL_ANALYZE_DESC'), inputSchema: schema({}),
      execute: () => project ? { ok: true, fileName: project.fileName, analysis: visibleProject().analysis } : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'create_mv_plan', title: tr('TOOL_CREATE_TITLE'), description: tr('TOOL_CREATE_DESC'),
      inputSchema: schema({ title: { type: 'string' }, mood: { type: 'string' } }), execute: (input = {}) => regenerate(input, 'agent'),
    },
    {
      name: 'set_mood', title: tr('TOOL_MOOD_TITLE'), description: tr('TOOL_MOOD_DESC'),
      inputSchema: schema({ mood: { type: 'string' } }, ['mood']), execute: (input = {}) => regenerate({ mood: input.mood }, 'agent'),
    },
    {
      name: 'propose_shot', title: tr('TOOL_PROPOSE_TITLE'), description: tr('TOOL_PROPOSE_DESC'),
      inputSchema: schema({ shotId: { type: 'string' } }, ['shotId']),
      execute: (input = {}) => {
        const shot = visibleProject()?.shots.find((item) => item.id === input.shotId);
        return shot ? { ok: true, shot } : { ok: false, reason: 'shot_not_found' };
      },
    },
    {
      name: 'rewrite_shot', title: tr('TOOL_REWRITE_TITLE'), description: tr('TOOL_REWRITE_DESC'),
      inputSchema: schema({ shotId: { type: 'string' }, action: { type: 'string' }, prompt: { type: 'string' } }, ['shotId']),
      execute: (input = {}) => {
        try { return { ok: true, project: saveProject(rewriteProjectShot(project, input), 'STATUS_AGENT_REWROTE') }; }
        catch (error) { return { ok: false, reason: error.message }; }
      },
    },
    {
      name: 'reorder_shots', title: tr('TOOL_REORDER_TITLE'), description: tr('TOOL_REORDER_DESC'),
      inputSchema: schema({ orderedIds: { type: 'array', items: { type: 'string' } } }, ['orderedIds']),
      execute: (input = {}) => {
        try { return { ok: true, project: saveProject(reorderProjectShots(project, input.orderedIds || []), 'STATUS_AGENT_REORDERED') }; }
        catch (error) { return { ok: false, reason: error.message }; }
      },
    },
    {
      name: 'inspect_provider_availability', title: tr('TOOL_PROVIDER_TITLE'), description: tr('TOOL_PROVIDER_DESC'), inputSchema: schema({}),
      execute: () => ({ ok: true, providers: [
        { provider: 'prompt-only', enabled: true, mode: 'prompt-only', reason: 'safe_deterministic_fallback' },
        { provider: 'external', enabled: false, mode: 'prompt-only', reason: 'credential_executor_not_verified' },
      ] }),
    },
    {
      name: 'save_mv_project', title: tr('TOOL_SAVE_TITLE'), description: tr('TOOL_SAVE_DESC'), inputSchema: schema({}),
      execute: () => project ? (saveProject(project), { ok: true, projectId: project.id, storage: 'localStorage' }) : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'render_or_prepare_video', title: tr('TOOL_RENDER_TITLE'), description: tr('TOOL_RENDER_DESC'), inputSchema: schema({}),
      execute: () => project ? { ok: true, status: 'prompt_ready', projectId: project.id, reason: 'executor_not_verified' } : { ok: false, reason: 'no_mv_project' },
    },
  ];
}

function renderToolList(discovered) {
  $('toolList').replaceChildren();
  discovered.forEach((tool) => {
    const definition = registeredTools.find((item) => item.name === tool.name);
    const item = document.createElement('li');
    const code = document.createElement('code');
    code.textContent = tool.name;
    item.append(code, document.createTextNode(` — ${definition?.description || tool.description || ''}`));
    $('toolList').append(item);
  });
  $('toolDetails').hidden = false;
}

async function registerWebMcp() {
  const modelContext = document.modelContext;
  if (!modelContext?.registerTool) {
    $('webmcp').textContent = tr('WEBMCP_UNAVAILABLE');
    return [];
  }
  if (globalThis.__akariWebMcpRegistration) return globalThis.__akariWebMcpRegistration;
  registeredTools = buildTools();
  globalThis.__akariWebMcpTools = registeredTools;
  globalThis.__akariWebMcpRegistration = (async () => {
    await Promise.all(registeredTools.map((tool) => modelContext.registerTool(tool)));
    const discovered = modelContext.getTools ? await modelContext.getTools() : [];
    const names = discovered.map((tool) => tool.name);
    globalThis.__akariWebMcpRegistered = true;
    globalThis.__akariWebMcpDiscoveredTools = discovered;
    globalThis.__akariDiscoveryEvidence = { count: names.length, names, locale, url: location.href, at: new Date().toISOString() };
    $('nativeProof').hidden = !modelContext.executeTool || !names.includes('set_mood');
    $('webmcp').textContent = tr('WEBMCP_READY', { count: names.length, expected: registeredTools.length });
    renderToolList(discovered);
    return discovered;
  })();
  return globalThis.__akariWebMcpRegistration;
}

globalThis.__akariMv = { getProject: visibleProject, getTools: () => registeredTools.length ? registeredTools : buildTools(), analyzeImage };
globalThis.__akariAcceptance = {
  snapshot: () => ({ locale, discovery: clone(globalThis.__akariDiscoveryEvidence), proof: clone(globalThis.__akariLastNativeProof), project: visibleProject() }),
  loadDemoDoodle,
  runNativeProof,
};

applyTranslations();
render();
registerWebMcp().catch((error) => {
  $('webmcp').textContent = tr('WEBMCP_FAILED', { error: error.message || error });
  console.error(error);
});
