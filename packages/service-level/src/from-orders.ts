import type { DemandOrder, ScheduledOperation } from '@planforge/model';
import type { FulfillmentRecord } from './types.js';

export function fulfillmentFromPlan(orders: readonly DemandOrder[], operations: readonly ScheduledOperation[]): readonly FulfillmentRecord[] {
  return orders.flatMap((order) => {
    const completion = Math.max(0, ...operations.filter((operation) => operation.orderId === order.id).map((operation) => operation.endMinute));
    if (completion === 0) return [];
    return [{
      orderId: order.id,
      promisedMinute: order.dueMinute,
      completedMinute: completion as FulfillmentRecord['completedMinute'],
      requestedQuantity: order.quantity,
      shippedQuantity: order.quantity,
    }];
  });
}
