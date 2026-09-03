import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPickList, locationUtilization, putawayLocation, validateWarehouse } from '../dist/index.js';

const locations = [{ id: 'A', zone: 'Z1', capacityUnits: 10 }, { id: 'B', zone: 'Z1', capacityUnits: 20 }];
const lots = [{ lotId: 'L1', itemId: 'RM', locationId: 'A', quantity: 5, storedMinute: 1 }];

test('warehouse validation, picking, and putaway use deterministic ordering', () => {
  assert.equal(validateWarehouse(locations, lots).ok, true);
  assert.deepEqual(buildPickList(lots, 'RM', 3), [{ lotId: 'L1', locationId: 'A', quantity: 3 }]);
  assert.equal(putawayLocation(locations, lots, 'RM', 6).id, 'B');
  assert.equal(locationUtilization(locations, lots)[0].utilizationBasisPoints, 5000);
});
