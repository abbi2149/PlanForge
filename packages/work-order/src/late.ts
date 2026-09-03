import type { Minute } from '@planforge/model';
import type { WorkOrder } from './types.js';

export function workOrderLate(order: WorkOrder, now: Minute): boolean {
  return order.status !== 'completed' && order.status !== 'cancelled' && now > order.dueMinute;
}

export function lateWorkOrders(orders: readonly WorkOrder[], now: Minute): readonly WorkOrder[] {
  return orders.filter((order) => workOrderLate(order, now)).sort((a, b) => a.dueMinute - b.dueMinute || a.id.localeCompare(b.id));
}
