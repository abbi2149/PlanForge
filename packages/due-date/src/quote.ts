import type { DemandOrder, Routing } from '@planforge/model';
import type { DueDatePolicy } from './types.js';
import { estimateDueDate } from './estimate.js';

export function quotedLeadMinutes(order: DemandOrder, routing: Routing, policy: DueDatePolicy): number {
  const estimate = estimateDueDate(order, routing, policy);
  return estimate.promisedMinute - estimate.releaseMinute;
}

export function canMeetRequestedDue(order: DemandOrder, routing: Routing, policy: DueDatePolicy): boolean {
  return estimateDueDate(order, routing, policy).promisedMinute <= order.dueMinute;
}
