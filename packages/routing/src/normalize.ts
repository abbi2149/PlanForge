import type { OperationSpec, Routing } from '@planforge/model';
import type { RoutingInput } from './types.js';

export function normalizeRouting(input: RoutingInput): Routing {
  const operations: OperationSpec[] = input.operations.map((operation) => ({
    id: operation.id,
    workCenterId: operation.workCenterId,
    setupMinutes: operation.setupMinutes,
    runMinutesPerUnit: operation.runMinutesPerUnit,
    yieldBasisPoints: operation.yieldBasisPoints,
    predecessors: [...(operation.predecessors ?? [])].sort(),
  }));
  operations.sort((a, b) => a.id.localeCompare(b.id));
  return { id: input.id, itemId: input.itemId, operations };
}
