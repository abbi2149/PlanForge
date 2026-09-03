import type { ItemId, Quantity } from '@planforge/model';
import { freeCapacity } from './capacity.js';
import type { StorageLocation, StoredLot } from './types.js';

export function putawayLocation(
  locations: readonly StorageLocation[],
  lots: readonly StoredLot[],
  itemId: ItemId,
  quantity: Quantity,
): StorageLocation | null {
  return [...locations]
    .filter((location) => location.allowedItems === undefined || location.allowedItems.includes(itemId))
    .filter((location) => freeCapacity(location, lots) >= quantity)
    .sort((a, b) => {
      const aFree = freeCapacity(a, lots);
      const bFree = freeCapacity(b, lots);
      return aFree - bFree || a.zone.localeCompare(b.zone) || a.id.localeCompare(b.id);
    })[0] ?? null;
}
