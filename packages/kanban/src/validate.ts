import { failure, success, type ModelResult } from '@planforge/model';
import type { KanbanPolicy } from './types.js';

export function validateKanbanPolicy(policy: KanbanPolicy): ModelResult<KanbanPolicy> {
  if (policy.demandPerPeriod <= 0 || policy.containerQuantity <= 0 || policy.leadPeriods < 0) {
    return failure({ code: 'KANBAN_POLICY', message: `invalid kanban policy for ${policy.itemId}` });
  }
  if (policy.safetyBasisPoints < 0 || policy.safetyBasisPoints > 20_000) {
    return failure({ code: 'KANBAN_SAFETY', message: `invalid safety factor for ${policy.itemId}` });
  }
  return success(policy);
}
