import { createPlan, rewriteProjectShot, reorderProjectShots } from './logic.mjs';

const KEY = 'akari-webmcp-mv-project-v2';
const $ = (id) => document.getElementById(id);
let project = readSavedProject();
let registeredTools = [];

function readSavedProject() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function projectId() {
  return globalThis.crypto?.randomUUID?.() || `mv-${Date.now()}`;
}

function saveProject(next, message = '') {
  project = next;
  localStorage.setItem(KEY, JSON.stringify(project));
  render();
  if (message) $('status').textContent = message;
  return clone(project);
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

// Extracted from the production PR #356 browser-local analyzer.
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
  const emotionalTone = brightness < 38
    ? 'dark, intimate and mysterious with small points of light'
    : brightness > 72
      ? 'bright, fragile and hopeful with airy negative space'
      : contrast > 52
        ? 'graphic, energetic and emotionally sharp'
        : 'soft, nostalgic and slightly dreamlike';
  const movement = orientation === 'portrait'
    ? 'vertical rise, falling particles and close subject movement'
    : orientation === 'landscape'
      ? 'sideways parallax, environmental drift and cinematic camera travel'
      : 'centered expansion, orbit and shape morphing';

  return {
    analysis: {
      palette: palette.length ? palette : ['#d9d9d9', '#7c7c7c', '#232323'],
      brightness,
      contrast,
      orientation,
      movement,
      emotionalTone,
    },
    dataUrl: canvas.toDataURL('image/jpeg', 0.84),
  };
}

function render() {
  $('projectTitle').textContent = project?.title || 'No project yet';
  $('shots').innerHTML = project ? project.shots.map((shot) => `
    <article class="shot" data-shot-id="${shot.id}">
      <b>${shot.id} · ${shot.start.toFixed(1)}–${shot.end.toFixed(1)}s</b>
      <p>${shot.action}</p>
      <small>${shot.prompt}</small>
    </article>`).join('') : '';

  if (!project) {
    $('analysis').textContent = 'Upload a doodle to begin.';
    $('preview').hidden = true;
    $('palette').innerHTML = '';
    $('metrics').textContent = '';
    return;
  }

  $('title').value = project.title;
  $('mood').value = project.mood;
  $('fileLabel').textContent = project.fileName;
  $('preview').src = project.sourceImageDataUrl;
  $('preview').hidden = false;
  $('analysis').textContent = `${project.analysis.emotionalTone}. ${project.analysis.movement}.`;
  $('metrics').textContent = `Brightness ${project.analysis.brightness}% · Contrast ${project.analysis.contrast}% · ${project.analysis.orientation}`;
  $('palette').innerHTML = project.analysis.palette.map((color) => `<i title="${color}" style="background:${color}"></i>`).join('');
}

function regenerate(overrides = {}, source = 'human') {
  if (!project) return { ok: false, reason: 'no_mv_project' };
  const next = createPlan(project, overrides);
  return { ok: true, project: saveProject(next, `${source} updated the same shared project.`) };
}

async function onFile(file) {
  $('status').textContent = 'Reading pixels locally…';
  const { analysis, dataUrl } = await analyzeImage(file);
  const now = new Date().toISOString();
  project = {
    id: projectId(),
    title: $('title').value.trim() || file.name.replace(/\.[^.]+$/, '') || 'Doodle MV',
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
  $('status').textContent = 'Doodle analyzed locally. Human and agent now share this exact project.';
}

$('file').onchange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try { await onFile(file); } catch (error) { $('status').textContent = `Analysis failed: ${error.message || error}`; }
};

$('create').onclick = () => {
  if (!project) return;
  regenerate({ title: $('title').value, mood: $('mood').value }, 'human');
};
$('save').onclick = () => project && saveProject(project, 'Saved to local project history.');
$('prepare').onclick = () => {
  $('status').textContent = project
    ? 'prompt_ready · no paid provider credential/executor verified · no fake video claimed'
    : 'Upload a doodle first.';
};

$('nativeProof').onclick = async () => {
  if (!project) {
    $('status').textContent = 'Upload a doodle before running the native mutation proof.';
    return;
  }
  try {
    const modelContext = document.modelContext;
    const discovered = await modelContext.getTools();
    const tool = discovered.find((item) => item.name === 'set_mood');
    if (!tool || !modelContext.executeTool) throw new Error('native_set_mood_unavailable');
    const mood = project.mood === 'uneasy' ? 'dream' : 'uneasy';
    await modelContext.executeTool(tool, JSON.stringify({ mood }));
    $('status').textContent = `Native WebMCP executed set_mood → ${mood}. The visible project and persisted state changed.`;
  } catch (error) {
    $('status').textContent = `Native WebMCP proof failed · ${error.message || error}`;
  }
};

function schema(properties, required = []) {
  return { type: 'object', properties, required, additionalProperties: false };
}

function buildTools() {
  return [
    {
      name: 'read_current_mv_project',
      title: 'Read current MV project',
      description: 'Read the exact MV project currently visible to the human.',
      inputSchema: schema({}),
      execute: () => project ? { ok: true, project: clone(project) } : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'analyze_current_doodle',
      title: 'Analyze current doodle',
      description: 'Return image-derived local palette, brightness, contrast, orientation, movement and tone.',
      inputSchema: schema({}),
      execute: () => project ? { ok: true, fileName: project.fileName, analysis: clone(project.analysis) } : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'create_mv_plan',
      title: 'Create MV plan',
      description: 'Regenerate the shared visible 15-second plan using agent-supplied title/mood without DOM overwrite.',
      inputSchema: schema({ title: { type: 'string' }, mood: { type: 'string' } }),
      execute: (input = {}) => regenerate(input, 'agent'),
    },
    {
      name: 'set_mood',
      title: 'Set mood',
      description: 'Change mood on the same human-visible project.',
      inputSchema: schema({ mood: { type: 'string' } }, ['mood']),
      execute: (input = {}) => regenerate({ mood: input.mood }, 'agent'),
    },
    {
      name: 'propose_shot',
      title: 'Propose a shot',
      description: 'Read one current shot for human review.',
      inputSchema: schema({ shotId: { type: 'string' } }, ['shotId']),
      execute: (input = {}) => {
        const shot = project?.shots.find((item) => item.id === input.shotId);
        return shot ? { ok: true, shot: clone(shot) } : { ok: false, reason: 'shot_not_found' };
      },
    },
    {
      name: 'rewrite_shot',
      title: 'Rewrite a shot',
      description: 'Rewrite one shot in the same visible project.',
      inputSchema: schema({ shotId: { type: 'string' }, action: { type: 'string' }, prompt: { type: 'string' } }, ['shotId']),
      execute: (input = {}) => {
        try { return { ok: true, project: saveProject(rewriteProjectShot(project, input), 'Agent rewrote a visible shot.') }; }
        catch (error) { return { ok: false, reason: error.message }; }
      },
    },
    {
      name: 'reorder_shots',
      title: 'Reorder shots',
      description: 'Reorder all shots and rebuild coherent start/end timecodes.',
      inputSchema: schema({ orderedIds: { type: 'array', items: { type: 'string' } } }, ['orderedIds']),
      execute: (input = {}) => {
        try { return { ok: true, project: saveProject(reorderProjectShots(project, input.orderedIds || []), 'Agent reordered shots and rebuilt timecodes.') }; }
        catch (error) { return { ok: false, reason: error.message }; }
      },
    },
    {
      name: 'inspect_provider_availability',
      title: 'Inspect provider availability',
      description: 'Return truthful zero-spend provider state.',
      inputSchema: schema({}),
      execute: () => ({ ok: true, providers: [
        { provider: 'prompt-only', enabled: true, mode: 'prompt-only', reason: 'safe deterministic fallback' },
        { provider: 'external', enabled: false, mode: 'prompt-only', reason: 'credential/executor not verified' },
      ] }),
    },
    {
      name: 'save_mv_project',
      title: 'Save MV project',
      description: 'Persist the exact shared project to localStorage.',
      inputSchema: schema({}),
      execute: () => project ? (saveProject(project), { ok: true, projectId: project.id, storage: 'localStorage' }) : { ok: false, reason: 'no_mv_project' },
    },
    {
      name: 'render_or_prepare_video',
      title: 'Render or prepare video',
      description: 'Prepare prompts without claiming unverified paid rendering.',
      inputSchema: schema({}),
      execute: () => project ? { ok: true, status: 'prompt_ready', projectId: project.id, reason: 'No live paid provider credential/executor verified.' } : { ok: false, reason: 'no_mv_project' },
    },
  ];
}

async function registerWebMcp() {
  const modelContext = document.modelContext;
  if (!modelContext?.registerTool) {
    $('webmcp').textContent = 'WebMCP unavailable in this browser; the human editor still works locally.';
    return;
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
    $('nativeProof').hidden = !modelContext.executeTool || !names.includes('set_mood');
    $('webmcp').textContent = `WebMCP ready · ${names.length}/${registeredTools.length} native tools discovered · ${names.join(', ')}`;
    return discovered;
  })();
  return globalThis.__akariWebMcpRegistration;
}

// Test/evidence surface: the real tool objects, not a second implementation.
globalThis.__akariMv = {
  getProject: () => clone(project),
  getTools: () => registeredTools.length ? registeredTools : buildTools(),
  analyzeImage,
};

render();
registerWebMcp().catch((error) => {
  $('webmcp').textContent = `WebMCP registration failed · ${error.message || error}`;
  console.error(error);
});
