import type { ObjectiveWeights, PlanLike, PlanScore } from './types.js';
import { scorePlan } from './score.js';

export interface SensitivityPoint {
  readonly label: string;
  readonly weights: ObjectiveWeights;
  readonly score: PlanScore;
}

export function normalizeObjectiveWeights(weights: ObjectiveWeights): ObjectiveWeights {
  const total = Math.abs(weights.makespan) + Math.abs(weights.lateOrders) + Math.abs(weights.warningCount);
  if (total === 0) return { makespan: 0, lateOrders: 0, warningCount: 0 };
  return {
    makespan: weights.makespan / total,
    lateOrders: weights.lateOrders / total,
    warningCount: weights.warningCount / total,
  };
}

export function scoreSensitivity(
  plan: PlanLike,
  variants: readonly Readonly<{ label: string; weights: ObjectiveWeights }>[],
): readonly SensitivityPoint[] {
  return [...variants]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((variant) => {
      const weights = normalizeObjectiveWeights(variant.weights);
      return { label: variant.label, weights, score: scorePlan(plan, weights) };
    });
}

export function stableAcrossWeights(points: readonly SensitivityPoint[], tolerance: number): boolean {
  if (points.length <= 1) return true;
  const scores = points.map((point) => point.score.score);
  return Math.max(...scores) - Math.min(...scores) <= Math.max(0, tolerance);
}
