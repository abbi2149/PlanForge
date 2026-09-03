import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateSupply, fillRateBasisPoints, allocatedBySource } from '../dist/index.js';

test('allocation consumes prioritized supply deterministically', () => {
  const result = allocateSupply([{ itemId: 'A', quantity: 5, source: 'S1', priority: 1 }], [{ requestId: 'R1', itemId: 'A', quantity: 3, priority: 1 }]);
  assert.equal(result.lines[0].quantity, 3);
  assert.equal(fillRateBasisPoints({ requestId: 'R1', itemId: 'A', quantity: 3, priority: 1 }, result.lines), 10_000);
  assert.deepEqual(allocatedBySource(result.lines), { S1: 3 });
});
