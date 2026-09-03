import test from 'node:test';
import assert from 'node:assert/strict';
import { compileSchedule, comparePlanStability, orderLateness, serviceLevelBasisPoints, utilizationByWorkCenter } from '../dist/index.js';
import { factoryFixture } from '../../../test/fixtures.mjs';

test('serial scheduler respects routing precedence', () => {
  const fixture = factoryFixture();
  const result = compileSchedule({ name: fixture.name, orders: fixture.orders, routings: fixture.routings, calendar: fixture.calendar });
  assert.equal(result.ok, true);
  const ord1 = result.value.operations.filter((operation) => operation.orderId === 'ORD-1');
  assert.equal(ord1[0].operationId, 'CUT');
  assert.equal(ord1[1].operationId, 'ASSEMBLE');
  assert.ok(ord1[1].startMinute >= ord1[0].endMinute);
});

test('lateness and utilization metrics summarize a plan', () => {
  const fixture = factoryFixture();
  const result = compileSchedule({ name: fixture.name, orders: fixture.orders, routings: fixture.routings, calendar: fixture.calendar });
  assert.equal(result.ok, true);
  assert.equal(serviceLevelBasisPoints(fixture.orders, result.value.operations), 10_000);
  assert.equal(orderLateness(fixture.orders, result.value.operations).length, 2);
  assert.equal(utilizationByWorkCenter(result.value.operations, 0, 720).length, 2);
});

test('plan stability detects shifted operations', () => {
  const baseline = { name: 'a', digest: 'a'.repeat(64), warnings: [], operations: [{ orderId: 'O', operationId: 'A', workCenterId: 'WC', startMinute: 0, endMinute: 10, quantity: 1 }] };
  const candidate = { ...baseline, digest: 'b'.repeat(64), operations: [{ ...baseline.operations[0], startMinute: 5, endMinute: 15 }] };
  const stability = comparePlanStability(baseline, candidate);
  assert.equal(stability.movedOperations, 1);
  assert.equal(stability.maximumAbsoluteStartShift, 5);
});
