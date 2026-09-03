import { failure, success, type ModelResult } from '@planforge/model';
import type { WorkOrder } from './types.js';

export function validateWorkOrders(orders: readonly WorkOrder[]): ModelResult<readonly WorkOrder[]> {
  const ids = new Set<string>();
  for (const order of orders) {
    if (ids.has(order.id) || order.quantity <= 0 || order.dueMinute < order.releaseMinute) {
      return failure({ code: 'WORK_ORDER', message: `invalid work order ${order.id}` });
    }
    ids.add(order.id);
  }
  return success([...orders]);
}
