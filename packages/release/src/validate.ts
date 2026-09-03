import { failure, success, type ModelResult } from '@planforge/model';
import type { ReleasePolicy } from './types.js';

export function validateReleasePolicy(policy: ReleasePolicy): ModelResult<ReleasePolicy> {
  if (policy.maximumWipQuantity <= 0 || policy.lookaheadMinutes < 0 || !Number.isSafeInteger(policy.priorityFloor)) {
    return failure({ code: 'RELEASE_POLICY', message: 'invalid order-release policy' });
  }
  return success(policy);
}
