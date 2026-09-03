import type { Minute, OperationSpec, Quantity, Routing } from '@planforge/model';

export function operationDuration(operation: OperationSpec, quantity: Quantity): Minute {
  return (operation.setupMinutes + operation.runMinutesPerUnit * quantity) as Minute;
}

export function routingTouchTime(routing: Routing, quantity: Quantity): Minute {
  return routing.operations.reduce(
    (total, operation) => (total + operationDuration(operation, quantity)) as Minute,
    0 as Minute,
  );
}

export function criticalPathMinutes(routing: Routing, quantity: Quantity): Minute {
  const completion = new Map<string, Minute>();
  const pending = new Set(routing.operations.map((operation) => operation.id));
  while (pending.size > 0) {
    let progressed = false;
    for (const operation of routing.operations) {
      if (!pending.has(operation.id)) continue;
      if (!operation.predecessors.every((id) => completion.has(id))) continue;
      const predecessorEnd = operation.predecessors.reduce(
        (latest, id) => Math.max(latest, completion.get(id) ?? 0) as Minute,
        0 as Minute,
      );
      completion.set(operation.id, (predecessorEnd + operationDuration(operation, quantity)) as Minute);
      pending.delete(operation.id);
      progressed = true;
    }
    if (!progressed) return Number.POSITIVE_INFINITY as Minute;
  }
  return Math.max(...completion.values(), 0) as Minute;
}
