import type { ItemId, Quantity } from '@planforge/model';
import type { StoredLot } from './types.js';

export interface PickLine {
  readonly lotId: StoredLot['lotId'];
  readonly locationId: string;
  readonly quantity: Quantity;
}

export function buildPickList(lots: readonly StoredLot[], itemId: ItemId, quantity: Quantity): readonly PickLine[] | null {
  let remaining = quantity;
  const result: PickLine[] = [];
  const candidates = lots
    .filter((lot) => lot.itemId === itemId && lot.quantity > 0)
    .sort((a, b) => a.storedMinute - b.storedMinute || a.locationId.localeCompare(b.locationId) || a.lotId.localeCompare(b.lotId));
  for (const lot of candidates) {
    if (remaining <= 0) break;
    const picked = Math.min(remaining, lot.quantity) as Quantity;
    result.push({ lotId: lot.lotId, locationId: lot.locationId, quantity: picked });
    remaining = (remaining - picked) as Quantity;
  }
  return remaining === 0 ? result : null;
}
