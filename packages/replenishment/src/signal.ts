import type { InventoryPosition } from '@planforge/inventory';
import type { Quantity } from '@planforge/model';
import type { ReplenishmentPolicy, ReplenishmentSignal } from './types.js';

export function replenishmentSignal(
  policy: ReplenishmentPolicy,
  positions: readonly InventoryPosition[],
): ReplenishmentSignal | null {
  const trigger = positions
    .filter((position) => position.itemId === policy.itemId && position.onHand <= policy.reorderPoint)
    .sort((a, b) => a.minute - b.minute)[0];
  if (!trigger) return null;
  const deficit = Math.max(0, policy.targetLevel - trigger.onHand);
  const quantity = policy.orderMultiple <= 1 ? deficit : Math.ceil(deficit / policy.orderMultiple) * policy.orderMultiple;
  return {
    itemId: policy.itemId,
    atMinute: trigger.minute,
    projectedOnHand: trigger.onHand,
    orderQuantity: quantity as Quantity,
    expectedMinute: (trigger.minute + policy.leadMinutes) as ReplenishmentSignal['expectedMinute'],
  };
}
