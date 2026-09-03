import type { DemandOrder, Minute, Quantity } from '@planforge/model';
import { releaseEligible } from './eligible.js';
import type { ReleasedOrder, ReleasePolicy } from './types.js';

export function releaseOrders(
  orders: readonly DemandOrder[],
  now: Minute,
  currentWip: Quantity,
  policy: ReleasePolicy,
): readonly ReleasedOrder[] {
  let wip = currentWip as number;
  const released: ReleasedOrder[] = [];
  for (const order of [...orders].sort((a, b) => b.priority - a.priority || a.dueMinute - b.dueMinute || a.id.localeCompare(b.id))) {
    if (!releaseEligible(order, now, wip as Quantity, policy)) continue;
    const reason = order.priority >= policy.priorityFloor ? 'priority' : order.dueMinute - now <= policy.lookaheadMinutes ? 'due-window' : 'capacity';
    released.push({ order, releasedAt: now, reason });
    wip += order.quantity;
  }
  return released;
}
