import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ageInventoryLots,
  expiringQuantity,
  inventoryCoverage,
  projectInventory,
  firstShortageMinute,
  reorderRecommendation,
} from '../dist/index.js';

const item = 'RM';
const lots = [{ id: 'L1', itemId: item, quantity: 10, availableMinute: 0, expiresMinute: 50 }];

test('inventory projection exposes shortages', () => {
  const positions = projectInventory(item, 3, [], [{ itemId: item, quantity: 5, minute: 10, reference: 'demand' }]);
  assert.equal(firstShortageMinute(positions), 10);
  assert.equal(positions[0].shortage, 2);
});

test('lot aging and expiry are deterministic', () => {
  assert.equal(ageInventoryLots(lots, 20)[0].ageMinutes, 20);
  assert.equal(expiringQuantity(lots, 20, 40), 10);
});

test('coverage and reorder policies produce actionable quantities', () => {
  const coverage = inventoryCoverage(item, lots, [], [{ itemId: item, quantity: 10, minute: 20, reference: 'd' }], 0, 20);
  assert.equal(coverage.coverageMinutes, 20);
  const reorder = reorderRecommendation({ itemId: item, leadTimeMinutes: 10, reviewPeriodMinutes: 10, safetyStock: 2, minimumOrderQuantity: 5, orderMultiple: 5 }, 1, 3);
  assert.equal(reorder.recommendedOrder, 20);
});
