import type { DemandOrder, ScheduledOperation } from '@planforge/model';
import type { OrderKpi } from './types.js';

export function orderKpis(
  orders: readonly DemandOrder[],
  operations: readonly ScheduledOperation[],
): readonly OrderKpi[] {
  return orders.flatMap((order) => {
    const entries = operations.filter((entry) => entry.orderId === order.id);
    if (entries.length === 0) return [];
    const firstStart = Math.min(...entries.map((entry) => entry.startMinute)) as OrderKpi['firstStart'];
    const completion = Math.max(...entries.map((entry) => entry.endMinute)) as OrderKpi['completion'];
    return [{
      orderId: order.id,
      firstStart,
      completion,
      flowMinutes: (completion - order.releaseMinute) as OrderKpi['flowMinutes'],
      operationCount: entries.length,
    }];
  }).sort((a, b) => a.orderId.localeCompare(b.orderId));
}
