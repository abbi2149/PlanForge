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

test('an order is late when any operation finishes after the due minute', () => {
  // Two terminal operations on separate work centers. Topological order visits
  // them alphabetically, so the operation placed last (TRIM) is not the one
  // that ends last (FINISH). Completion is the latest end, not the last placed.
  const routings = [
    {
      id: 'ROUTE-FG',
      itemId: 'FG',
      operations: [
        { id: 'FINISH', workCenterId: 'WC-FINISH', setupMinutes: 0, runMinutesPerUnit: 100, yieldBasisPoints: 10_000, predecessors: [] },
        { id: 'TRIM', workCenterId: 'WC-TRIM', setupMinutes: 0, runMinutesPerUnit: 10, yieldBasisPoints: 10_000, predecessors: [] },
      ],
    },
  ];
  const orders = [{ id: 'ORD-1', itemId: 'FG', quantity: 1, releaseMinute: 0, dueMinute: 50, priority: 1 }];
  const calendar = {
    horizonStart: 0,
    horizonEnd: 480,
    shifts: [
      { workCenterId: 'WC-FINISH', start: 0, end: 480, capacityUnits: 1, label: 'finish' },
      { workCenterId: 'WC-TRIM', start: 0, end: 480, capacityUnits: 1, label: 'trim' },
    ],
    exceptions: [],
  };

  const result = compileSchedule({ name: 'parallel', orders, routings, calendar });
  assert.equal(result.ok, true);
  assert.deepEqual(result.value.lateOrders, ['ORD-1']);
  assert.deepEqual(result.value.warnings, ['order ORD-1 completes late']);

  // The plan must agree with the lateness helpers reading the same operations.
  assert.equal(orderLateness(orders, result.value.operations)[0].tardinessMinutes, 50);
  assert.equal(serviceLevelBasisPoints(orders, result.value.operations), 0);
});

test('an on-time order with parallel operations raises no warning', () => {
  const routings = [
    {
      id: 'ROUTE-FG',
      itemId: 'FG',
      operations: [
        { id: 'FINISH', workCenterId: 'WC-FINISH', setupMinutes: 0, runMinutesPerUnit: 100, yieldBasisPoints: 10_000, predecessors: [] },
        { id: 'TRIM', workCenterId: 'WC-TRIM', setupMinutes: 0, runMinutesPerUnit: 10, yieldBasisPoints: 10_000, predecessors: [] },
      ],
    },
  ];
  const orders = [{ id: 'ORD-1', itemId: 'FG', quantity: 1, releaseMinute: 0, dueMinute: 200, priority: 1 }];
  const calendar = {
    horizonStart: 0,
    horizonEnd: 480,
    shifts: [
      { workCenterId: 'WC-FINISH', start: 0, end: 480, capacityUnits: 1, label: 'finish' },
      { workCenterId: 'WC-TRIM', start: 0, end: 480, capacityUnits: 1, label: 'trim' },
    ],
    exceptions: [],
  };

  const result = compileSchedule({ name: 'parallel-on-time', orders, routings, calendar });
  assert.equal(result.ok, true);
  assert.deepEqual(result.value.lateOrders, []);
  assert.deepEqual(result.value.warnings, []);
});
