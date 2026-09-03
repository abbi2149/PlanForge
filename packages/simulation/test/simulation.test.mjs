import test from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation, runSimulationEnsemble, summarizeSimulationEnsemble } from '../dist/index.js';
import { simplePlan } from '../../../test/fixtures.mjs';

const orders = [{ id: 'ORD-1', itemId: 'FG', quantity: 2, releaseMinute: 0, dueMinute: 100, priority: 1 }];

test('simulation applies deterministic delays', () => {
  const result = runSimulation({ plan: simplePlan(), orders, delayRules: [{ workCenterId: 'CUT-1', everyNthOperation: 1, delayMinutes: 5 }] });
  assert.equal(result.operations[0].simulatedEnd, 25);
});

test('ensemble summary aggregates makespan and lateness', () => {
  const variants = runSimulationEnsemble([{ name: 'base', input: { plan: simplePlan(), orders } }, { name: 'delay', input: { plan: simplePlan(), orders, delayRules: [{ workCenterId: 'CUT-1', everyNthOperation: 1, delayMinutes: 5 }] } }]);
  const summary = summarizeSimulationEnsemble(variants);
  assert.equal(summary.variants, 2);
  assert.ok(summary.maximumMakespan >= summary.minimumMakespan);
});
