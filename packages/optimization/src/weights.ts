import { failure, success, type ModelResult } from '@planforge/model';
import type { ObjectiveWeights } from './types.js';

export function validateWeights(weights: ObjectiveWeights): ModelResult<ObjectiveWeights> {
  for (const [name, value] of Object.entries(weights)) {
    if (!Number.isFinite(value) || value < 0) return failure({ code: 'OPTIMIZATION_WEIGHT', message: `${name} must be finite and non-negative` });
  }
  if (weights.makespan + weights.lateOrders + weights.warningCount === 0) {
    return failure({ code: 'OPTIMIZATION_WEIGHT', message: 'at least one objective weight must be positive' });
  }
  return success(weights);
}
