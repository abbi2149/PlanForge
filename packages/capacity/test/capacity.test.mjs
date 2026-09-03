import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyLedger, reserveCapacity, firstCapacityGap, utilizationForRange } from '../dist/index.js';

const calendar = { horizonStart: 0, horizonEnd: 100, shifts: [{ workCenterId: 'WC', start: 0, end: 100, capacityUnits: 1, label: 'day' }], exceptions: [] };

test('capacity reservations prevent overlapping use', () => {
  const first = reserveCapacity(calendar, emptyLedger(), { orderId: 'O1', operationId: 'A', workCenterId: 'WC', start: 10, end: 30, units: 1 });
  assert.equal(first.ok, true);
  assert.equal(reserveCapacity(calendar, first.value, { orderId: 'O2', operationId: 'B', workCenterId: 'WC', start: 20, end: 25, units: 1 }).ok, false);
  assert.equal(firstCapacityGap(calendar, first.value, 'WC', 10, 10), 30);
});

test('capacity utilization is bounded', () => {
  const first = reserveCapacity(calendar, emptyLedger(), { orderId: 'O1', operationId: 'A', workCenterId: 'WC', start: 0, end: 50, units: 1 });
  const util = utilizationForRange(calendar, first.value, 'WC', 0, 100);
  assert.equal(util.utilizationBasisPoints, 5000);
});
