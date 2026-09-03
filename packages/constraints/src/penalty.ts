import type { ConstraintEvaluation } from './types.js';

export interface ConstraintPenaltyWeights {
  readonly warning: number;
  readonly error: number;
}

export function constraintPenalty(
  evaluation: ConstraintEvaluation,
  weights: ConstraintPenaltyWeights = { warning: 1, error: 100 },
): number {
  return evaluation.violations.reduce(
    (total, violation) => total + (violation.severity === 'error' ? weights.error : weights.warning),
    0,
  );
}

export function penaltyByCode(evaluation: ConstraintEvaluation): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const violation of evaluation.violations) counts[violation.code] = (counts[violation.code] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}
