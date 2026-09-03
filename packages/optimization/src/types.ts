import type { ProductionPlan } from '@planforge/model';
import type { DispatchRule, ScheduleInput, ScheduleResult } from '@planforge/scheduler';

export interface ObjectiveWeights {
  readonly makespan: number;
  readonly lateOrders: number;
  readonly warningCount: number;
}

export interface OptimizationCandidate {
  readonly dispatchRule: DispatchRule;
  readonly plan: ScheduleResult;
  readonly score: number;
}

export interface OptimizationInput {
  readonly schedule: Omit<ScheduleInput, 'dispatchRule'>;
  readonly dispatchRules: readonly DispatchRule[];
  readonly weights: ObjectiveWeights;
}

export interface PlanScore {
  readonly planDigest: string;
  readonly score: number;
  readonly components: Readonly<Record<string, number>>;
}

export type PlanLike = Pick<ProductionPlan, 'digest' | 'warnings'> & { readonly makespan?: number; readonly lateOrders?: readonly string[] };
