import type { DemandOrder, Minute } from '@planforge/model';
import type { OrderWindow } from './types.js';

export function orderWindow(orders: readonly DemandOrder[]): OrderWindow | null {
  if (orders.length === 0) return null;
  return {
    earliestRelease: Math.min(...orders.map((order) => order.releaseMinute)) as Minute,
    latestDue: Math.max(...orders.map((order) => order.dueMinute)) as Minute,
  };
}

export function ordersDueWithin(orders: readonly DemandOrder[], start: Minute, end: Minute): readonly DemandOrder[] {
  return orders.filter((order) => order.dueMinute >= start && order.dueMinute < end).sort((a, b) => a.dueMinute - b.dueMinute || a.id.localeCompare(b.id));
}
