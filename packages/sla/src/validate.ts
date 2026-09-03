import { failure, success, type ModelResult } from '@planforge/model';
import type { SlaPolicy } from './types.js';

export function validateSlaPolicy(policy: SlaPolicy): ModelResult<SlaPolicy> {
  if (policy.id.length === 0 || policy.maximumLeadMinutes < 0 || policy.maximumLateMinutes < 0 || policy.minimumOnTimeBasisPoints < 0 || policy.minimumOnTimeBasisPoints > 10_000) {
    return failure({ code: 'SLA_POLICY', message: `invalid SLA policy ${policy.id}` });
  }
  return success(policy);
}
