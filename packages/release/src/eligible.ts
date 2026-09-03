import type { DemandOrder, Minute, Quantity } from '@planforge/model';
import type { ReleasePolicy } from './types.js';

export function releaseEligible(
  order: DemandOrder,
  now: Minute,
  currentWip: Quantity,
  policy: ReleasePolicy,
): boolean {
  if (currentWip + order.quantity > policy.maximumWipQuantity) return false;
  if (order.priority >= policy.priorityFloor) return true;
  return order.releaseMinute <= now && order.dueMinute - now <= policy.lookaheadMinutes;
}
