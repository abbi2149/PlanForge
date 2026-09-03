import type { ConstraintViolation } from './types.js';

export function errors(violations: readonly ConstraintViolation[]): readonly ConstraintViolation[] {
  return violations.filter((violation) => violation.severity === 'error');
}

export function warnings(violations: readonly ConstraintViolation[]): readonly ConstraintViolation[] {
  return violations.filter((violation) => violation.severity === 'warning');
}

export function violationsForConstraint(
  violations: readonly ConstraintViolation[],
  constraintId: string,
): readonly ConstraintViolation[] {
  return violations.filter((violation) => violation.constraintId === constraintId);
}
