import { failure, success, type ModelResult } from '@planforge/model';
import type { InventoryPolicy } from './types.js';

export function validateInventoryPolicy(policy: InventoryPolicy): ModelResult<InventoryPolicy> {
  if (policy.minimum < 0 || policy.maximum < policy.minimum || policy.safety < 0 || policy.safety > policy.maximum || policy.reviewPeriods <= 0) {
    return failure({ code: 'INVENTORY_POLICY', message: `invalid inventory policy for ${policy.itemId}` });
  }
  return success(policy);
}
