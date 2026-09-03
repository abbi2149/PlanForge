import { failure, success, type ModelResult } from '@planforge/model';
import type { PlanConstraint } from './types.js';

export function validateConstraints(constraints: readonly PlanConstraint[]): ModelResult<readonly PlanConstraint[]> {
  const ids = new Set<string>();
  for (const constraint of constraints) {
    if (constraint.id.length === 0 || ids.has(constraint.id)) {
      return failure({ code: 'CONSTRAINT_ID', message: `invalid or duplicate constraint ${constraint.id}` });
    }
    ids.add(constraint.id);
    if ((constraint.kind === 'max-makespan' || constraint.kind === 'max-late-orders') && (constraint.limit ?? -1) < 0) {
      return failure({ code: 'CONSTRAINT_LIMIT', message: `${constraint.id} requires a non-negative limit` });
    }
    if (constraint.kind === 'work-center-window') {
      if (!constraint.workCenterId || constraint.start === undefined || constraint.end === undefined || constraint.end <= constraint.start) {
        return failure({ code: 'CONSTRAINT_WINDOW', message: `${constraint.id} has an invalid work-center window` });
      }
    }
    if (constraint.kind === 'order-deadline' && (!constraint.orderId || constraint.end === undefined)) {
      return failure({ code: 'CONSTRAINT_DEADLINE', message: `${constraint.id} requires an order and deadline` });
    }
  }
  return success([...constraints]);
}
