import test from 'node:test';
import assert from 'node:assert/strict';
import {
  criticalChainOperations,
  classifyWaitWindow,
  orderCriticalPath,
  planCriticalPaths,
  validateCriticalPathInput,
} from '../dist/index.js';

const routing = {
  id: 'ROUTE-FG',
  itemId: 'FG',
  operations: [
    {
      id: 'ASSEMBLE',
      workCenterId: 'ASM',
      setupMinutes: 0,
      runMinutesPerUnit: 10,
      yieldBasisPoints: 10_000,
      predecessors: ['CUT'],
    },
    {
      id: 'CUT',
      workCenterId: 'CUT',
      setupMinutes: 0,
      runMinutesPerUnit: 10,
      yieldBasisPoints: 10_000,
      predecessors: [],
    },
  ],
};

const orders = [
  { id: 'ORD-1', itemId: 'FG', quantity: 1, releaseMinute: 0, dueMinute: 200, priority: 5 },
  { id: 'ORD-2', itemId: 'FG', quantity: 1, releaseMinute: 0, dueMinute: 40, priority: 1 },
];

// ORD-1 runs first at CUT. ORD-2 is released at the same minute but must wait
// for the CUT machine, then waits again while the plant is closed from 60-100.
const plan = {
  name: 'contention',
  digest: 'b'.repeat(64),
  warnings: [],
  operations: [
    { orderId: 'ORD-1', operationId: 'CUT', workCenterId: 'CUT', startMinute: 0, endMinute: 20, quantity: 1 },
    { orderId: 'ORD-1', operationId: 'ASSEMBLE', workCenterId: 'ASM', startMinute: 20, endMinute: 40, quantity: 1 },
    { orderId: 'ORD-2', operationId: 'CUT', workCenterId: 'CUT', startMinute: 20, endMinute: 40, quantity: 1 },
    { orderId: 'ORD-2', operationId: 'ASSEMBLE', workCenterId: 'ASM', startMinute: 100, endMinute: 120, quantity: 1 },
  ],
};

const calendar = {
  horizonStart: 0,
  horizonEnd: 240,
  shifts: [
    { workCenterId: 'CUT', start: 0, end: 240, capacityUnits: 1, label: 'cut' },
    { workCenterId: 'ASM', start: 0, end: 240, capacityUnits: 1, label: 'asm' },
  ],
  exceptions: [
    { workCenterId: 'ASM', start: 60, end: 100, kind: 'closed', reason: 'planned shutdown' },
  ],
};

const input = { plan, orders, routings: [routing], calendar };

test('the critical chain follows the predecessor that finished last', () => {
  const chain = criticalChainOperations(
    routing,
    plan.operations.filter((operation) => operation.orderId === 'ORD-2'),
  );
  assert.deepEqual(
    chain.map((operation) => operation.operationId),
    ['CUT', 'ASSEMBLE'],
  );
});

test('delay attribution names contention, closures, and idle waiting', () => {
  const result = orderCriticalPath(input, 'ORD-2');
  assert.equal(result.ok, true);
  const path = result.value;
  assert.equal(path.flowMinutes, 120);
  assert.equal(path.tardinessMinutes, 80);
  assert.deepEqual(path.minutesByCause, {
    processing: 40,
    'calendar-closed': 40,
    'resource-contention': 20,
    'idle-wait': 20,
  });
  const contention = path.segments.find((segment) => segment.cause === 'resource-contention');
  assert.deepEqual(contention.blockingOrders, ['ORD-1']);
  assert.equal(contention.workCenterId, 'CUT');
  const closed = path.segments.find((segment) => segment.cause === 'calendar-closed');
  assert.deepEqual([closed.fromMinute, closed.toMinute], [60, 100]);
});

test('attributed minutes always sum to the order flow time', () => {
  const summary = planCriticalPaths(input);
  assert.equal(summary.ok, true);
  for (const path of summary.value.orders) {
    const total = Object.values(path.minutesByCause).reduce((sum, value) => sum + value, 0);
    assert.equal(total, path.flowMinutes, `${path.orderId} attribution must be complete`);
    const covered = path.segments.reduce((sum, segment) => sum + segment.minutes, 0);
    assert.equal(covered, path.flowMinutes);
  }
});

test('segments are contiguous and ordered from release to completion', () => {
  const path = orderCriticalPath(input, 'ORD-2').value;
  let cursor = path.releaseMinute;
  for (const segment of path.segments) {
    assert.equal(segment.fromMinute, cursor);
    assert.ok(segment.toMinute > segment.fromMinute);
    cursor = segment.toMinute;
  }
  assert.equal(cursor, path.completionMinute);
});

test('the plan summary ranks work centers and blocking orders', () => {
  const summary = planCriticalPaths(input).value;
  assert.equal(summary.planDigest, plan.digest);
  assert.deepEqual(summary.lateOrders, ['ORD-2']);
  assert.deepEqual(summary.minutesByCause, {
    processing: 80,
    'calendar-closed': 40,
    'resource-contention': 20,
    'idle-wait': 20,
  });
  assert.equal(summary.waitShareBasisPoints, 5000);
  assert.equal(summary.workCenters[0].workCenterId, 'ASM');
  assert.equal(summary.workCenters[0].waitMinutes, 60);
  assert.deepEqual(summary.blockingOrders, [
    { orderId: 'ORD-1', blockedMinutes: 20, blockedOrders: ['ORD-2'] },
  ]);
});

test('results are stable across repeated evaluation', () => {
  const first = JSON.stringify(planCriticalPaths(input).value);
  const second = JSON.stringify(planCriticalPaths({ ...input, orders: [...orders].reverse() }).value);
  assert.equal(first, second);
});

test('a wait window with no calendar coverage is entirely closed time', () => {
  const spans = classifyWaitWindow(calendar, plan.operations, 'ASM', 'ORD-2', 60, 100);
  assert.deepEqual(spans, [
    { fromMinute: 60, toMinute: 100, cause: 'calendar-closed', blockingOrders: [] },
  ]);
});

test('a plan that violates precedence is rejected as malformed', () => {
  const broken = {
    ...input,
    plan: {
      ...plan,
      operations: [
        { orderId: 'ORD-1', operationId: 'CUT', workCenterId: 'CUT', startMinute: 30, endMinute: 50, quantity: 1 },
        { orderId: 'ORD-1', operationId: 'ASSEMBLE', workCenterId: 'ASM', startMinute: 0, endMinute: 20, quantity: 1 },
      ],
    },
  };
  const result = validateCriticalPathInput(broken);
  assert.equal(result.ok, false);
  assert.equal(result.diagnostics[0].code, 'CRITICAL_PATH_PRECEDENCE');
});

test('an unscheduled order is an expected failure, not an exception', () => {
  const result = orderCriticalPath({ ...input, plan: { ...plan, operations: [] } }, 'ORD-1');
  assert.equal(result.ok, false);
  assert.equal(result.diagnostics[0].code, 'CRITICAL_PATH_UNSCHEDULED_ORDER');
});
