import type { ConstraintEvaluation, PlanConstraint, PlanWithMetrics } from './types.js';
import { evaluateConstraint } from './evaluate.js';

export function evaluateConstraints(plan: PlanWithMetrics, constraints: readonly PlanConstraint[]): ConstraintEvaluation {
  const violations = [...constraints]
    .sort((a, b) => a.id.localeCompare(b.id))
    .flatMap((constraint) => evaluateConstraint(plan, constraint));
  return {
    planDigest: plan.digest,
    violations,
    valid: !violations.some((violation) => violation.severity === 'error'),
  };
}

export function violatedConstraintIds(evaluation: ConstraintEvaluation): readonly string[] {
  return [...new Set(evaluation.violations.map((violation) => violation.constraintId))].sort();
}
