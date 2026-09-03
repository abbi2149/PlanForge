import test from 'node:test';
import assert from 'node:assert/strict';
import { assignStaffing, staffingGaps } from '../dist/index.js';

const workers = [{ id: 'W1', name: 'Ana', skills: ['weld'], efficiencyBasisPoints: 10_000 }];
const availability = [{ workerId: 'W1', start: 0, end: 100 }];
const requirements = [{ workCenterId: 'WC', skillId: 'weld', start: 10, end: 20, headcount: 1 }];

test('workforce assignment covers compatible requirements', () => {
  const assignments = assignStaffing(workers, availability, requirements);
  assert.equal(assignments.length, 1);
  assert.deepEqual(staffingGaps(requirements, assignments), []);
});
