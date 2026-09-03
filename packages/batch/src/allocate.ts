import type { DemandOrder, Quantity } from '@planforge/model';
import type { BatchAllocation, BatchDefinition } from './types.js';

export function allocateOrdersToBatch(batch: BatchDefinition, orders: readonly DemandOrder[]): readonly BatchAllocation[] {
  let remaining = batch.targetQuantity;
  const result: BatchAllocation[] = [];
  for (const order of [...orders]
    .filter((entry) => entry.itemId === batch.itemId && entry.releaseMinute <= batch.releaseMinute)
    .sort((a, b) => b.priority - a.priority || a.dueMinute - b.dueMinute || a.id.localeCompare(b.id))) {
    if (remaining <= 0) break;
    const quantity = Math.min(remaining, order.quantity) as Quantity;
    if (quantity > 0) result.push({ batchId: batch.id, orderId: order.id, quantity });
    remaining = (remaining - quantity) as Quantity;
  }
  return result;
}
