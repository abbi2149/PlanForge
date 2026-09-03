import { failure, success, type ModelResult } from '@planforge/model';
import type { PlanningInput } from './types.js';

export function validatePlanningInput(input: PlanningInput): ModelResult<PlanningInput> {
  if (input.horizon.end <= input.horizon.start || input.horizon.bucketMinutes <= 0) {
    return failure({ code: 'PLANNING_HORIZON', message: 'planning horizon is invalid' });
  }
  if ((input.horizon.end - input.horizon.start) % input.horizon.bucketMinutes !== 0) {
    return failure({ code: 'PLANNING_BUCKET', message: 'planning horizon must divide evenly into buckets' });
  }
  for (const [itemId, quantity] of Object.entries(input.openingInventory)) {
    if (quantity < 0) return failure({ code: 'PLANNING_INVENTORY', message: `opening inventory for ${itemId} is negative` });
  }
  return success(input);
}
