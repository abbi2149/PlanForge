import { failure, success, type ModelResult } from '@planforge/model';
import type { InventoryValuationPoint } from './types.js';

export function validateInventoryValuation(points: readonly InventoryValuationPoint[]): ModelResult<readonly InventoryValuationPoint[]> {
  for (const point of points) {
    if (!Number.isSafeInteger(point.period) || point.inventoryMinor < 0 || point.costOfGoodsMinor < 0) {
      return failure({ code: 'INVENTORY_TURNS_POINT', message: `invalid valuation point ${point.itemId}/${point.period}` });
    }
  }
  return success([...points]);
}
