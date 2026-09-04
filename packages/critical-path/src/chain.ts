import type { OrderId, ProductionPlan, Routing, ScheduledOperation } from '@planforge/model';
import { operationById } from '@planforge/routing';

export function scheduledOperationsForOrder(
  plan: ProductionPlan,
  orderId: OrderId,
): readonly ScheduledOperation[] {
  return plan.operations
    .filter((operation) => operation.orderId === orderId)
    .sort(
      (a, b) =>
        a.startMinute - b.startMinute ||
        a.endMinute - b.endMinute ||
        a.operationId.localeCompare(b.operationId),
    );
}

const latestFirst = (a: ScheduledOperation, b: ScheduledOperation): number =>
  b.endMinute - a.endMinute || a.operationId.localeCompare(b.operationId);

/**
 * Walks backwards from the operation that determined the order's completion,
 * always following the scheduled predecessor that finished last. The result is
 * the chain of operations whose durations and waits add up to the order's flow
 * time, ordered from first to last.
 */
export function criticalChainOperations(
  routing: Routing,
  operations: readonly ScheduledOperation[],
): readonly ScheduledOperation[] {
  const last = [...operations].sort(latestFirst)[0];
  if (!last) return [];
  const byOperation = new Map(operations.map((operation) => [operation.operationId, operation]));
  const chain: ScheduledOperation[] = [last];
  const visited = new Set<string>([last.operationId]);
  let current = last;
  for (;;) {
    const spec = operationById(routing, current.operationId);
    if (!spec) break;
    const driver = spec.predecessors
      .map((predecessor) => byOperation.get(predecessor))
      .filter(
        (operation): operation is ScheduledOperation =>
          operation !== undefined && !visited.has(operation.operationId),
      )
      .sort(latestFirst)[0];
    if (!driver) break;
    chain.push(driver);
    visited.add(driver.operationId);
    current = driver;
  }
  return chain.reverse();
}
