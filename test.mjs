import assert from 'node:assert/strict';
import { createPlan, rewriteProjectShot, reorderProjectShots } from './logic.mjs';

const project = {
  id: 'p1', title: 'Human title', mood: 'dream',
  analysis: { palette: ['#112233','#445566'], brightness: 61, contrast: 48, orientation: 'portrait', movement: 'vertical rise', emotionalTone: 'soft and hopeful' },
  shots: [], createdAt: '2026-08-28T00:00:00Z', updatedAt: '2026-08-28T00:00:00Z'
};

const agentPlan = createPlan(project, { title: 'Agent title', mood: 'uneasy' });
assert.equal(agentPlan.title, 'Agent title');
assert.equal(agentPlan.mood, 'uneasy');
assert.deepEqual(agentPlan.shots.map(({start,end}) => [start,end]), [[0,5],[5,10],[10,15]]);
assert.match(agentPlan.shots[0].prompt, /#112233/);

const rewritten = rewriteProjectShot(agentPlan, { shotId: 'shot-2', action: 'Agent-visible rewrite' });
assert.equal(rewritten.shots[1].action, 'Agent-visible rewrite');
assert.notEqual(rewritten.shots[0].action, 'Agent-visible rewrite');

const reordered = reorderProjectShots(rewritten, ['shot-3','shot-1','shot-2']);
assert.deepEqual(reordered.shots.map((s) => s.id), ['shot-3','shot-1','shot-2']);
assert.deepEqual(reordered.shots.map(({start,end}) => [start,end]), [[0,5],[5,10],[10,15]]);

console.log('PASS shared-state plan/rewrite/reorder/timecode tests');
