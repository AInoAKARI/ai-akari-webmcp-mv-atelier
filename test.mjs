import assert from 'node:assert/strict';
import { createPlan, rewriteProjectShot, reorderProjectShots } from './logic.mjs';
import { assertLocaleParity, resolveLocale, translate } from './i18n.mjs';

const project = {
  id: 'p1', title: 'Human title', mood: 'dream',
  analysis: { palette: ['#112233','#445566'], brightness: 61, contrast: 48, orientation: 'portrait', movement: 'portrait', tone: 'soft' },
  shots: [], createdAt: '2026-08-28T00:00:00Z', updatedAt: '2026-08-28T00:00:00Z'
};

const agentPlan = createPlan(project, { title: 'Agent title', mood: 'uneasy' });
assert.equal(agentPlan.title, 'Agent title');
assert.equal(agentPlan.mood, 'uneasy');
assert.deepEqual(agentPlan.shots.map(({start,end}) => [start,end]), [[0,5],[5,10],[10,15]]);
assert.equal(agentPlan.shots[0].prompt.token, 'SHOT_1_PROMPT');
assert.match(agentPlan.shots[0].prompt.params.palette, /#112233/);

const rewritten = rewriteProjectShot(agentPlan, { shotId: 'shot-2', action: 'Agent-visible rewrite' });
assert.equal(rewritten.shots[1].action.text, 'Agent-visible rewrite');
assert.notEqual(rewritten.shots[0].action.text, 'Agent-visible rewrite');

const reordered = reorderProjectShots(rewritten, ['shot-3','shot-1','shot-2']);
assert.deepEqual(reordered.shots.map((s) => s.id), ['shot-3','shot-1','shot-2']);
assert.deepEqual(reordered.shots.map(({start,end}) => [start,end]), [[0,5],[5,10],[10,15]]);

assert.equal(resolveLocale({search:'?lang=ja',stored:'en',languages:['en-US']}), 'ja');
assert.equal(resolveLocale({stored:'ja',languages:['en-US']}), 'ja');
assert.equal(resolveLocale({languages:['ja-JP','en-US']}), 'ja');
assert.equal(translate('RELATIONSHIP_CORE','ja'), 'あなたは私、私はあなた。');
assert.equal(assertLocaleParity().length, 0);

console.log('PASS shared-state plan/rewrite/reorder/timecode tests');
