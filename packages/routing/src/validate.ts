import { failure, success, type ModelResult, type Routing } from '@planforge/model';
import { topologicalOrder } from './graph.js';

export function validateRouting(routing: Routing): ModelResult<Routing> {
  if (routing.operations.length === 0) {
    return failure({ code: 'ROUTING_EMPTY', message: `routing ${routing.id} has no operations` });
  }
  const ids = new Set(routing.operations.map((operation) => operation.id));
  if (ids.size !== routing.operations.length) {
    return failure({ code: 'ROUTING_DUPLICATE_OPERATION', message: `routing ${routing.id} repeats an operation id` });
  }
  for (const operation of routing.operations) {
    if (operation.setupMinutes < 0 || operation.runMinutesPerUnit < 0) {
      return failure({ code: 'ROUTING_DURATION', message: `operation ${operation.id} has a negative duration` });
    }
    if (operation.yieldBasisPoints <= 0) {
      return failure({ code: 'ROUTING_YIELD', message: `operation ${operation.id} has zero yield` });
    }
    for (const predecessor of operation.predecessors) {
      if (!ids.has(predecessor) || predecessor === operation.id) {
        return failure({ code: 'ROUTING_PREDECESSOR', message: `operation ${operation.id} has an invalid predecessor` });
      }
    }
  }
  if (topologicalOrder(routing) === null) {
    return failure({ code: 'ROUTING_CYCLE', message: `routing ${routing.id} contains a cycle` });
  }
  return success(routing);
}
