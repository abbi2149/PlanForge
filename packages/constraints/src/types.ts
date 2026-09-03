import type { Minute, ProductionPlan, WorkCenterId } from '@planforge/model';

export interface PlanConstraint {
  readonly id: string;
  readonly kind: 'max-makespan' | 'max-late-orders' | 'work-center-window' | 'order-deadline';
  readonly workCenterId?: WorkCenterId;
  readonly orderId?: string;
  readonly start?: Minute;
  readonly end?: Minute;
  readonly limit?: number;
}

export interface ConstraintViolation {
  readonly constraintId: string;
  readonly code: string;
  readonly message: string;
  readonly severity: 'warning' | 'error';
}

export interface ConstraintEvaluation {
  readonly planDigest: string;
  readonly violations: readonly ConstraintViolation[];
  readonly valid: boolean;
}

export type PlanWithMetrics = ProductionPlan & {
  readonly makespan?: Minute;
  readonly lateOrders?: readonly string[];
};
