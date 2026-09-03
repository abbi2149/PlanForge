import type { ScheduleResult } from '@planforge/scheduler';

export interface ParetoPoint {
  readonly name: string;
  readonly makespan: number;
  readonly lateOrders: number;
  readonly warnings: number;
  readonly plan: ScheduleResult;
}

export function paretoFront(plans: readonly ScheduleResult[]): readonly ParetoPoint[] {
  const points = plans.map((plan) => ({
    name: plan.name,
    makespan: plan.makespan,
    lateOrders: plan.lateOrders.length,
    warnings: plan.warnings.length,
    plan,
  }));
  return points
    .filter((candidate) => !points.some((other) =>
      other !== candidate &&
      other.makespan <= candidate.makespan &&
      other.lateOrders <= candidate.lateOrders &&
      other.warnings <= candidate.warnings &&
      (other.makespan < candidate.makespan || other.lateOrders < candidate.lateOrders || other.warnings < candidate.warnings),
    ))
    .sort((a, b) => a.makespan - b.makespan || a.lateOrders - b.lateOrders || a.name.localeCompare(b.name));
}
