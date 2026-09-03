import test from 'node:test';
import assert from 'node:assert/strict';
import { explodeBom, validateBom } from '../dist/index.js';

const boms = [
  { itemId: 'FG', components: [{ itemId: 'SUB', quantityPer: 2, scrapBasisPoints: 0 }] },
  { itemId: 'SUB', components: [{ itemId: 'RM', quantityPer: 3, scrapBasisPoints: 1000 }] },
];

test('BOM explosion traverses multiple levels with scrap', () => {
  assert.equal(validateBom(boms).ok, true);
  const requirements = explodeBom(boms, 'FG', 2);
  assert.deepEqual(requirements.map((entry) => [entry.itemId, entry.quantity, entry.level]), [['SUB', 4, 1], ['RM', 14, 2]]);
});
