import type { ItemId, OperationId, OperationSpec, Routing } from '@planforge/model';

export function routingForItem(routings: readonly Routing[], itemId: ItemId): Routing | null {
  return [...routings].sort((a, b) => a.id.localeCompare(b.id)).find((routing) => routing.itemId === itemId) ?? null;
}

export function operationById(routing: Routing, operationId: OperationId): OperationSpec | null {
  return routing.operations.find((operation) => operation.id === operationId) ?? null;
}

export function rootOperations(routing: Routing): readonly OperationSpec[] {
  return routing.operations.filter((operation) => operation.predecessors.length === 0).sort((a, b) => a.id.localeCompare(b.id));
}

export function leafOperations(routing: Routing): readonly OperationSpec[] {
  const predecessors = new Set(routing.operations.flatMap((operation) => operation.predecessors));
  return routing.operations.filter((operation) => !predecessors.has(operation.id)).sort((a, b) => a.id.localeCompare(b.id));
}
