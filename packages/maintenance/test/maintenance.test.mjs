import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePreventiveWindows, maintenanceImpactByCenter, maintenanceFreeMinutes } from '../dist/index.js';

test('preventive windows repeat to the horizon', () => {
  const windows = generatePreventiveWindows({ workCenterId: 'WC', intervalMinutes: 20, durationMinutes: 5, firstDueMinute: 10 }, 60);
  assert.deepEqual(windows.map((window) => window.start), [10, 30, 50]);
  assert.equal(maintenanceFreeMinutes(windows, 'WC', 0, 60), 45);
});

test('maintenance impact counts overlapping production', () => {
  const windows = [{ id: 'M1', workCenterId: 'WC', kind: 'repair', description: 'repair', start: 10, end: 20 }];
  const operations = [{ orderId: 'O', operationId: 'A', workCenterId: 'WC', startMinute: 15, endMinute: 25, quantity: 1 }];
  assert.equal(maintenanceImpactByCenter(windows, operations)[0].overlapMinutes, 5);
});
