import { failure, success, type ModelResult } from '@planforge/model';
import type { ReplenishmentPolicy } from './types.js';

export function validateReplenishmentPolicy(policy: ReplenishmentPolicy): ModelResult<ReplenishmentPolicy> {
  if (policy.reorderPoint < 0 || policy.targetLevel <= policy.reorderPoint || policy.leadMinutes < 0 || policy.orderMultiple <= 0) {
    return failure({ code: 'REPLENISHMENT_POLICY', message: `invalid policy for ${policy.itemId}` });
  }
  return success(policy);
}
