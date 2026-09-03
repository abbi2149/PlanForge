import { failure, success, type ModelResult } from '@planforge/model';
import type { ReworkDemand } from './types.js';

export function validateReworkDemands(demands: readonly ReworkDemand[]): ModelResult<readonly ReworkDemand[]> {
  for (const demand of demands) {
    if (demand.quantity <= 0 || demand.dueMinute < demand.availableMinute) {
      return failure({ code: 'REWORK_DEMAND', message: `invalid rework demand ${demand.orderId}` });
    }
  }
  return success([...demands]);
}
