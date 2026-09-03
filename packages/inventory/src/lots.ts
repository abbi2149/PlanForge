import type { ItemId, Minute, Quantity } from '@planforge/model';
import type { InventoryLot, LotAllocation } from './types.js';

export function usableLots(lots: readonly InventoryLot[], itemId: ItemId, minute: Minute): readonly InventoryLot[] {
  return lots
    .filter(
      (lot) => lot.itemId === itemId && lot.availableMinute <= minute && (lot.expiresMinute === undefined || minute < lot.expiresMinute),
    )
    .sort((a, b) => (a.expiresMinute ?? Number.MAX_SAFE_INTEGER) - (b.expiresMinute ?? Number.MAX_SAFE_INTEGER) || a.availableMinute - b.availableMinute || a.id.localeCompare(b.id));
}

export function allocateLots(
  lots: readonly InventoryLot[],
  itemId: ItemId,
  minute: Minute,
  required: Quantity,
): readonly LotAllocation[] | null {
  let remaining = required;
  const allocations: LotAllocation[] = [];
  for (const lot of usableLots(lots, itemId, minute)) {
    if (remaining === 0) break;
    const taken = Math.min(remaining, lot.quantity) as Quantity;
    if (taken > 0) allocations.push({ lotId: lot.id, itemId, quantity: taken });
    remaining = (remaining - taken) as Quantity;
  }
  return remaining === 0 ? allocations : null;
}
