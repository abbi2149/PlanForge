import type { ObjectiveWeights, PlanLike, PlanScore } from './types.js';

export function scorePlan(plan: PlanLike, weights: ObjectiveWeights): PlanScore {
  const components = {
    makespan: plan.makespan ?? 0,
    lateOrders: plan.lateOrders?.length ?? 0,
    warningCount: plan.warnings.length,
  };
  const score =
    components.makespan * weights.makespan +
    components.lateOrders * weights.lateOrders +
    components.warningCount * weights.warningCount;
  return { planDigest: plan.digest, score, components };
}
