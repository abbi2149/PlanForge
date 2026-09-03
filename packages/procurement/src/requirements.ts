import type { ItemId, Minute, Quantity } from '@planforge/model';
import type { InventoryPosition } from '@planforge/inventory';
import type { PurchaseRequirement } from './types.js';

export function requirementsFromShortages(
  projections: Readonly<Record<string, readonly InventoryPosition[]>>,
  buffer: Quantity = 0 as Quantity,
): readonly PurchaseRequirement[] {
  const result: PurchaseRequirement[] = [];
  for (const [itemId, positions] of Object.entries(projections).sort(([a], [b]) => a.localeCompare(b))) {
    for (const position of positions) {
      if (position.shortage <= 0) continue;
      result.push({
        itemId: itemId as ItemId,
        quantity: (position.shortage + buffer) as Quantity,
        needByMinute: position.minute as Minute,
      });
      break;
    }
  }
  return result;
}
