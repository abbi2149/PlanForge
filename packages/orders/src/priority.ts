import type { DemandOrder } from '@planforge/model';

export function reprioritize(
  orders: readonly DemandOrder[],
  priorities: Readonly<Record<string, number>>,
): readonly DemandOrder[] {
  return orders
    .map((order) => ({ ...order, priority: priorities[order.id] ?? order.priority }))
    .sort((a, b) => b.priority - a.priority || a.dueMinute - b.dueMinute || a.id.localeCompare(b.id));
}

export function expedite(orders: readonly DemandOrder[], orderId: string, priority = 1_000): readonly DemandOrder[] {
  return reprioritize(orders, { [orderId]: priority });
}
