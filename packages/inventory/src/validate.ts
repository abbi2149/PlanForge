import { failure, success, type ModelResult } from '@planforge/model';
import type { InventoryDemand, InventoryLot, InventoryReceipt } from './types.js';

export function validateInventory(
  lots: readonly InventoryLot[],
  receipts: readonly InventoryReceipt[],
  demands: readonly InventoryDemand[],
): ModelResult<true> {
  const lotIds = new Set<string>();
  for (const lot of lots) {
    if (lotIds.has(lot.id)) return failure({ code: 'INVENTORY_DUPLICATE_LOT', message: `duplicate lot ${lot.id}` });
    lotIds.add(lot.id);
    if (lot.expiresMinute !== undefined && lot.expiresMinute <= lot.availableMinute) {
      return failure({ code: 'INVENTORY_EXPIRY', message: `lot ${lot.id} expires before it is available` });
    }
  }
  for (const entry of [...receipts, ...demands]) {
    if (entry.quantity <= 0) return failure({ code: 'INVENTORY_QUANTITY', message: `inventory event ${entry.reference} has no quantity` });
  }
  return success(true);
}
