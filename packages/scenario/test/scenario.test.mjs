import test from 'node:test';
import assert from 'node:assert/strict';
import { applyScenarioPatches, buildScenarioMatrix, scenarioDifferenceCounts } from '../dist/index.js';

test('scenario patches clone instead of mutating the base', () => {
  const base = { capacity: { units: 2 } };
  const result = applyScenarioPatches(base, [{ path: 'capacity.units', value: 3 }]);
  assert.equal(result.ok, true);
  assert.equal(base.capacity.units, 2);
  assert.equal(result.value.capacity.units, 3);
});

test('scenario matrix records differences deterministically', () => {
  const matrix = buildScenarioMatrix({ value: 1 }, [{ id: 'S1', name: 'up', patches: [{ path: 'value', value: 2 }] }]);
  assert.equal(matrix.ok, true);
  assert.deepEqual(scenarioDifferenceCounts(matrix.value), { S1: 1 });
});
