import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeObjectiveWeights, stableAcrossWeights } from '../dist/index.js';

test('objective weights normalize by absolute magnitude', () => {
  assert.deepEqual(normalizeObjectiveWeights({ makespan: 2, lateOrders: 1, warningCount: 1 }), { makespan: 0.5, lateOrders: 0.25, warningCount: 0.25 });
});

test('sensitivity stability uses score tolerance', () => {
  assert.equal(stableAcrossWeights([{ label: 'a', weights: { makespan: 1, lateOrders: 0, warningCount: 0 }, score: { planDigest: 'x', score: 10, components: {} } }, { label: 'b', weights: { makespan: 1, lateOrders: 0, warningCount: 0 }, score: { planDigest: 'x', score: 10.5, components: {} } }], 1), true);
});
