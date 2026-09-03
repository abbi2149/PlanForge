import { routingTouchTime } from '@planforge/routing';
import type { DemandOrder, Minute, Routing } from '@planforge/model';
import type { DispatchRule } from './types.js';

function processingMinutes(order: DemandOrder, routings: readonly Routing[]): number {
  const routing = routings.find((entry) => entry.itemId === order.itemId);
  return routing ? routingTouchTime(routing, order.quantity) : Number.MAX_SAFE_INTEGER;
}

export function orderPriorityComparator(
  rule: DispatchRule,
  routings: readonly Routing[],
  now: Minute,
): (left: DemandOrder, right: DemandOrder) => number {
  return (left, right) => {
    if (rule === 'priority') {
      return right.priority - left.priority || left.dueMinute - right.dueMinute || left.id.localeCompare(right.id);
    }
    if (rule === 'earliest-due') {
      return left.dueMinute - right.dueMinute || right.priority - left.priority || left.id.localeCompare(right.id);
    }
    const leftProcessing = processingMinutes(left, routings);
    const rightProcessing = processingMinutes(right, routings);
    if (rule === 'shortest-processing') {
      return leftProcessing - rightProcessing || left.dueMinute - right.dueMinute || left.id.localeCompare(right.id);
    }
    const leftRatio = leftProcessing === 0 ? Number.POSITIVE_INFINITY : (left.dueMinute - now) / leftProcessing;
    const rightRatio = rightProcessing === 0 ? Number.POSITIVE_INFINITY : (right.dueMinute - now) / rightProcessing;
    return leftRatio - rightRatio || left.dueMinute - right.dueMinute || left.id.localeCompare(right.id);
  };
}
