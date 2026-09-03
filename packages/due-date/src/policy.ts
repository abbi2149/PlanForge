import { failure, success, type ModelResult } from '@planforge/model';
import type { DueDatePolicy } from './types.js';

export function validateDueDatePolicy(policy: DueDatePolicy): ModelResult<DueDatePolicy> {
  if (policy.allowanceBasisPoints < 0 || policy.allowanceBasisPoints > 100_000 || policy.minimumAllowanceMinutes < 0) {
    return failure({ code: 'DUE_DATE_POLICY', message: 'invalid due-date policy' });
  }
  return success(policy);
}
