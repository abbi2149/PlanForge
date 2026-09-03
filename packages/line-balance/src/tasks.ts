import type { Quantity, Routing } from '@planforge/model';
import { operationDuration } from '@planforge/routing';
import type { BalanceTask } from './types.js';

export function tasksFromRouting(routing: Routing, quantity: Quantity): readonly BalanceTask[] {
  return routing.operations
    .map((operation) => ({
      operationId: operation.id,
      duration: operationDuration(operation, quantity),
      predecessors: [...operation.predecessors].sort(),
    }))
    .sort((a, b) => a.operationId.localeCompare(b.operationId));
}
