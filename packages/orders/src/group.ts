import type { DemandOrder, Quantity } from '@planforge/model';
import type { OrderGroup } from './types.js';

export function groupOrders(
  orders: readonly DemandOrder[],
  key: (order: DemandOrder) => string,
): readonly OrderGroup[] {
  const groups = new Map<string, DemandOrder[]>();
  for (const order of orders) groups.set(key(order), [...(groups.get(key(order)) ?? []), order]);
  return [...groups.entries()]
    .map(([groupKey, entries]) => ({
      key: groupKey,
      orders: [...entries].sort((a, b) => a.dueMinute - b.dueMinute || a.id.localeCompare(b.id)),
      totalQuantity: entries.reduce((sum, entry) => sum + entry.quantity, 0) as Quantity,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
