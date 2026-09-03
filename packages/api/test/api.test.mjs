import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFactory, compileFactory, compileFactoryPortfolio, validateFactoryModel } from '../dist/index.js';
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
