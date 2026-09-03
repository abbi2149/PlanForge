import test from 'node:test';
import assert from 'node:assert/strict';
import { operationDuration, topologicalOrder, validateRouting } from '../dist/index.js';

const routing = {
  id: 'R',
  itemId: 'FG',
  operations: [
    { id: 'A', workCenterId: 'WC1', setupMinutes: 5, runMinutesPerUnit: 2, yieldBasisPoints: 10_000, predecessors: [] },
    { id: 'B', workCenterId: 'WC2', setupMinutes: 3, runMinutesPerUnit: 4, yieldBasisPoints: 10_000, predecessors: ['A'] },
  ],
};

test('routing validates and topologically orders operations', () => {
  assert.equal(validateRouting(routing).ok, true);
  assert.deepEqual(topologicalOrder(routing), ['A', 'B']);
  assert.equal(operationDuration(routing.operations[1], 3), 15);
});

test('routing cycles are rejected', () => {
  const cyclic = { ...routing, operations: [{ ...routing.operations[0], predecessors: ['B'] }, routing.operations[1]] };
  assert.equal(validateRouting(cyclic).ok, false);
});
