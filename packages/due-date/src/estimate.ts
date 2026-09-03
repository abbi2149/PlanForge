import type { DemandOrder, Minute, Routing } from '@planforge/model';
import { routingTouchTime } from '@planforge/routing';
import type { DueDateEstimate, DueDatePolicy } from './types.js';

export function estimateDueDate(order: DemandOrder, routing: Routing, policy: DueDatePolicy): DueDateEstimate {
  const processingMinutes = routingTouchTime(routing, order.quantity);
  const variable = Math.ceil((processingMinutes * policy.allowanceBasisPoints) / 10_000);
  const allowanceMinutes = Math.max(policy.minimumAllowanceMinutes, variable) as Minute;
  return {
    orderId: order.id,
    releaseMinute: order.releaseMinute,
    processingMinutes,
    allowanceMinutes,
    promisedMinute: (order.releaseMinute + processingMinutes + allowanceMinutes) as Minute,
  };
}
