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
  const palette = analysis.palette.join(', ');
  const orientationMove = analysis.movement;
  const base = [
    {
      id: 'shot-1',
      action: `The original doodle wakes without losing its imperfect outline. ${analysis.emotionalTone}.`,
      prompt: `${title}; opening shot; ${mood} mood; preserve the uploaded doodle identity; palette ${palette}; ${orientationMove}; gentle reveal`,
    },
    {
      id: 'shot-2',
      action: `The camera follows the doodle through motion suggested by its ${analysis.orientation} composition.`,
      prompt: `${title}; middle shot; ${mood} mood; brightness ${analysis.brightness}%; contrast ${analysis.contrast}%; palette ${palette}; ${orientationMove}; evolving hand-drawn forms`,
    },
    {
      id: 'shot-3',
      action: 'The changed scene returns to the first line so the human can recognize the same drawing at the end.',
      prompt: `${title}; closing shot; ${mood} mood; return to original doodle silhouette; palette ${palette}; emotional closure; no text overlay`,
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
      action: typeof input.action === 'string' && input.action ? input.action : shot.action,
      prompt: typeof input.prompt === 'string' && input.prompt ? input.prompt : shot.prompt,
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
