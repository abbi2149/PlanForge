import type { PlanConstraint, PlanWithMetrics, ConstraintViolation } from './types.js';

export function evaluateConstraint(plan: PlanWithMetrics, constraint: PlanConstraint): readonly ConstraintViolation[] {
  if (constraint.kind === 'max-makespan') {
    const limit = constraint.limit ?? 0;
    return (plan.makespan ?? 0) > limit
      ? [{ constraintId: constraint.id, code: 'CONSTRAINT_MAKESPAN', message: `makespan exceeds ${limit}`, severity: 'error' }]
      : [];
  }
  if (constraint.kind === 'max-late-orders') {
    const limit = constraint.limit ?? 0;
    return (plan.lateOrders?.length ?? 0) > limit
      ? [{ constraintId: constraint.id, code: 'CONSTRAINT_LATE_ORDERS', message: `late orders exceed ${limit}`, severity: 'error' }]
      : [];
  }
  if (constraint.kind === 'work-center-window') {
    const start = constraint.start ?? Number.MIN_SAFE_INTEGER;
    const end = constraint.end ?? Number.MAX_SAFE_INTEGER;
    const outside = plan.operations.filter(
      (operation) =>
        operation.workCenterId === constraint.workCenterId &&
        (operation.startMinute < start || operation.endMinute > end),
    );
    return outside.map((operation) => ({
      constraintId: constraint.id,
      code: 'CONSTRAINT_WORK_CENTER_WINDOW',
      message: `${operation.orderId}/${operation.operationId} is outside the allowed work-center window`,
      severity: 'error' as const,
    }));
  }
  const deadline = constraint.end ?? Number.MAX_SAFE_INTEGER;
  const completion = Math.max(
    0,
    ...plan.operations.filter((operation) => operation.orderId === constraint.orderId).map((operation) => operation.endMinute),
  );
  return completion > deadline
    ? [{ constraintId: constraint.id, code: 'CONSTRAINT_ORDER_DEADLINE', message: `${constraint.orderId} completes after ${deadline}`, severity: 'error' }]
    : [];
}
