export const TOTAL_SECONDS = 15;

export function rebuildTimecodes(shots, totalSeconds = TOTAL_SECONDS) {
  if (!Array.isArray(shots) || shots.length === 0) return [];
  const slice = totalSeconds / shots.length;
  return shots.map((shot, index) => ({
    ...shot,
    start: Number((index * slice).toFixed(1)),
    end: Number((index === shots.length - 1 ? totalSeconds : (index + 1) * slice).toFixed(1)),
  }));
}

export function createPlan(project, overrides = {}) {
  if (!project) throw new Error('no_mv_project');
  const title = typeof overrides.title === 'string' && overrides.title.trim() ? overrides.title.trim() : project.title;
  const mood = typeof overrides.mood === 'string' && overrides.mood.trim() ? overrides.mood.trim() : project.mood;
  const analysis = project.analysis;
  const params = {
    title,
    mood,
    palette: analysis.palette.join(', '),
    orientation: analysis.orientation,
    brightness: analysis.brightness,
    contrast: analysis.contrast,
    tone: analysis.tone,
    movement: analysis.movement,
  };
  const base = [
    {
      id: 'shot-1',
      action: { token: 'SHOT_1_ACTION', params },
      prompt: { token: 'SHOT_1_PROMPT', params },
    },
    {
      id: 'shot-2',
      action: { token: 'SHOT_2_ACTION', params },
      prompt: { token: 'SHOT_2_PROMPT', params },
    },
    {
      id: 'shot-3',
      action: { token: 'SHOT_3_ACTION', params },
      prompt: { token: 'SHOT_3_PROMPT', params },
    },
  ];
  return {
    ...project,
    title,
    mood,
    shots: rebuildTimecodes(base, TOTAL_SECONDS),
    updatedAt: new Date().toISOString(),
  };
}

export function rewriteProjectShot(project, input = {}) {
  if (!project) throw new Error('no_mv_project');
  const shotId = String(input.shotId || '');
  if (!project.shots.some((shot) => shot.id === shotId)) throw new Error('shot_not_found');
  return {
    ...project,
    shots: project.shots.map((shot) => shot.id === shotId ? {
      ...shot,
      action: typeof input.action === 'string' && input.action ? { text: input.action } : shot.action,
      prompt: typeof input.prompt === 'string' && input.prompt ? { text: input.prompt } : shot.prompt,
    } : shot),
    updatedAt: new Date().toISOString(),
  };
}

export function reorderProjectShots(project, orderedIds = []) {
  if (!project) throw new Error('no_mv_project');
  const ids = orderedIds.map(String);
  if (
    ids.length !== project.shots.length ||
    new Set(ids).size !== ids.length ||
    ids.some((id) => !project.shots.some((shot) => shot.id === id))
  ) throw new Error('ordered_ids_must_match_all_shots');
  const byId = new Map(project.shots.map((shot) => [shot.id, shot]));
  return {
    ...project,
    shots: rebuildTimecodes(ids.map((id) => byId.get(id)), TOTAL_SECONDS),
    updatedAt: new Date().toISOString(),
  };
}
