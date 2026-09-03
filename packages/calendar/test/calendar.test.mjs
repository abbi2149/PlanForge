import test from 'node:test';
import assert from 'node:assert/strict';
import { availabilityFor, validateCalendar } from '../dist/index.js';

const calendar = {
  horizonStart: 0,
  horizonEnd: 100,
  shifts: [{ workCenterId: 'WC', start: 0, end: 100, capacityUnits: 2, label: 'day' }],
  exceptions: [{ workCenterId: 'WC', start: 20, end: 30, kind: 'closed', reason: 'service' }],
};

test('calendar validates and subtracts closed exceptions', () => {
  assert.equal(validateCalendar(calendar).ok, true);
  const slices = availabilityFor(calendar, 'WC', { start: 0, end: 40 });
  assert.deepEqual(slices, [
    { start: 0, end: 20, capacityUnits: 2, source: 'shift' },
    { start: 30, end: 40, capacityUnits: 2, source: 'shift' },
  ]);
  assert.equal(slices.reduce((sum, slice) => sum + slice.end - slice.start, 0), 30);
});

test('overlapping shifts are invalid', () => {
  const invalid = { ...calendar, exceptions: [], shifts: [...calendar.shifts, { ...calendar.shifts[0], start: 50, label: 'overlap' }] };
  assert.equal(validateCalendar(invalid).ok, false);
});
