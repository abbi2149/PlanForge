import type { DemandOrder } from '@planforge/model';
import type { OrderLineInput } from './types.js';

export function normalizeOrder(input: OrderLineInput): DemandOrder {
  return {
    id: input.id,
    itemId: input.itemId,
    quantity: input.quantity,
    releaseMinute: input.releaseMinute,
    dueMinute: input.dueMinute,
    priority: input.priority ?? 0,
  };
}

export function normalizeOrders(inputs: readonly OrderLineInput[]): readonly DemandOrder[] {
  return inputs.map(normalizeOrder).sort((a, b) => a.releaseMinute - b.releaseMinute || a.dueMinute - b.dueMinute || a.id.localeCompare(b.id));
}
