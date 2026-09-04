import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeFactory,
  compileFactory,
  compileFactoryPortfolio,
  explainFactoryDelays,
  explainOrderDelay,
  validateFactoryModel,
} from '../dist/index.js';
import { factoryFixture } from '../../../test/fixtures.mjs';

test('factory model validates and compiles end to end', () => {
  const fixture = factoryFixture();
  assert.equal(validateFactoryModel(fixture).ok, true);
  const compiled = compileFactory(fixture, { validateMaterials: true, includeReport: true });
  assert.equal(compiled.ok, true);
  assert.equal(compiled.value.materialShortages.length, 0);
  assert.equal(compiled.value.materialCostMinor, 3200);
  assert.ok(compiled.value.plan.operations.length > 0);
  assert.ok(compiled.value.report);
  const analysis = analyzeFactory(fixture, compiled.value.plan);
  assert.equal(analysis.schedule.completedOrders, 2);
});

test('factory portfolio compiles in deterministic name order', () => {
  const left = factoryFixture();
  const right = { ...factoryFixture(), name: 'South Cell' };
  const result = compileFactoryPortfolio([right, left]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value.entries.map((entry) => entry.name), ['North Cell', 'South Cell']);
});

test('unknown order items fail validation', () => {
  const fixture = factoryFixture();
  const invalid = { ...fixture, orders: [{ ...fixture.orders[0], itemId: 'MISSING' }] };
  assert.equal(validateFactoryModel(invalid).ok, false);
});

test('compiled plans explain where each order flow time went', () => {
  const fixture = factoryFixture();
  const compiled = compileFactory(fixture, { includeReport: false });
  const summary = explainFactoryDelays(fixture, compiled.value.plan);
  assert.equal(summary.ok, true);
  assert.equal(summary.value.planDigest, compiled.value.plan.digest);
  assert.deepEqual(summary.value.orders.map((entry) => entry.orderId), ['ORD-1', 'ORD-2']);
  for (const path of summary.value.orders) {
    const attributed = Object.values(path.minutesByCause).reduce((sum, value) => sum + value, 0);
    assert.equal(attributed, path.flowMinutes);
  }

  const single = explainOrderDelay(fixture, compiled.value.plan, 'ORD-2');
  assert.equal(single.ok, true);
  assert.equal(single.value.minutesByCause['resource-contention'], 22);
  assert.deepEqual(summary.value.blockingOrders[0].blockedOrders, ['ORD-2']);
});
